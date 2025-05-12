import React from 'react';
import Navbar, { LabelProp } from '@/components/Navbar';
import Footer from '@/components/Footer';

const CookiePolicy: React.FC = () => {
  const labels: LabelProp[] = [
    { href: "#about", text: "About" },
    { href: "#impact", text: "Our Impact" },
    { href: "#stories", text: "Stories" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-charity-light-blue">
      <Navbar labels={labels} isAuthenticated={false} />

      <main className="container-custom pt-32 pb-16 flex-grow">
        {/* Page title */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-2">Cookie Policy</h1>
          <p className="text-sm text-gray-600">Last updated: May 11, 2025</p>
          <div className="mx-auto w-20 h-1 bg-blue-600 rounded mt-2" />
        </header>

        {/* Content card */}
        <section className="bg-white shadow-lg rounded-lg p-8 space-y-8">
          <div>
            <p className="leading-relaxed">
              This Cookie Policy explains how Lumen and its affiliates (“we”, “us” or “our”) use cookies and similar tracking technologies on the Lumen platform (the “PLATFORM”). It applies to all users of the PLATFORM. By continuing to browse or use the PLATFORM, you agree to the use of cookies as described in this policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">1. What Are Cookies?</h2>
            <p className="leading-relaxed">
              Cookies are small text files placed on your device (computer, tablet, or mobile) when you visit a website. They store information about your visit—such as your language preference and other settings—to help improve your experience on subsequent visits and to enable certain functionality.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">2. Types of Cookies We Use</h2>
            <p className="leading-relaxed">
              We use the following categories of cookies on the PLATFORM:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Strictly Necessary Cookies:</strong>  
                These cookies are essential to enable basic functions like page navigation and access to secure areas.  
                <em>Example:</em> <code>_lumen_session</code> (session)
              </li>
              <li>
                <strong>Performance &amp; Analytics Cookies:</strong>  
                These collect information about how visitors use our PLATFORM—pages visited, errors, load times—to help us improve performance.  
                <em>Example:</em> <code>_ga</code> (expires 2 years)
              </li>
              <li>
                <strong>Functionality Cookies:</strong>  
                Remember your preferences (e.g., language, font size) to provide enhanced, personalized features.  
                <em>Example:</em> <code>language_pref</code> (1 year)
              </li>
              <li>
                <strong>Marketing &amp; Advertising Cookies:</strong>  
                Used to deliver relevant ads and measure campaign effectiveness. May track your activity across other websites.  
                <em>Examples:</em> <code>fr</code> by Facebook (3 months), <code>IDE</code> by Google (1 year)
              </li>
              <li>
                <strong>Social Media Cookies:</strong>  
                Enable integration with social networks (e.g., sharing content).  
                <em>Example:</em> <code>__smVisitorId</code> (2 years)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">3. How We Use Cookies</h2>
            <p className="leading-relaxed">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Authenticate and maintain your session on the PLATFORM.</li>
              <li>Remember your preferences and provide personalized content.</li>
              <li>Analyze PLATFORM usage to optimize performance and features.</li>
              <li>Deliver targeted advertising and measure campaign success.</li>
              <li>Facilitate social media sharing and features.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">4. Third-Party Cookies</h2>
            <p className="leading-relaxed">
              Some cookies on our PLATFORM are set by third parties—such as analytics services (Google Analytics), advertising networks, or social plugins. We do not control these cookies. Please review the third parties’ privacy and cookie policies for more information on their data practices and opt-out mechanisms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">5. Cookie Consent and Control</h2>
            <p className="leading-relaxed mb-4">
              On your first visit, you will see a cookie banner allowing you to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Accept all cookies</li>
              <li>Decline non-essential cookies</li>
              <li>Customize which categories you allow</li>
            </ul>
            <p className="leading-relaxed">
              You can change or withdraw your consent at any time by clicking the “Cookie Settings” link at the bottom of any page on the PLATFORM.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">6. Cookie Lifetimes</h2>
            <p className="leading-relaxed">
              Cookies may be “session” cookies (deleted when you close your browser) or “persistent” cookies (remain until they expire or are deleted). Each cookie we use has its own expiration date, as noted in Section 2.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">7. How to Manage Cookies on Your Device</h2>
            <p className="leading-relaxed mb-4">
              You can control cookies through your browser settings. Be aware that disabling cookies may affect the functionality of the PLATFORM.
            </p>
            <p className="leading-relaxed">
              For detailed instructions, visit:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" className="underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-e12e78b6-6ce4-3a86-8254-3ab117baa8c0" className="underline">Microsoft Edge</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">8. Compliance with Data Protection Laws</h2>
            <p className="leading-relaxed">
              We process personal data collected via cookies in compliance with Brazil’s LGPD (Law 13.709/2018) and, where applicable, the EU GDPR. If you are an EU resident, you have the right to access, rectify, erase, or restrict processing of your personal data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">9. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Cookie Policy periodically to reflect changes in law or our practices. We will post the revised date at the top. Continued use of the PLATFORM after modifications implies acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">10. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about our use of cookies, please email us at{' '}
              <a href="mailto:contato@lumen.org" className="underline">
                contato@lumen.org
              </a>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
