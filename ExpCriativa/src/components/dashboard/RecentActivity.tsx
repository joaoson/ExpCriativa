import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Interface for the donation data from your API
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

const API_BASE_URL = 'https://localhost:7142';

const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const getBadgeVariant = (method: string): "default" | "outline" | "secondary" | "destructive" => {
  const variants: Record<string, "default" | "outline" | "secondary" | "destructive"> = {
    'Credit Card': "default",
    'PayPal': "secondary",
    'Bank Transfer': "outline",
    'Cash': "secondary",
    'Cryptocurrency': "default",
  };
  
  return variants[method] || "outline";
};

const formatTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    // If the date is in the future, show "just now"
    if (diffInMs < 0) {
      return "just now";
    }
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      // For dates older than 30 days, show the actual date
      return date.toLocaleDateString();
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return "Invalid date";
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

const RecentActivity = () => {
  const [donations, setDonations] = useState<DonationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      const token = getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        // Get current user's org ID from localStorage
        const orgId = localStorage.getItem("userId");
        const queryParams = new URLSearchParams();
        
        if (orgId) {
          queryParams.append('orgId', orgId);
        }
        
        const queryString = queryParams.toString();
        const requestUrl = `${API_BASE_URL}/api/Donations${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API Error: ${response.status} ${errorData}`);
        }

        const donationsData = await response.json() as DonationActivity[];
        
        // Sort by donation date (most recent first) and take the first 10
        const sortedDonations = donationsData
          .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())
          .slice(0, 10);
        
        setDonations(sortedDonations);
      } catch (err) {
        console.error('Error fetching recent donations:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching recent donations.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDonations();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading recent donations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (donations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No recent donations found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {donations.map((donation) => (
            <div key={donation.donationId} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage 
                  src={donation.donorImageUrl} 
                  alt={donation.donationIsAnonymous ? "Anonymous" : donation.donorName} 
                />
                <AvatarFallback className="bg-lumen-100 text-lumen-700">
                  {donation.donationIsAnonymous ? "A" : getInitials(donation.donorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">
                    {donation.donationIsAnonymous ? "Anonymous" : donation.donorName}
                  </span>
                  <span className="text-gray-500"> donated </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(donation.donationAmount)}
                  </span>
                </p>
                <p className="flex items-center text-xs text-gray-500">
                  {formatTimeAgo(donation.donationDate)}
                </p>
              </div>
              <Badge variant={getBadgeVariant(donation.donationMethod)}>
                {donation.donationMethod}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;