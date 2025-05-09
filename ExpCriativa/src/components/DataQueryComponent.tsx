// DataQueryComponent.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeDollarSign, Search, Calendar, Filter, Loader2 } from 'lucide-react'; // Added Loader2 for spinner

// Import the service functions and interfaces
import {
  fetchOrganizations,
  fetchDonationStats,
  Organization, // Interface for dropdown options
  DonationStatsFilters,
  DonationStats // Interface for the results
} from '../service/data-query-service'; // Adjust the path if necessary

interface DataQueryComponentProps {
  onQueryChange?: (stats: DonationStats) => void;
}

const DataQueryComponent: React.FC<DataQueryComponentProps> = ({ onQueryChange }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgId, setOrgId] = useState<string>(''); // Keep as string initially from select value
  const [dateRange, setDateRange] = useState<string>('all');

  const [queryResults, setQueryResults] = useState<DonationStats | null>(null); // Start with null or initial zeros
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orgLoading, setOrgLoading] = useState<boolean>(true); // Loading state for organizations
  const [error, setError] = useState<string | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null); // Error state for organizations

  // --- Fetch Organizations on Component Mount ---
  useEffect(() => {
    const loadOrganizations = async () => {
      setOrgLoading(true);
      setOrgError(null);
      try {
        const data = await fetchOrganizations();
        setOrganizations(data);
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
        setOrgError("Failed to load organizations.");
      } finally {
        setOrgLoading(false);
      }
    };

    loadOrganizations();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Date Range Calculation Helper ---
  const getDateRangeDates = (range: string): { startDate: string | null, endDate: string | null } => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (range) {
      case 'month':
        startDate = new Date(year, month, 1);
        endDate = new Date(year, month + 1, 0); // Last day of the current month
        break;
      case 'quarter':
        const quarter = Math.floor(month / 3);
        startDate = new Date(year, quarter * 3, 1);
        endDate = new Date(year, quarter * 3 + 3, 0); // Last day of the quarter's last month
        break;
      case 'year':
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31);
        break;
      case 'all':
      default:
        // No dates means 'all time'
        break;
    }

    return {
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    };
  };

  // --- Handle Query Submission ---
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null); // Clear previous query errors

    const { startDate, endDate } = getDateRangeDates(dateRange);

    // Prepare filters for the service call
    const filters: DonationStatsFilters = {
      orgId: orgId ? Number(orgId) : null, // Convert orgId to number or null
      startDate,
      endDate,
    };

    try {
      const stats = await fetchDonationStats(filters);
      setQueryResults(stats);

      // Notify parent component
      if (onQueryChange) {
        onQueryChange(stats);
      }
    } catch (err) {
      console.error("Failed to fetch donation statistics:", err);
      setError("Failed to fetch donation statistics. Please try again.");
      setQueryResults(null); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Data Query Tool
        </CardTitle>
        <Filter size={18} className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleQuerySubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="orgId" className="text-sm font-medium">
                Organization
              </label>
              <div className="flex">
                <select
                  id="orgId"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  disabled={orgLoading || !!orgError} // Disable if loading or error
                >
                  <option value="">
                    {orgLoading ? 'Loading Organizations...' : orgError ? 'Error loading organizations' : 'Select Organization'}
                  </option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
              {orgError && <p className="text-sm text-red-500">{orgError}</p>}
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="dateRange" className="text-sm font-medium">
                Date Range
              </label>
              <div className="flex">
                <select
                  id="dateRange"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="year">This Year</option>
                  <option value="quarter">This Quarter</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:pt-6">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Run Query
              </button>
            </div>
          </div>
        </form>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* Display results only if queryResults is not null */}
        {queryResults ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border border-border shadow-sm">
              <div className="flex items-center">
                <BadgeDollarSign className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-sm font-medium">Total Donations</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">${queryResults.totalDonations.toLocaleString()}</p>
            </div>

            <div className="bg-background p-4 rounded-lg border border-border shadow-sm">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-sm font-medium">Donor Count</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{queryResults.donorCount.toLocaleString()}</p>
            </div>

            <div className="bg-background p-4 rounded-lg border border-border shadow-sm">
              <div className="flex items-center">
                <BadgeDollarSign className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-sm font-medium">Average Donation</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">${queryResults.avgDonation.toLocaleString()}</p>
            </div>
          </div>
        ) : (
           // Optional: Display a message or initial state when no results are loaded
           <div className="mt-6 text-center text-muted-foreground">
             Run a query to see donation statistics.
           </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataQueryComponent;