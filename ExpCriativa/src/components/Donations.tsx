import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Search, 
  Calendar,
  User,
  AlertCircle,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import {
  fetchCurrentOrgProfile,
  OrgProfile,
} from '@/service/organization-settings-service';

const API_BASE_URL = 'https://localhost:7142';

interface DonationActivity {
  donationId: number;
  donationMethod: string;
  donationDate: string;
  donationAmount: number;
  status: number;
  donationIsAnonymous: boolean;
  donationDonorMessage: string;
  donorId: number;
  orgId: number;
  donorName: string;
  orgName: string;
  donorImageUrl: string;
  orgImageUrl: string;
}

interface DonationFilters {
  orgId?: string | number | null;
  searchTerm?: string;
  sortBy?: 'donationDate' | 'donationAmount' | 'donorName' | 'status';
  sortOrder?: 'asc' | 'desc';
}

const Donations = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'donationDate' | 'donationAmount' | 'donorName' | 'status'>('donationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [donations, setDonations] = useState<DonationActivity[]>([]);

  // Function to fetch donations data
  const fetchDonations = async () => {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // Get current user's org ID from localStorage
      const orgId = localStorage.getItem("userId");
      console.log(orgId);
      
      const requestUrl = `${API_BASE_URL}/api/Donations`;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} ${errorData}`);
      }

      const donationsData = await response.json() as DonationActivity[];
      const orgIdStr = localStorage.getItem("userId");
      console.log(orgIdStr);
      console.log(donationsData);
      
      const donationsForOrg = orgIdStr
        ? donationsData.filter((d) => String(d.orgId) === String(orgIdStr))
        : donationsData;

      const uniqueDonorIds = [
        ...new Set(
          donationsForOrg
            .map((d) => d.donorId)
            .filter((id): id is number => id != null)
        ),
      ];

      const donorRequests = uniqueDonorIds.map(async (donorId) => {
        const resp = await fetch(`${API_BASE_URL}/api/Users/${donorId}`, { headers });

        if (!resp.ok) {
          console.error(
            `Couldn't fetch donor ${donorId}:`,
            resp.status,
            await resp.text()
          );
          return { 
            donorId, 
            name: "Unknown Donor"
          };
        }

        type UserApiResponse = { 
          id: number;
          userEmail: string;
          role: number;
          userDateCreated: string;
          donorProfile?: { 
            userId: number; 
            name: string;
            document?: string;
            phone?: string;
            birthDate?: string;
            imageUrl?: string;
          } 
        };

        const data: UserApiResponse = await resp.json();
        const profile = data.donorProfile;
        
        return {
          donorId,
          name: profile?.name || "Unknown Donor",
          imageUrl: profile?.imageUrl
        };
      });

      const donorsData = await Promise.all(donorRequests);
      const donorMap = new Map<number, { name: string; imageUrl?: string }>(
        donorsData.map(({ donorId, name, imageUrl }) => [donorId, { name, imageUrl }])
      );

      // Enrich donations with donor information
      const enrichedDonations = donationsForOrg.map((donation) => ({
        ...donation,
        donorName: donorMap.get(donation.donorId)?.name ?? "Unknown donor",
        donorImageUrl: donorMap.get(donation.donorId)?.imageUrl ?? "",
      }));

      setDonations(enrichedDonations);
    } catch (err) {
      console.error('Error fetching donations:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load both org profile and donations data
        const [profileData] = await Promise.all([
          fetchCurrentOrgProfile(),
          fetchDonations()
        ]);

        setOrgProfile(profileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error loading donations data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort donations
  const filteredDonations = donations
    .filter(donation => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        donation.donorName.toLowerCase().includes(searchLower) ||
        donation.donationMethod.toLowerCase().includes(searchLower) ||
        donation.donationDonorMessage?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'donationAmount':
          aValue = a.donationAmount;
          bValue = b.donationAmount;
          break;
        case 'donorName':
          aValue = a.donorName;
          bValue = b.donorName;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.donationDate).getTime();
          bValue = new Date(b.donationDate).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 0:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case -1:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar organizationName={orgProfile?.orgName || 'Charity'} />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <div className="flex flex-col space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading donations data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar organizationName={orgProfile?.orgName || 'Charity'} />
        <div className="flex-1 overflow-y-auto">
          <Header />
          <div className="flex flex-col space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <p className="mt-4 text-red-600">Error loading data: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={orgProfile?.orgName || 'Charity'} />
      <div className="flex-1 overflow-y-auto">
        <Header />
        
        <div className="flex flex-col space-y-6 p-6 animate-fade-in">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Donations</h1>
            <p className="text-muted-foreground">View and manage all donations to your organization</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search donations by donor name, method, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-lg bg-white text-sm"
              >
                <option value="donationDate">Sort by Date</option>
                <option value="donationAmount">Sort by Amount</option>
                <option value="donorName">Sort by Donor</option>
                <option value="status">Sort by Status</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Donations Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Donation ID</th>
                      <th className="text-left p-3 font-medium">Donor</th>
                      <th className="text-left p-3 font-medium">Amount</th>
                      <th className="text-left p-3 font-medium">Method</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Message</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((donation) => (
                      <tr key={donation.donationId} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium">#{donation.donationId}</div>
                          {donation.donationIsAnonymous && (
                            <div className="text-xs text-gray-500">Anonymous</div>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              {donation.donorImageUrl ? (
                                <img 
                                  src={donation.donorImageUrl} 
                                  alt={donation.donorName}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-blue-600">
                                  {donation.donorName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{donation.donorName}</p>
                              <p className="text-sm text-gray-500">ID: {donation.donorId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-green-600">
                            {formatCurrency(donation.donationAmount)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            {donation.donationMethod}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{formatDate(donation.donationDate)}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(donation.status)}
                        </td>
                        <td className="p-3">
                          <div className="text-sm max-w-[200px] truncate">
                            {donation.donationDonorMessage || '—'}
                          </div>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredDonations.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No donations found matching your search.' : 'No donations found.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Donations;