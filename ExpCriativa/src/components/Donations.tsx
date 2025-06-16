import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  BadgeDollarSign, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CreditCard, 
  TrendingUp,
  AlertCircle,
  Download,
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

// Interfaces
interface Donation {
  donationId: number;
  donorId: number;
  donorName: string;
  donorEmail: string;
  donationAmount: number;
  donationDate: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  isRecurring: boolean;
  campaign?: string;
  notes?: string;
  transactionId?: string;
}

interface DonationFilters {
  orgId?: string | number | null;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'donor' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Service function
const fetchDonations = async (filters: DonationFilters = {}): Promise<Donation[]> => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const queryParams = new URLSearchParams();
  if (filters.orgId) {
    queryParams.append('orgId', String(filters.orgId));
  }
  if (filters.searchTerm) {
    queryParams.append('search', filters.searchTerm);
  }
  if (filters.startDate) {
    queryParams.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    queryParams.append('endDate', filters.endDate);
  }
  if (filters.status) {
    queryParams.append('status', filters.status);
  }
  if (filters.minAmount) {
    queryParams.append('minAmount', String(filters.minAmount));
  }
  if (filters.maxAmount) {
    queryParams.append('maxAmount', String(filters.maxAmount));
  }
  if (filters.sortBy) {
    queryParams.append('sortBy', filters.sortBy);
  }
  if (filters.sortOrder) {
    queryParams.append('sortOrder', filters.sortOrder);
  }

  const queryString = queryParams.toString();
  const API_BASE_URL = 'https://localhost:7142';
  const requestUrl = `${API_BASE_URL}/api/Donations${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} ${errorData}`);
    }

    const donations = await response.json();
    
    // Process and format donation data
    return donations.map((donation: any) => ({
      donationId: donation.donationId,
      donorId: donation.donorId,
      donorName: donation.donorName || `${donation.donorFirstName || ''} ${donation.donorLastName || ''}`.trim(),
      donorEmail: donation.donorEmail || '',
      donationAmount: donation.donationAmount || 0,
      donationDate: donation.donationDate || '',
      paymentMethod: donation.paymentMethod || 'Unknown',
      status: donation.status?.toLowerCase() || 'pending',
      isRecurring: donation.isRecurring || false,
      campaign: donation.campaign,
      notes: donation.notes,
      transactionId: donation.transactionId,
    }));
  } catch (error) {
    console.error('Error fetching donations:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while fetching donations.');
  }
};

const Donations = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'donor' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileData, donationsData] = await Promise.all([
          fetchCurrentOrgProfile(),
          fetchDonations({ 
            orgId: localStorage.getItem("userId"),
            sortBy,
            sortOrder,
            status: statusFilter === 'all' ? undefined : statusFilter
          })
        ]);

        setOrgProfile(profileData);
        setDonations(donationsData);
        setFilteredDonations(donationsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Error loading donations data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sortBy, sortOrder, statusFilter]);

  // Filter donations based on search term
  useEffect(() => {
    const filtered = donations.filter(donation => 
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donationId.toString().includes(searchTerm)
    );
    setFilteredDonations(filtered);
  }, [searchTerm, donations]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary stats
  const totalDonations = filteredDonations.length;
  const totalAmount = filteredDonations.reduce((sum, donation) => sum + donation.donationAmount, 0);
  const completedDonations = filteredDonations.filter(d => d.status === 'completed');
  const completedAmount = completedDonations.reduce((sum, donation) => sum + donation.donationAmount, 0);
  const recurringDonations = filteredDonations.filter(d => d.isRecurring).length;

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
        
        <div className="flex flex-col space-y-6 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
              <p className="text-muted-foreground">
                Manage and track all donations to your organization
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  {totalDonations} donations total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(completedAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  {completedDonations.length} completed donations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recurring</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recurringDonations}</div>
                <p className="text-xs text-muted-foreground">
                  Active recurring donations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalDonations > 0 ? formatCurrency(totalAmount / totalDonations) : '$0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per donation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by donor name, email, or donation ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'date' | 'amount' | 'donor' | 'status');
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
                <option value="donor-asc">Donor (A-Z)</option>
                <option value="donor-desc">Donor (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Donations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Donations ({filteredDonations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredDonations.length === 0 ? (
                <div className="text-center py-8">
                  <BadgeDollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No donations found</p>
                  {searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filters
                    </p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Donor</th>
                        <th className="text-left py-3 px-4 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Payment</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.map((donation) => (
                        <tr key={donation.donationId} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <User className="h-8 w-8 text-muted-foreground bg-muted rounded-full p-2" />
                              <div>
                                <div className="font-medium">{donation.donorName || 'Anonymous'}</div>
                                <div className="text-sm text-muted-foreground">
                                  {donation.donorEmail || 'No email'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{formatCurrency(donation.donationAmount)}</div>
                            {donation.transactionId && (
                              <div className="text-xs text-muted-foreground">
                                ID: {donation.transactionId}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">{formatDate(donation.donationDate)}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{donation.paymentMethod}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(donation.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              donation.isRecurring 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {donation.isRecurring ? 'Recurring' : 'One-time'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Donations;