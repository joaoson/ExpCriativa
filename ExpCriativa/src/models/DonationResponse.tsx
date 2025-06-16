export interface DonationResponse {
    donationId: number,
    donationMethod: string,
    donationDate: Date,
    donationAmount: number,
    status: number,
    donationIsAnonymous: boolean,
    donationDonorMessage: string,
    donorId: number,
    orgId: number
    orgName?: string,
}