// data-query-service.ts

// Replace with your actual API base URL
const API_BASE_URL: string = 'https://localhost:7142'; // Or your deployed API URL

// --- Interfaces based on swagger.json and component usage ---

interface OrgDto {
  orgId: number;
  orgDescription?: string | null;
  orgWebsiteUrl?: string | null;
  orgLocation?: string | null;
  orgFoundationDate?: string; // Assuming date-time string
  adminName?: string | null;
  adminPhone?: string | null;
}

interface DonationDto {
  donationId: number;
  donationMethod?: string | null;
  donationDate: string; // Assuming date-time string
  donationAmount: number;
  donationStatus?: string | null;
  donationIsAnonymous?: boolean;
  donationDonorMessage?: string | null;
  donorId: number; // Assuming non-nullable as it's key for donorCount
  orgId: number;   // Assuming non-nullable
}

// Interface for the data structure expected by the component for organizations
export interface Organization {
  id: number;
  name: string;
}

// Interface for the filters passed to fetchDonationStats
export interface DonationStatsFilters {
  orgId?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
  // Add other potential filters if your API supports them
  // donationStatus?: string | null;
}

// Interface for the return type of fetchDonationStats
export interface DonationStats {
  totalDonations: number;
  donorCount: number;
  avgDonation: number;
}

/**
 * Placeholder for getting the authentication token.
 * In a real application, you would get this from localStorage, context, etc.
 * @returns {string | null} The bearer token
 */
const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * Fetches the list of organizations from the API.
 * Assumes the API endpoint is GET /api/Orgs as per swagger.json
 * @returns {Promise<Organization[]>} A promise that resolves to an array of organization objects.
 */
export const fetchOrganizations = async (): Promise<Organization[]> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/Orgs`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} ${errorData}`);
    }

    const orgsData = (await response.json()) as OrgDto[];

    return orgsData.map((org: OrgDto): Organization => ({
      id: org.orgId,
      name: org.orgDescription || `Organization ${org.orgId}`,
    }));
  } catch (error) {
    console.error('Error fetching organizations:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred while fetching organizations.');
  }
};

/**
 * Fetches donation statistics based on the provided filters.
 * IMPORTANT ASSUMPTION: This function assumes your API's /api/Donations endpoint
 * supports filtering via query parameters like ?orgId=X&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD.
 *
 * @param {DonationStatsFilters} filters - An object containing filter criteria.
 * @returns {Promise<DonationStats>}
 */
export const fetchDonationStats = async (filters: DonationStatsFilters = {}): Promise<DonationStats> => {
  const token = getToken();
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
  if (filters.startDate) {
    queryParams.append('startDate', filters.startDate);
  }
  if (filters.endDate) {
    queryParams.append('endDate', filters.endDate);
  }
  // if (filters.donationStatus) {
  //   queryParams.append('status', filters.donationStatus);
  // }

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

    const donations = (await response.json()) as DonationDto[];

    let totalDonations = 0;
    const donorIds = new Set<number>();

    donations.forEach((donation: DonationDto) => {
      if (typeof donation.donationAmount === 'number') {
        totalDonations += donation.donationAmount;
      }
      // Ensure donorId is valid before adding to set
      if (typeof donation.donorId === 'number') {
        donorIds.add(donation.donorId);
      }
    });

    const donorCount = donorIds.size;
    const avgDonation = donorCount > 0 ? totalDonations / donorCount : 0;

    return {
      totalDonations: totalDonations,
      donorCount: donorCount,
      avgDonation: avgDonation,
    };
  } catch (error) {
    console.error('Error fetching donation statistics:', error);
     if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unknown error occurred while fetching donation statistics.');
  }
};
export interface DonationStats {
  totalDonations: number;   // soma de todos os valores doados
  donorCount: number;       // quantidade de doadores únicos
  avgDonation: number;      // média doada por doador
}