// donation-chart-service.ts

const API_BASE_URL: string = 'http://localhost:5107'; // Or your deployed API URL

// Interface for monthly donation data point used in the chart
export interface MonthlyDonationData {
  month: string;
  donations: number; // Count of donations
  TotalAmount: number; // Total amount donated
}

// Interface for the filters to pass when fetching chart data
export interface DonationChartFilters {
  orgId?: string | number | null;
  timeRange?: 'Last 12 months' | 'Last 6 months' | 'Last 30 days';
  // Additional filters could be added here
}

/**
 * Fetches monthly donation data for chart visualization
 * @param {DonationChartFilters} filters - Filtering criteria
 * @returns {Promise<MonthlyDonationData[]>} Monthly donation data for chart
 */
export const fetchDonationChartData = async (filters: DonationChartFilters = {}): Promise<MonthlyDonationData[]> => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Calculate date range based on timeRange filter
  const endDate = new Date();
  let startDate = new Date();
  
  switch (filters.timeRange) {
    case 'Last 6 months':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case 'Last 30 days':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case 'Last 12 months':
    default:
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }

  // Format dates for API
  const formattedStartDate = startDate.toISOString().split('T')[0];
  const formattedEndDate = endDate.toISOString().split('T')[0];

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (filters.orgId) {
    queryParams.append('orgId', String(filters.orgId));
  }
  queryParams.append('startDate', formattedStartDate);
  queryParams.append('endDate', formattedEndDate);

  const queryString = queryParams.toString();
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
    
    // Process raw donation data into monthly aggregates
    const monthlyData = processMonthlyDonationData(donations, startDate, endDate);
    return monthlyData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while fetching donation chart data.');
  }
};

/**
 * Processes raw donation data into monthly aggregates
 * @param {any[]} donations - Raw donation data from API
 * @param {Date} startDate - Start date for the time range
 * @param {Date} endDate - End date for the time range
 * @returns {MonthlyDonationData[]} Processed monthly data
 */
function processMonthlyDonationData(donations: any[], startDate: Date, endDate: Date): MonthlyDonationData[] {
  // Create an array of all months in the range
  const months: MonthlyDonationData[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize the result array with zeroed data for each month in range
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const monthKey = monthNames[currentDate.getMonth()];
    months.push({
      month: monthKey,
      donations: 0,
      TotalAmount: 0
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
    // Avoid infinite loop if end date is in the future
    if (months.length >= 12) break;
  }
  
  // Aggregate donation data by month
  donations.forEach(donation => {
    const donationDate = new Date(donation.donationDate);
    const monthIndex = donationDate.getMonth();
    const monthKey = monthNames[monthIndex];
    
    // Find the corresponding month in our array
    const monthData = months.find(m => m.month === monthKey);
    if (monthData) {
      monthData.donations += 1;
      monthData.TotalAmount += donation.donationAmount || 0;
    }
  });
  
  return months;
}