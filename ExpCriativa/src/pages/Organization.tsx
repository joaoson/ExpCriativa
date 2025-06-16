
import { User, MapPin, Globe, Phone, Mail, Heart, Users, Award, ArrowRight, UserRoundPen, Lock, Briefcase, IdCard, CirclePlus, RectangleEllipsis } from 'lucide-react';
import Navbar, { LabelProp } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, useToast } from '@/hooks/use-toast';
import { formatCNPJ, phoneValidation, randomIntFromInterval, validateCNPJ } from '@/lib/utils';
import { OrganizationResponse } from '@/models/OrganizationResponse';
import { useEffect, useState } from 'react';
import { ProjectResponse } from '@/models/ProjectResponse';
import { DonationResponse } from '@/models/DonationResponse';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DonationPayment } from '@/components/DonationPayment';


const projectSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
});

const Organization = () => {
  const labels: LabelProp[] = [
          { href: "/donations", text: "My Donations" },
          { href: "/organizations", text: "Organizations" },
      ];

  const sample = {
    images: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    ],
    logo: "https://static.vecteezy.com/system/resources/previews/020/324/784/non_2x/ong-letter-logo-design-on-white-background-ong-creative-circle-letter-logo-concept-ong-letter-design-vector.jpg",
    cover: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1920&q=80",  //   

  }
  
  let [organization, setOrganization] = useState<OrganizationResponse>()  
  let [projects, setProjects] = useState<ProjectResponse[]>([])
  let [donations, setDonations] = useState<DonationResponse[]>([])
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);

  const { id } = useParams();

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const canEdit = userId == id && role === "2"
  const canDonate = role === "1"

  const fetchOrganization = async () => {
      try {
          const response = await fetch(`https://localhost:7142/api/orgs/${id}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          });

          const data: OrganizationResponse = await response.json();
          setOrganization(data);
      } catch (error) {
          console.error("Failed to fetch donations:", error);
      }
  };

  const fetchProjects = async () => {
      try {
          const response = await fetch(`https://localhost:7142/api/Projects/org/${id}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          });

          const data: ProjectResponse[] = await response.json();
          setProjects(data);
      } catch (error) {
          setProjects([])
      }
  }

  const fetchDonations = async () => {
    try {
      const response = await fetch(`https://localhost:7142/api/donations`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          });

          const data: DonationResponse[] = await response.json();
          const filteredData = data.filter(val => val.orgId === parseInt(id))
          setDonations(filteredData)
    } catch (error) {
        console.error("Failed to fetch donations:", error);
    }
  }

  const onClose = () => {
    setIsDonationDialogOpen(false)
  }

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "", address: "", description: ""
    }
    });
    
  const onProjectSubmit = async (values: z.infer<typeof projectSchema>) => {
    const body = {
      name: values.name,
      address: values.address,
      description: values.description,
      image_Url: null,
      orgId: parseInt(id)
    }

    try {
          const response = await fetch(`https://localhost:7142/api/Projects/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
          });

          const data: ProjectResponse = await response.json();
          setProjects(prev => [...prev, data])

          toast({ title: "Project Created", description: "The form was received and the project is now visible in your organization profile!", variant: "default" });

          projectForm.reset();
          setIsProjectDialogOpen(false);
      } catch (error) {
          console.error("Failed to fetch donations:", error);
          toast({ title: "Error", description: "Could not create the project.", variant: "destructive" });
      }
  };

  useEffect(() => {
      fetchOrganization();
      fetchProjects();
      fetchDonations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar labels={labels} isAuthenticated={true} />
      
      <main className="flex-grow">
        <div className="relative h-60 md:h-80 w-full">
          <img 
            src={sample.cover} 
            alt="Organization cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="container-custom relative -mt-20 z-10">
          <div className="bg-white rounded-xl shadow-medium p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 border-2 border shadow-sm">
                <AvatarImage src={sample.logo} alt={organization?.orgName} />
                <AvatarFallback className="text-3xl font-bold bg-charity-blue text-white">
                  {organization?.orgName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-charity-dark mb-2">
                  {organization?.orgName}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-charity-gray">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-charity-orange" />
                    <span>{organization?.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1 text-charity-orange" />
                    <span>{organization?.orgWebsiteUrl}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                {canDonate && (
                  <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="btn-primary px-5 py-2">Donate Now</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Support {organization?.orgName}</DialogTitle>
                        <DialogDescription>
                          Your generosity can make a difference in the world!
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <DonationPayment organization={organization} onClose={onClose}/>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {canEdit && (
                  <>
                    <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <CirclePlus className="w-4 h-4" />
                            Add Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add a new Project</DialogTitle>
                          <DialogDescription>
                            Fill the fields correctly in order to add a new project to your organization.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Form {...projectForm}>
                            <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
                              {[
                                { name: "name", label: "Project Name", icon: Briefcase },
                                { name: "address", label: "Address", icon: MapPin },
                                { name: "description", label: "Description", icon: RectangleEllipsis },
                              ].map(({ name, label, icon: Icon }) => (
                                <FormField key={name} control={projectForm.control} name={name as any} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                                        <Input placeholder={label} className="pl-10" {...field} />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              ))}
                              <Button type="submit" className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white">
                                Create Project
                              </Button>
                            </form>
                          </Form>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="flex items-center gap-2">
                      <UserRoundPen className="w-4 h-4" />
                        Edit Profile
                    </Button>
                  </>
                  )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container-custom py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - About & Contact */}
            <div className="lg:col-span-1 space-y-6">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-charity-blue" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-charity-gray">{organization?.description}</p>
                </CardContent>
              </Card>
              
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-charity-blue" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0 mt-0.5" />
                    <span>{organization?.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <IdCard className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0 mt-0.5" />
                    <span>{formatCNPJ(organization?.document ?? "Loading")}</span>
                  </div>
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0 mt-0.5" />
                    <span>{organization?.orgWebsiteUrl}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0 mt-0.5" />
                    <span>{organization?.address}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-charity-blue" />
                    Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-charity-light-blue/10">
                        <p className="text-xl font-bold text-charity-blue">{donations.length}</p>
                        <p className="text-sm text-charity-gray">Donations</p>
                      </div>

                      <div className="text-center p-3 rounded-lg bg-charity-light-blue/10">
                        <p className="text-xl font-bold text-charity-blue">{projects.length}</p>
                        <p className="text-sm text-charity-gray">Projects</p>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Projects & Activities */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-charity-blue" />
                    Current Projects
                  </CardTitle>
                  <CardDescription>
                    Our ongoing initiatives to make a difference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* --- Projects Section --- */}
                <div>
                  {/* Conditional rendering for the projects list */}
                  {projects.length > 0 ? (
                    <div className="space-y-6">
                      {projects.map((project) => (
                        <div key={project.id} className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                          <div className="w-full md:w-32 md:h-24 flex-shrink-0">
                            <img
                              src={sample.images[randomIntFromInterval(0, sample.images.length - 1)]}
                              alt={project.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-orange-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                              <span>{project.address}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">There are no projects here yet.</p>
                    </div>
                  )}
                </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Organization;