
import { User, MapPin, Globe, Phone, Mail, Calendar, Heart, Users, Award, ArrowRight, UserRoundPen, CalendarIcon, Lock } from 'lucide-react';
import Navbar, { LabelProp } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';
import { useNavigate } from 'react-router-dom';
import { toast, useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Phone Validation Schema
const phoneValidation = z.object({
  countryCode: z.enum(['BR', 'US', 'PT'], {
    errorMap: () => ({ message: "Please select a valid country" })
  }),
  phoneNumber: z.string()
}).refine(
  (data) => {
    // Remove all non-digit characters
    const cleanedNumber = data.phoneNumber.replace(/\D/g, '');

    switch (data.countryCode) {
      case 'BR': // Brazil
        // Brazilian phone numbers: 10-11 digits (with or without area code)
        return /^(\d{10,11})$/.test(cleanedNumber);
      case 'US': // United States
        // US phone numbers: exactly 10 digits
        return /^(\d{10})$/.test(cleanedNumber);
      case 'PT': // Portugal
        // Portuguese phone numbers: 9 digits
        return /^(\d{9})$/.test(cleanedNumber);
      default:
        return false;
    }
  },
  { message: "Invalid phone number format" }
);

const updateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  phone: phoneValidation,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).transform((data) => {
  // Optional: format the phone number before final submission
  if (data.phone) {
    data.phone.phoneNumber = data.phone.phoneNumber.replace(/\D/g, '');
  }
  return data;
});

