import DonationsFilter from "@/components/DonationsFilter";
import Navbar, { LabelProp } from "@/components/Navbar";
import { DonationResponse } from "@/models/DonationResponse";
import { OrganizationResponse } from "@/models/OrganizationResponse";
import { CircleDollarSign, ShieldCheck, Link as LinkIcon } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

// --- Helper Functions ---

function getStatusInfo(status: number): { text: string; color: string } {
    switch(status) {
        case 1: // Assuming 1 is Completed
            return { text: "Completed", color: "bg-green-100 text-green-800" };
        case 2: // Assuming 2 is Pending
            return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
        case 3: // Assuming 3 is Cancelled
            return { text: "Cancelled", color: "bg-red-100 text-red-800" };
        default:
            return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
    }
}

const labels : LabelProp[] = [
    {href: "/organizations", text: "Organizations"},
    {href: "/donations", text: "My Donations"},
];

const DonationHistory = () => {

    let [donations, setDonations] = useState<DonationResponse[]>([])
    let [searchQuery, setSearchQuery] = useState("");
    let [sortType, setSortType] = useState("date-desc"); // Default sort
    const navigate = useNavigate();
    
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem("userId")
    const role = localStorage.getItem("role")
    const isDonor = role === "1"

    const fetchDonations = async () => {
        if (!id || !token) return;
        try {
            const response = await fetch(`https://localhost:7142/api/Donations/donors/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch initial donations");
        
            const donationsData: DonationResponse[] = await response.json();

            const orgPromises = donationsData.map(donation =>
                fetch(`https://localhost:7142/api/orgs/${donation.orgId}`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` },
                }).then(res => {
                    if (!res.ok) {
                        console.error(`Failed to fetch org: ${donation.orgId}`);
                        return null;
                    }
                    return res.json(); 
                })
            );

            const orgResults: (OrganizationResponse | null)[] = await Promise.all(orgPromises);

            const finalData = donationsData.map((donation, index) => {
                const orgData = orgResults[index];
                return {
                    ...donation,
                    orgName: orgData ? orgData.orgName : "Unknown Organization",
                };
            });

            setDonations(finalData);
        } catch (error) {
            console.error("Failed to fetch donations:", error);
            setDonations([]);
        }
    };

    useEffect(() => {
        if (!isDonor) {
            navigate("/dashboard");
        }
        fetchDonations();
    }, []);

    const filteredAndSortedDonations = useMemo(() => {
        return donations
            .filter((donation) =>
                // Search by organization name or message
                donation.orgName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                donation.donationDonorMessage.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                switch (sortType) {
                    case "value-asc":
                        return a.donationAmount - b.donationAmount;
                    case "value-desc":
                        return b.donationAmount - a.donationAmount;
                    case "alpha-asc":
                        return a.orgName.localeCompare(b.orgName);
                    case "alpha-desc":
                        return b.orgName.localeCompare(a.orgName);
                    case "date-asc":
                        return new Date(a.donationDate).getTime() - new Date(b.donationDate).getTime();
                    case "date-desc":
                    default:
                        return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
                }
            });
    }, [donations, searchQuery, sortType]);

    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar labels={labels} isAuthenticated={true} />
            <main className="container-custom py-20 flex-grow">
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <CircleDollarSign className="w-6 h-6 text-charity-blue" />
                        <h1 className="text-3xl font-bold text-charity-dark">Your Donation History</h1>
                    </div>
                    <p className="text-charity-gray">
                        Check out how much you have collaborated with organizations!
                    </p>
                </section>

                <DonationsFilter onSortChange={setSortType} onSearchChange={setSearchQuery}/>

                <section className="mt-8">
                    {filteredAndSortedDonations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredAndSortedDonations.map((donation) => {
                                const statusInfo = getStatusInfo(donation.status);
                                return (
                                    <Link key={donation.donationId} to={`/organization/${donation.orgId}`}>
                                        <div
                                            key={donation.donationId}
                                            className="bg-white flex flex-col border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-semibold text-charity-dark">
                                                    {donation.orgName || `Organization #${donation.orgId}`}
                                                </h3>
                                                <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.text}
                                                </div>
                                            </div>

                                            <p className="text-charity-gray text-sm mb-3">
                                                {donation.donationDate.toString()}
                                            </p>

                                            <div className="flex items-center text-lg text-charity-blue font-semibold mb-3">
                                                <CircleDollarSign className="w-4 h-4 mr-2" />
                                                <span>R$ {donation.donationAmount.toFixed(2)}</span>
                                            </div>

                                            <p className="text-charity-dark text-sm mb-4 font-light italic flex-grow break-words line-clamp-2">
                                                "{donation.donationDonorMessage || "No message provided."}"
                                            </p>

                                            {/* FIX: Container reserves space to maintain consistent card height */}
                                            <div className="min-h-[1.25rem] mt-auto">
                                                {donation.donationIsAnonymous && (
                                                    <div className="flex items-center text-xs text-green-700">
                                                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                                                        <span>This donation was made anonymously.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                         <div className="text-center py-16 px-4 bg-white rounded-lg border border-gray-200 mt-8">
                            <h2 className="text-2xl font-semibold text-charity-dark">No Donations Found</h2>
                            <p className="text-gray-500 mt-2">
                                It looks like you haven't made any donations yet, or none match your search.
                            </p>
                         </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default DonationHistory;