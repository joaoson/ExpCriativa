export interface DonorResponse {
    id: number,
    userEmail: string,
    role: number,
    donorProfile: DonorProfileResponse
}

export interface DonorProfileResponse {
    userId: number,
    name: string,
    document: string,
    phone: string,
    birthDate: string
}