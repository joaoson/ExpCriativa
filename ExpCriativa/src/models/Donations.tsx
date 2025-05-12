export interface Donations {
    donationId: number,
    donationMethod: string,
    donationDate: Date,
    donationAmount: number,
    donationStatus: string,
    donationIsAnonymous: boolean,
    donationDonorMessage: string,
    donorId: number,
    orgId: number
}