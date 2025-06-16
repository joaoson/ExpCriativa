// organization-settings-service.ts

// Replace with your actual API base URL
const API_BASE_URL: string = 'https://localhost:7142'; // Or your deployed API URL

// --- Interfaces based on your organization structure ---

export interface OrgProfile {
  id: number;
  orgName: string;
  phone: string;
  document: string;
  address: string;
  description: string;
  adminName: string;
  imageUrl?: string | null;
  orgWebsiteUrl?: string | null;
  orgFoundationDate: string; // ISO date string
  adminPhone: string;
  userId: number;
  userEmail?: string;
}

export interface User {
  id: number;
  userEmail: string;
  role: number;
  userDateCreated: string;
  donorProfile?: any | null;
  orgProfile: OrgProfile;
}

// Interface for updating organization settings
export interface UpdateOrgSettingsRequest {
  orgName: string;
  phone: string;
  document: string;
  address: string;
  description: string;
  adminName: string;
  orgWebsiteUrl?: string | null;
  orgFoundationDate: string;
  adminPhone: string;
  imageFile?: File | null;
  clearImage?: boolean;
}

/**
 * Gets the authentication token from localStorage.
 * @returns {string | null} The bearer token
 */
const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * Gets the current user ID from localStorage.
 * @returns {string | null} The user ID
 */
const getUserId = (): string | null => {
  return localStorage.getItem('userId');
};

/**
 * Fetches all organizations from the API and finds the current user's organization.
 * @returns {Promise<OrgProfile>} A promise that resolves to the organization profile.
 */
export const fetchCurrentOrgProfile = async (): Promise<OrgProfile> => {
  const token = getToken();
  const currentUserId = getUserId();
  
  if (!currentUserId) {
    throw new Error('User ID not found in localStorage');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'accept': 'text/plain',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/orgs`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} ${errorData}`);
    }

    const organizations = (await response.json()) as OrgProfile[];

    // Find the organization that belongs to the current user
    const userOrg = organizations.find(org => org.userId.toString() === currentUserId);

    if (!userOrg) {
      throw new Error('Organization profile not found for current user');
    }

    return userOrg;
  } catch (error) {
    console.error('Error fetching organization profile:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while fetching organization profile.');
  }
};

/**
 * Updates the current user's organization settings using multipart/form-data.
 * @param {UpdateOrgSettingsRequest} settings - The updated organization settings
 * @returns {Promise<OrgProfile>} A promise that resolves to the updated organization profile.
 */
export const updateOrgSettings = async (settings: UpdateOrgSettingsRequest): Promise<OrgProfile> => {
  const token = getToken();
  const currentUserId = getUserId();
  
  if (!currentUserId) {
    throw new Error('User ID not found in localStorage');
  }

  // Create FormData for multipart/form-data request
  const formData = new FormData();
  
  // Add all the fields to FormData
  formData.append('OrgName', settings.orgName);
  formData.append('Phone', settings.phone);
  formData.append('Document', settings.document);
  formData.append('Address', settings.address);
  formData.append('Description', settings.description);
  formData.append('AdminName', settings.adminName);
  formData.append('AdminPhone', settings.adminPhone);
  
  // Handle optional fields
  if (settings.orgWebsiteUrl) {
    formData.append('OrgWebsiteUrl', settings.orgWebsiteUrl);
  }
  
  if (settings.orgFoundationDate) {
    // Convert date to ISO string if it's not already
    const dateValue = settings.orgFoundationDate.includes('T') 
      ? settings.orgFoundationDate 
      : `${settings.orgFoundationDate}T00:00:00.000Z`;
    formData.append('OrgFoundationDate', dateValue);
  }
  
  // Handle image file
  if (settings.imageFile) {
    formData.append('imageFile', settings.imageFile);
  } else {
    formData.append('imageFile', ''); // Empty file as shown in your curl
  }
  
  // Handle clear image flag
  if (settings.clearImage !== undefined) {
    formData.append('ClearImage', settings.clearImage.toString());
  }

  const headers: HeadersInit = {
    'accept': 'text/plain',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Note: Don't set Content-Type header - let the browser set it for FormData

  try {
    const response = await fetch(`${API_BASE_URL}/api/Users/${currentUserId}/profile/org`, {
      method: 'PUT',
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} ${errorData}`);
    }

    // Return the updated organization profile
    const updatedProfile = (await response.json()) as OrgProfile;
    return updatedProfile;
  } catch (error) {
    console.error('Error updating organization settings:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while updating organization settings.');
  }
};

/**
 * Updates organization settings with image upload integrated.
 * This combines the image upload and settings update into one call.
 * @param {UpdateOrgSettingsRequest} settings - The updated organization settings
 * @param {File | null} imageFile - Optional image file to upload
 * @param {boolean} clearImage - Whether to clear the existing image
 * @returns {Promise<OrgProfile>} A promise that resolves to the updated organization profile.
 */
export const updateOrgSettingsWithImage = async (
  settings: UpdateOrgSettingsRequest, 
  imageFile?: File | null, 
  clearImage: boolean = false
): Promise<OrgProfile> => {
  return updateOrgSettings({
    ...settings,
    imageFile,
    clearImage
  });
};

/**
 * Alternative method if you have a direct endpoint to get current user's organization
 * This would be more efficient than fetching all organizations
 * @returns {Promise<OrgProfile>} A promise that resolves to the organization profile.
 */
export const fetchCurrentOrgProfileDirect = async (): Promise<OrgProfile> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // This assumes you have an endpoint like /api/orgs/current or /api/orgs/me
    const response = await fetch(`${API_BASE_URL}/api/orgs/current`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} ${errorData}`);
    }

    const orgProfile = (await response.json()) as OrgProfile;
    return orgProfile;
  } catch (error) {
    console.error('Error fetching organization profile:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while fetching organization profile.');
  }
};