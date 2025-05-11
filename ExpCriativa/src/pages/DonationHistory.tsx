import DonationsFilter from "@/components/DonationsFilter";
import Navbar, { LabelProp } from "@/components/Navbar";
import { Donations } from "@/models/Donations";
import { CircleDollarSign } from "lucide-react";
import { useEffect, useState } from "react";

function changeStatusColor(status: string) {
    switch(status.toLowerCase()) {
        case "completed":
            return "text-green-700"
        case "pending":
            return "text-yellow-700"
        case "cancelled":
            return "text-red-700"
        default:
            return "text-charity-gray"
    }
}

const labels : LabelProp[] = [
    {href: "#about", text: "About"},
    {href: "#impact", text: "Our Impact"},
    {href: "#stories", text: "Stories"},
    {href: "#donate", text: "Donate"}
];

// PRECISO DO DONOR ID PARA PEGAR AS DOAÇÕES DO USUÁRIO
// PRECISO DE UM ENDPOINT COM JOIN ENTRE ORGS E DOAÇÕES PARA QUE EU CONSIGA RETORNAR INFORMAÇÕES SOBRE A ORG EM CADA CARD DE DOAÇÃO

const DonationHistory = () => {

    let [donations, setDonations] = useState<Donations[]>([])
    let [searchQuery, setSearchQuery] = useState("");
    
    const token = localStorage.getItem("accessToken");

    const fetchDonations = async () => {
        try {
            const response = await fetch("https://localhost:7142/api/Donations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            });

            const data: Donations[] = await response.json();
            setDonations(data);
            console.log(data)
        } catch (error) {
            console.error("Failed to fetch donations:", error);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    function handleSearchChange(query: string) {
        setSearchQuery(query);
    }

    function handleSortChange (sortType: string) {
        const sorted = [...donations];
        switch (sortType) {
        case "value-asc":
            sorted.sort((a, b) => a.donationAmount - b.donationAmount);
            break;
        case "value-desc":
            sorted.sort((a, b) => b.donationAmount - a.donationAmount);
            break;
        case "alpha-asc":
            sorted.sort((a, b) => a.donationDonorMessage.localeCompare(b.donationDonorMessage));
            break;
        case "alpha-desc":
            sorted.sort((a, b) => b.donationDonorMessage.localeCompare(a.donationDonorMessage));
            break;
        }
        setDonations(sorted);
    };

    const filteredDonations = donations.filter((donation) =>
        donation.donationDonorMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );    

    return(
        <div className="min-h-screen container-custom flex py-20">
            <Navbar labels={labels} isAuthenticated={true} />
            <main className="flex-grow">
                <section className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <CircleDollarSign className="w-5 h-5 text-charity-blue" />
                    <h2 className="text-xl font-semibold text-charity-dark">Your Donation History</h2>
                </div>
                <p className="text-charity-gray text-sm">
                    Check out how much you have collaborated with the world!
                </p>
                </section>

                <DonationsFilter onSortChange={handleSortChange} onSearchChange={handleSearchChange}/>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredDonations.map((donation, index) => (
                        <div
                        key={index}
                        className="flex flex-col border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                        <h3 className="text-lg font-semibold text-charity-dark">
                            Nome da Instituição (com href)
                        </h3>
                        <div className="flex items-center text-sm text-charity-gray mb-2">
                            <CircleDollarSign className="w-3.5 h-3.5 mr-1 text-charity-orange" />
                            <span>${donation.donationAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-charity-gray text-sm mb-2">
                            {donation.donationDonorMessage || "No message"}
                        </p>
                        <div className={
                            `text-xs ${changeStatusColor(donation.donationStatus)}`}>
                            {donation.donationStatus}
                        </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    )
}

export default DonationHistory;