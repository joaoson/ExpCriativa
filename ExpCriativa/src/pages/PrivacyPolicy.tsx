import React from 'react';
import Navbar, { LabelProp } from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  const labels: LabelProp[] = [
    { href: "#about", text: "About" },
    { href: "#impact", text: "Our Impact" },
    { href: "#stories", text: "Stories" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar labels={labels} isAuthenticated={false} />

      <main className="container-custom pt-32 pb-16 flex-grow">
        {/* Page title */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-2">Privacy and Data Security Policy</h1>
          <div className="mx-auto w-20 h-1 bg-blue-600 rounded" />
        </header>

        {/* Content card */}
        <section className="bg-white shadow-lg rounded-lg p-8 space-y-8">
          <div>
            <p className="leading-relaxed">
              The Lumen Privacy and Data Security Policy was formulated with the intent to maintain the privacy and security of information collected from our users. This document is in accordance with the guidelines of Federal Law n.º 13.709/2018 (LGPD).
            </p>
          </div>

          <div>
            <p className="leading-relaxed">
              Users’ contact information may be used in Lumen’s strategic campaigns, sending communications that may add value or interest to our audience. All communications sent for this purpose will include an option to unsubscribe, and requests will be honored as soon as possible.
            </p>
          </div>

          <div>
            <p className="leading-relaxed">
              Under no circumstances does Lumen disclose or sell personal information or registration data of its users to third parties. All information is stored in our database and used in our work tools. In the event of any security incident involving personal information, the data subject and the competent authorities will be notified.
            </p>
          </div>

          <div>
            <p className="leading-relaxed">
              We may use some of the data or testimonials provided for communication campaigns. If you do not wish your information to be used for this purpose, please send a request by email to our support channel at <a href="mailto:contato@lumen.org" className="underline">contato@lumen.org</a>.
            </p>
          </div>

          <div>
            <p className="leading-relaxed">
              Our site may contain links that redirect to third-party pages. In such cases, navigation is under your exclusive responsibility, as it falls outside our Privacy and Data Security Policy.
            </p>
          </div>

          <div>
            <p className="leading-relaxed">
              We are available for any clarification regarding the topics covered herein.
            </p>
          </div>

          <div>
            <p className="leading-relaxed">
              Any changes introduced to the LGPD will be updated on this page without prior notice.
            </p>
          </div>

          <div>
            <p className="leading-relaxed">
              For more information about our privacy policies, please contact us <a href="mailto:contato@lumen.org" className="underline">contato@lumen.org</a>.
            </p>
          </div>

          <div>
            <p className="leading-relaxed font-semibold">
              Lumen® All rights reserved.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
