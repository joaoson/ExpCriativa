import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar, { LabelProp } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrganizationResponse } from '@/models/OrganizationResponse'; // Assuming you have this model
import { ArrowRight, Calendar, Globe, MapPin, Search } from 'lucide-react';

const ListedOrganizations = () => {
    const labels: LabelProp[] = [
        { href: "/donations", text: "My Donations" },
        { href: "/organizations", text: "Organizations" },
    ];

    const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('name-asc'); // 'name-asc', 'date-desc', 'date-asc'

    const token = localStorage.getItem("accessToken");

    const fetchOrganizations = async () => {
        try {
            const response = await fetch(`https://localhost:7142/api/orgs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            });

            const data: OrganizationResponse[] = await response.json();
            setOrganizations(data);
        } catch (error) {
            console.error("Failed to fetch organizations:", error);
        }
    };
  
    const filteredAndSortedOrgs = useMemo(() => {
    return organizations
    .filter(org => 
    org.orgName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
    switch (sortOrder) {
        case 'date-desc':
            return new Date(b.orgFoundationDate).getTime() - new Date(a.orgFoundationDate).getTime();
        case 'date-asc':
            return new Date(a.orgFoundationDate).getTime() - new Date(b.orgFoundationDate).getTime();
        case 'name-desc':
            return b.orgName.localeCompare(a.orgName);
        case 'name-asc':
        default:
            return a.orgName.localeCompare(b.orgName);
    }
    });
    }, [organizations, searchTerm, sortOrder]);

    useEffect(() => {
        fetchOrganizations()
    }, []);

  return (
    <div className="min-h-screen flex flex-col bg-charity-light-blue/20 pt-20">
      <Navbar labels={labels} isAuthenticated={true} />
      
      <main className="flex-grow">
        <div className="container-custom py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-charity-dark">Find an Organization</h1>
            <p className="text-lg text-charity-dark/70 mt-2">
              Explore and connect with causes that matter to you.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl shadow-medium p-4 mb-8 flex flex-col md:flex-row gap-4 items-center sticky top-16 z-20">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by organization name..."
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-auto">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:w-[240px] h-12 text-base">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Sort by Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Sort by Name (Z-A)</SelectItem>
                  <SelectItem value="date-desc">Sort by Newest</SelectItem>
                  <SelectItem value="date-asc">Sort by Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedOrgs.length > 0 ? (
              filteredAndSortedOrgs.map(org => (
                <Card key={org.userId} className="flex flex-col overflow-hidden shadow-medium hover:shadow-lg transition-shadow duration-300 rounded-xl">
                  <CardHeader className="flex-row gap-4 items-center">
                    <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                       <AvatarImage src={`https://placehold.co/100x100/e2e8f0/334155?text=${org.orgName.substring(0, 2)}`} alt={org.orgName} />
                      <AvatarFallback className="text-lg font-bold bg-charity-blue text-white">
                        {org.orgName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-charity-dark">{org.orgName}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1.5 text-charity-orange" />
                        {org.address}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow text-sm">
                    <p className="text-charity-gray line-clamp-2 mb-4">
                      {org.description}
                    </p>
                    <div className="space-y-2 border-t border-gray-100 pt-3 text-charity-gray">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-charity-orange/80 flex-shrink-0" />
                          <span>Founded on {org.orgFoundationDate.toString()}</span>
                      </div>
                      <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-charity-orange/80 flex-shrink-0" />
                          <a href={`http://${org.orgWebsiteUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                            {org.orgWebsiteUrl}
                          </a>
                      </div>
                      
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50/50">
                    <Link to={`/organization/${org.userId}`} className="w-full">
                      <Button className="w-full btn-primary py-2.5">
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
                <div className="col-span-full text-center py-16 px-4 bg-white rounded-xl shadow-medium">
                    <h2 className="text-2xl font-semibold text-charity-dark">No Organizations Found</h2>
                    <p className="text-charity-gray mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListedOrganizations;
