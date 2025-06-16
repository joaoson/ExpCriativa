export interface RecentDonation {
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