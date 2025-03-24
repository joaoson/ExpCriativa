
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Impact from '@/components/Impact';
import DonationCard from '@/components/DonationCard';
import ChildStory from '@/components/ChildStory';
import Footer from '@/components/Footer';
import { BookOpen, Star, GraduationCap, Award, ArrowRight } from 'lucide-react';
import AnimatedIcon from '@/components/AnimatedIcon';

const Index = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href') as string);
        if (target) {
          window.scrollTo({
            top: (target as HTMLElement).offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* About Section */}
        <section id="about" className="section">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-block px-3 py-1 mb-4 bg-charity-light-orange text-charity-orange rounded-full shadow-sm">
                  <span className="text-sm font-medium">About Lumen</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">We Create Lasting Change for Children in Need</h2>
                <p className="text-charity-dark/80 mb-6">
                  Founded in 2025, Lumen has been committed to improving children's lives through sustainable programs that provide education, healthcare, and safe environments. Our approach focuses on long-term solutions that empower communities to support their youngest members.
                </p>
                <p className="text-charity-dark/80 mb-8">
                  With a dedicated team of professionals and volunteers working in 25 countries, we've helped over 10,000 children access education, healthcare, and safe living conditions. Our transparent funding model ensures that 95% of donations go directly to programs that benefit children.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start">
                    <div className="mr-4 bg-charity-light-blue rounded-lg p-2">
                      <BookOpen className="w-5 h-5 text-charity-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Education First</h4>
                      <p className="text-sm text-charity-dark/70">Prioritizing learning opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 bg-charity-light-yellow rounded-lg p-2">
                      <Star className="w-5 h-5 text-charity-orange" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Child-Centered</h4>
                      <p className="text-sm text-charity-dark/70">Focused on individual needs</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 bg-charity-light-yellow rounded-lg p-2">
                      <GraduationCap className="w-5 h-5 text-charity-orange" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Sustainable Solutions</h4>
                      <p className="text-sm text-charity-dark/70">Creating lasting impact</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 bg-charity-light-blue rounded-lg p-2">
                      <Award className="w-5 h-5 text-charity-blue" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Transparency</h4>
                      <p className="text-sm text-charity-dark/70">Clear funding practices</p>
                    </div>
                  </div>
                </div>
                <a href="#impact" className="btn-primary px-8 py-3 text-base inline-flex items-center">
                  <span>See Our Impact</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
              
              <div className="order-1 lg:order-2 relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-medium">
                  <img
                    src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80"
                    alt="Children smiling"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
    
                <div className="absolute -bottom-6 left-8 z-20">
                  <div className="bg-white rounded-xl p-4 shadow-medium">
                    <div className="flex items-center">
                      <div className="bg-charity-light-blue rounded-lg p-2 mr-3">
                        <GraduationCap className="h-6 w-6 text-charity-blue" />
                      </div>
                      <div>
                        <p className="text-sm text-charity-dark/70">Schools Built</p>
                        <p className="text-xl font-bold">142</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Impact />
        
        {/* Stories Section */}
        <section id="stories" className="section">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-3 py-1 mb-4 bg-charity-light-orange text-charity-orange rounded-full shadow-sm">
                <span className="text-sm font-medium">Success Stories</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Children Whose Lives You've Changed</h2>
              <p className="text-lg text-charity-dark/80">
                Behind every donation is a real child whose life has been transformed. Meet some of the children who have benefited from your generosity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ChildStory 
                name="Maya"
                age={8}
                location="Kenya"
                quote="I can now go to school every day and learn to read. I want to be a teacher when I grow up!"
                imagePath="./kenya.jpeg"
              />
              <ChildStory 
                name="Carlos"
                age={10}
                location="Colombia"
                quote="The new community center has computers where I can study. I'm learning about science and technology."
                imagePath="./colombia.jpeg"
              />
              <ChildStory 
                name="Anisha"
                age={6}
                location="India"
                quote="I received medicine when I was sick, and now I can play with my friends again. Thank you!"
                imagePath="india.jpeg"
              />
            </div>
            
            <div className="mt-12 text-center">
              <a href="#" className="btn-outline px-8 py-3 text-base inline-flex items-center">
                <span>View All Stories</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
        
        {/* Donation Section */}
        <section className="section bg-charity-light-blue">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-3 py-1 mb-4 bg-white text-charity-blue rounded-full shadow-sm">
                  <span className="text-sm font-medium">Make a Difference Today</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Generosity Can Change a Child's Life Forever</h2>
                <p className="text-charity-dark/80 mb-6">
                  Every donation, no matter how small, has the power to transform lives. Your support helps us provide education, healthcare, and safe environments for children in need around the world.
                </p>
                <p className="text-charity-dark/80 mb-8">
                  With our transparent funding model, you can see exactly how your donation is being used and the impact it's making. Join us in creating a brighter future for the world's most vulnerable children.
                </p>
                <div className="bg-white p-4 rounded-xl mb-8">
                  <div className="flex items-center">
                    <div className="bg-charity-light-yellow rounded-lg p-2 mr-4">
                      <Award className="h-6 w-6 text-charity-orange" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Certified Transparency</h4>
                      <p className="text-sm text-charity-dark/70">95% of donations go directly to children's programs</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <DonationCard />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