const OrganizationProfile = () => {
  const navigate = useNavigate();
  // Sample organization data - in a real app, this would come from an API or context
  const organization = {
    name: "Helping Hands Foundation",
    logo: "https://static.vecteezy.com/system/resources/previews/020/324/784/non_2x/ong-letter-logo-design-on-white-background-ong-creative-circle-letter-logo-concept-ong-letter-design-vector.jpg",
    coverImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1920&q=80",
    description: "We are dedicated to providing educational opportunities and healthcare services to underprivileged children worldwide. Since 2005, we've been making a positive impact in communities across 15 countries.",
    location: "San Francisco, California",
    website: "www.helpinghands.org",
    phone: "+1 (555) 123-4567",
    email: "contact@helpinghands.org",
    founded: "2005",
    membersCount: 120,
    projects: [
      {
        id: 1,
        title: "School Building Project",
        location: "Rural Kenya",
        description: "Building 10 new schools with modern facilities in rural areas of Kenya.",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
        progress: 65,
      },
      {
        id: 2,
        title: "Clean Water Initiative",
        location: "India",
        description: "Providing clean water solutions to 50+ villages affected by water scarcity.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
        progress: 78,
      },
      {
        id: 3,
        title: "Healthcare Outreach",
        location: "Honduras",
        description: "Mobile clinics providing healthcare services to remote communities.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
        progress: 42,
      }
    ],
    stats: [
      { label: "Countries", value: "15" },
      { label: "Projects", value: "48" },
    ],
    achievements: [
      "Humanitarian Excellence Award 2022",
      "Global Impact Recognition 2019",
      "Community Builder Award 2017"
    ]
  };

  const labels : LabelProp[] = [
      {href: "#about", text: "About"},
      {href: "#impact", text: "Our Impact"},
      {href: "#stories", text: "Stories"},
      {href: "#donate", text: "Donate"}
  ];

  const updateForm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: {
        countryCode: "BR", // Default to Brazil
        phoneNumber: "",
      },
    },
  });

  const onSubmit = (values: z.infer<typeof updateSchema>) => {
      console.log("Signup values:", values);
      
      // Simulate successful signup
      toast({
        title: "Account Created",
        description: "Welcome to KindHearts! Thank you for joining our mission.",
        variant: "default",
      });
      
      // Redirect to donation page (or another appropriate page)
      setTimeout(() => navigate('/#donate'), 1000);
    };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar labels={labels} isAuthenticated={true} />
      
      <main className="flex-grow">
        <div className="relative h-60 md:h-80 w-full">
          <img 
            src={organization.coverImage} 
            alt="Organization cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <div className="container-custom relative -mt-20 z-10">
          <div className="bg-white rounded-xl shadow-medium p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 border-2 border shadow-sm">
                <AvatarImage src={organization.logo} alt={organization.name} />
                <AvatarFallback className="text-3xl font-bold bg-charity-blue text-white">
                  {organization.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-charity-dark mb-2">
                  {organization.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-charity-gray">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-charity-orange" />
                    <span>{organization.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1 text-charity-orange" />
                    <span>{organization.website}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-primary px-5 py-2">Donate Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Support Our Mission</DialogTitle>
                      <DialogDescription>
                        Your donation helps us continue our important work worldwide.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <p>Donation form would go here.</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <UserRoundPen className="w-4 h-4" />
                        Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Your Profile</DialogTitle>
                      <DialogDescription>
                        Always keep your personal information updated.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Form {...updateForm}>
                        <form onSubmit={updateForm.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={updateForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                                    <Input
                                      placeholder="John Doe"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={updateForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                                    <Input
                                      placeholder="your@email.com"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={updateForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <div className="flex space-x-2">
                                    {/* TODO: ARRUMAR O +DD DESSE SELECT */}
                                    {/* <Select
                                      value={field.value?.countryCode}
                                      onValueChange={(countryCode) => {
                                        field.onChange({
                                          ...field.value,
                                          countryCode
                                        });
                                      }}
                                    >
                                      <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Country" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="BR">
                                          <div className="flex items-center">
                                            🇧🇷 +55
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="US">
                                          <div className="flex items-center">
                                            🇺🇸 +1
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="PT">
                                          <div className="flex items-center">
                                            🇵🇹 +351
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select> */}

                                    <Input
                                      type="tel"
                                      placeholder="Phone Number"
                                      className="flex-1"
                                      value={field.value?.phoneNumber || ''}
                                      onChange={(e) => {
                                        const cleanedValue = e.target.value.replace(/\D/g, '');
                                        field.onChange({
                                          ...field.value,
                                          phoneNumber: cleanedValue
                                        });
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={updateForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={updateForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white">
                            Create Account
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </DialogContent>
                </Dialog>
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
                  <p className="text-charity-gray">{organization.description}</p>
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
                    <span>{organization.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0 mt-0.5" />
                    <span>{organization.email}</span>
                  </div>
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0 mt-0.5" />
                    <span>{organization.website}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-charity-orange flex-shrink-0 mt-0.5" />
                    <span>{organization.location}</span>
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
                    {organization.stats.map((stat, index) => (
                      <div key={index} className="text-center p-3 rounded-lg bg-charity-light-blue/10">
                        <p className="text-xl font-bold text-charity-blue">{stat.value}</p>
                        <p className="text-sm text-charity-gray">{stat.label}</p>
                      </div>
                    ))}
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
                  <div className="space-y-6">
                    {organization.projects.map((project) => (
                      <div key={project.id} className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="w-full md:w-32 md:h-24 flex-shrink-0">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-charity-dark">{project.title}</h3>
                          <div className="flex items-center text-sm text-charity-gray mb-2">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-charity-orange" />
                            <span>{project.location}</span>
                          </div>
                          <p className="text-charity-gray text-sm mb-3">{project.description}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-charity-blue h-2.5 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-charity-gray">Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full flex items-center justify-center gap-1">
                    View All Projects
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Photo Gallery Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-charity-blue" />
                    Gallery
                  </CardTitle>
                  <CardDescription>
                    See our work in action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {organization.projects.map((project) => (
                      <div key={project.id} className="relative aspect-square rounded-md overflow-hidden group">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-xs text-white font-medium truncate">
                            {project.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full flex items-center justify-center gap-1">
                    View Full Gallery
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrganizationProfile;