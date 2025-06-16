import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BadgeDollarSign,
  TrendingUp,
  AlertCircle,
  Plus,
  MoreHorizontal
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

interface Donor {
  donorId: number;
  userEmail: string;
  name: string;
  document?: string;
  phone?: string;
  birthDate?: string;
  imageUrl?: string;
  totalDonations: number;
  averageDonation: number;
  donationCount: number;
  lastDonationDate: string;
  isRecurring: boolean;
}

interface DonorFilters {
  orgId?: string | number | null;
  searchTerm?: string;
  sortBy?: 'name' | 'totalDonations' | 'lastDonation' | 'donationCount';
  sortOrder?: 'asc' | 'desc';
}

const Donors = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'totalDonations' | 'lastDonation' | 'donationCount'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [donations, setDonations] = useState<DonationActivity[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);

  // Function to fetch donations and process donor data
  const fetchRecentDonations = async () => {
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
            userEmail: "unknown@email.com",
            name: "Unknown Donor",
            totalDonations: 0,
            averageDonation: 0,
            donationCount: 0,
            lastDonationDate: "",
            isRecurring: false
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
        
        // Calculate donor statistics from donations
        const donorDonations = donationsForOrg.filter(d => d.donorId === donorId);
        const totalDonations = donorDonations.reduce((sum, d) => sum + d.donationAmount, 0);
        const donationCount = donorDonations.length;
        const averageDonation = donationCount > 0 ? totalDonations / donationCount : 0;
        const lastDonationDate = donorDonations.length > 0 
          ? donorDonations.sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())[0].donationDate
          : "";
        const isRecurring = donationCount > 1;

        return {
          donorId,
          userEmail: data.userEmail || "unknown@email.com",
          name: profile?.name || "Unknown Donor",
          document: profile?.document,
          phone: profile?.phone,
          birthDate: profile?.birthDate,
          imageUrl: profile?.imageUrl,
          totalDonations,
          averageDonation,
          donationCount,
          lastDonationDate,
          isRecurring
        };
      });

      const donorsData = await Promise.all(donorRequests);
      setDonors(donorsData);

      const donorMap = new Map<number, string>(
        donorsData.map(({ donorId, name }) => [donorId, name])
      );

      // Enrich donations with donorName
      const decorated = donationsForOrg.map((don) => ({
        ...don,
        donorName: donorMap.get(don.donorId) ?? "Unknown donor",
      }));

      // Sort by donation date (most recent first) and take the first 10
      const sortedDonations = decorated
        .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())
        .slice(0, 10);
      
      setDonations(sortedDonations);
    } catch (err) {
      console.error('Error fetching recent donations:', err);
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
          fetchRecentDonations()
        ]);

        setOrgProfile(profileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error loading donors data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate summary statistics
  const totalDonors = donors.length;
  const totalDonationsAmount = donors.reduce((sum, donor) => sum + donor.totalDonations, 0);
  const averageDonationPerDonor = totalDonors > 0 ? totalDonationsAmount / totalDonors : 0;
  const recurringDonors = donors.filter(donor => donor.isRecurring).length;

  // Filter and sort donors
  const filteredDonors = donors
    .filter(donor => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        donor.name.toLowerCase().includes(searchLower) ||
        donor.userEmail.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {

        case 'totalDonations':
          aValue = a.totalDonations;
          bValue = b.totalDonations;
          break;
        case 'donationCount':
          aValue = a.donationCount;
          bValue = b.donationCount;
          break;
        case 'lastDonation':
          aValue = new Date(a.lastDonationDate).getTime();
          bValue = new Date(b.lastDonationDate).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
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
      day: 'numeric'
    });
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
                <p className="mt-4 text-muted-foreground">Loading donors data...</p>
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
            <h1 className="text-2xl font-bold">Donors</h1>
            <p className="text-muted-foreground">Manage and view your organization's donors</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDonors}</div>
                <p className="text-xs text-muted-foreground">Active contributors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalDonationsAmount)}</div>
                <p className="text-xs text-muted-foreground">From all donors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average per Donor</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(averageDonationPerDonor)}</div>
                <p className="text-xs text-muted-foreground">Lifetime average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recurring Donors</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recurringDonors}</div>
                <p className="text-xs text-muted-foreground">
                  {totalDonors > 0 ? Math.round((recurringDonors / totalDonors) * 100) : 0}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search donors by name or email..."
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
                <option value="name">Sort by Name</option>
                <option value="totalDonations">Sort by Total Donated</option>
                <option value="donationCount">Sort by Donation Count</option>
                <option value="lastDonation">Sort by Last Donation</option>
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

          {/* Donors Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Donor</th>
                      <th className="text-left p-3 font-medium">Contact</th>
                      <th className="text-left p-3 font-medium">Document</th>
                      <th className="text-left p-3 font-medium">Total Donated</th>
                      <th className="text-left p-3 font-medium">Donations</th>
                      <th className="text-left p-3 font-medium">Last Donation</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonors.map((donor) => (
                      <tr key={donor.donorId} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              {donor.imageUrl ? (
                                <img 
                                  src={donor.imageUrl} 
                                  alt={donor.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-blue-600">
                                  {donor.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{donor.name}</p>
                              <p className="text-sm text-gray-500">ID: {donor.donorId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="truncate max-w-[150px]">{donor.userEmail}</span>
                            </div>
                            {donor.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                <span>{donor.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            {donor.document ? (
                              <div className="flex items-center">
                                <span>Doc: {donor.document}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{formatCurrency(donor.totalDonations)}</div>
                          <div className="text-sm text-gray-500">
                            Avg: {formatCurrency(donor.averageDonation)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{donor.donationCount}</div>
                          <div className="text-sm text-gray-500">donations</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{donor.lastDonationDate}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {donor.isRecurring ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Recurring
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              One-time
                            </span>
                          )}
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
                
                {filteredDonors.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No donors found matching your search.' : 'No donors found.'}
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

export default Donors;