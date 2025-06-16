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
  donationDate: string;
  donationAmount: number;
  donationStatus?: string | null;
  donationIsAnonymous?: boolean;
  donationDonorMessage?: string | null;
  donorId: number; 
  orgId: number;   
  orgName: string;
  donorName: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface DonationStatsFilters {
  orgId?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
  // Add other potential filters if your API supports them
  // donationStatus?: string | null;
}

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
    const donationsForOrg = filters.orgId
        ? donations.filter((d) => String(d.orgId) === String(filters.orgId))
        : donations;
    console.log(donationsForOrg)

    let totalDonations = 0;
    const donorIds = new Set<number>();

    donationsForOrg.forEach((donation: DonationDto) => {
      if (typeof donation.donationAmount === 'number') {
        totalDonations += donation.donationAmount;
      }
      // Ensure donorId is valid before adding to set
      if (typeof donation.donorId === 'number') {
        donorIds.add(donation.donorId);
      }
    });

    const donorCount = donorIds.size;
    const avgDonation = donorCount > 0 ? totalDonations / donationsForOrg.length : 0;

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
export interface DonationFullResult{
  donations: DonationDto[];   // full objects returned
}

export const fetchDonationfull = async (
  filters: DonationStatsFilters = {}
): Promise<DonationFullResult> => {
  const token = getToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;


  const requestUrl = `${API_BASE_URL}/api/Donations`;

  try {
    /* 1️⃣ fetch */
    const resp = await fetch(requestUrl, { headers });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`API Error: ${resp.status} ${errText}`);
    }

    /* 2️⃣ raw list straight from server */
    const donations = (await resp.json()) as DonationDto[];

    /* 3️⃣ optional client-side org filter safeguard */
    const donationsForOrg =
      filters.orgId != null
        ? donations.filter((d) => String(d.orgId) === String(filters.orgId))
        : donations;

    /* 4️⃣ compute stats */
    let totalDonations = 0;
    const donorIds = new Set<number>();

    donationsForOrg.forEach((d) => {
      totalDonations += d.donationAmount ?? 0;
      if (typeof d.donorId === "number") donorIds.add(d.donorId);
    });



    /* 5️⃣ return BOTH stats + full objects */
    return {
      donations: donationsForOrg
    };
  } catch (err) {
    console.error("Error fetching donation statistics:", err);
    if (err instanceof Error) throw err;
    throw new Error(
      "An unknown error occurred while fetching donation statistics."
    );
  }
};