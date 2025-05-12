import React from 'react';
import Navbar, { LabelProp } from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService: React.FC = () => {
  const labels: LabelProp[] = [
    { href: "#about", text: "About" },
    { href: "#impact", text: "Our Impact" },
    { href: "#stories", text: "Stories" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar labels={labels} isAuthenticated={false} />

      <main className="container-custom pt-32 pb-16 flex-grow">
        {/* Header do page title */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold mb-2">Terms of Service</h1>
          <div className="mx-auto w-20 h-1 bg-blue-600 rounded"></div>
        </header>

        {/* Card de conteúdo */}
        <section className="bg-white shadow-lg rounded-lg p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Terms and Conditions of Use – Lumen
            </h2>
            <p className="leading-relaxed">
              This document sets forth the general terms of use (“Terms and Conditions
              of Use”) that govern your access to and use of the Lumen platform and its
              features. By accessing and using the PLATFORM, you acknowledge having read
              and fully accepted these Terms and Conditions of Use.
              <span className="italic">
                {" "}
                If you have any questions, please contact Lumen before accepting.
                Acceptance implies that you are at least 18 years old and have full
                legal capacity.
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Acceptance and Updates</h2>
            <p className="leading-relaxed">
              By using the PLATFORM, you agree to be bound by this agreement in its
              entirety. Any updates or modifications may occur at any time; Lumen will
              notify you by email or publish changes on the PLATFORM. It is your
              responsibility to stay informed of the current terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">General Rules of Use</h2>
            <p className="leading-relaxed mb-4">
              You agree to comply with all applicable laws, good customs, and public
              order when using the PLATFORM. The following actions are prohibited:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Harming the rights of any third party at any time</li>
              <li>Impeding access to or use of the PLATFORM by other users</li>
              <li>Accessing, without authorization, Lumen’s or third-party internal systems</li>
              <li>Distributing viruses or malicious files that may cause damage</li>
              <li>Using unauthorized tools to obtain content, data, or services</li>
              <li>Performing acts that may cause damage to Lumen or others</li>
              <li>Accessing programming areas or databases without permission</li>
              <li>Reverse engineering, copying, reproducing, or modifying the PLATFORM in violation of IP rights</li>
              <li>Violating any rights of Lumen or third parties</li>
              <li>Interfering with the security of the PLATFORM or its resources</li>
              <li>Using Lumen’s domain to create unsolicited email links (spam) or third-party sites</li>
              <li>Disseminating racist, political, religious, derogatory, or libelous messages</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Indemnification</h2>
            <p className="leading-relaxed">
              You agree to indemnify and hold Lumen harmless from any claims, damages,
              or costs arising from your misuse of the PLATFORM.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">User Registration</h2>
            <p className="leading-relaxed">
              By registering, you expressly authorize Lumen to store, use, and process
              your personal data, and to share it with third parties contracted to
              support PLATFORM operations, in compliance with applicable law. You
              warrant that all information you provide is true, complete, and up-to-date,
              and you are responsible for maintaining its accuracy. Lumen may refuse,
              suspend, or cancel your registration if it detects false, incomplete, or
              inaccurate information, or for other reasons provided by law or these
              Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Warranties</h2>
            <p className="leading-relaxed mb-4">
              THE PLATFORM IS PROVIDED “AS IS” AND MAY CONTAIN TECHNICAL ERRORS,
              TYPOGRAPHICAL ERRORS, OR INCONSISTENCIES. Lumen makes no warranties that:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>The PLATFORM will meet your expectations</li>
              <li>Access will be continuous or uninterrupted</li>
              <li>The PLATFORM is suitable for any specific purpose</li>
              <li>Defects or failures will be corrected</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Lumen may change the design, content, functionality, or discontinue the
              service at any time without prior notice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Liability</h2>
            <p className="leading-relaxed mb-4">
              You assume full responsibility for your use of the PLATFORM. Lumen shall
              not be liable for any consequential, indirect damages or financial losses
              arising from your use of, or inability to use, the PLATFORM. Excluded from
              Lumen’s liability are, among others:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Damages due to unavailability or partial operation</li>
              <li>System, server, or network connection failures</li>
              <li>Losses from improper use in violation of law or these Terms</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Duration</h2>
            <p className="leading-relaxed">
              These Terms remain in effect indefinitely while the PLATFORM is active.
              Lumen may suspend or cancel access at any time without notice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Updates</h2>
            <p className="leading-relaxed">
              Lumen may review and update these Terms unilaterally at any time.
              Continued use after changes implies acceptance of the new terms. If you
              disagree with any changes, you may terminate your registration, but you
              remain responsible for obligations under earlier versions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Third-Party Links</h2>
            <p className="leading-relaxed">
              The PLATFORM may contain links to third-party websites for your convenience.
              Lumen is not responsible for their content or services; leia sempre os termos
              de uso desses sites.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Viruses and Malware</h2>
            <p className="leading-relaxed">
              Lumen is not responsible for viruses or programas maliciosos. Recomendamos
              que utilize um antivírus atualizado ao acessar ou baixar qualquer conteúdo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Intellectual Property</h2>
            <p className="leading-relaxed mb-4">
              You are not authorized to use Lumen’s trademarks or any content without
              prior written permission. All content on the PLATFORM is owned or licensed
              to Lumen and protegido por leis de propriedade intelectual.
            </p>
            <p className="leading-relaxed">
              Reproduction, distribution, modification, or creation of derivative works without
              permission is prohibited. By submitting content, you grant Lumen a free,
              irrevocable, non-exclusive license to use and reproduce your content.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Language</h2>
            <p className="leading-relaxed">
              Este documento está disponível em português e inglês.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Confidentiality</h2>
            <p className="leading-relaxed">
              Lumen and you agree to manter a confidencialidade de todos os dados
              recebidos, especialmente dados pessoais, conforme a legislação civil.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Personal Data &amp; Privacy</h2>
            <p className="leading-relaxed">
              A coleta, armazenamento e uso de dados pessoais seguem a Política de
              Privacidade em vigor, alinhada à Lei Brasileira No. 13.709/2018 (LGPD).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Customer Service</h2>
            <p className="leading-relaxed">
              For questions or requests, please email us at{' '}
              <a href="mailto:contato@lumen.org" className="underline">
                contato@lumen.org
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Governing Law &amp; Jurisdiction</h2>
            <p className="leading-relaxed">
              The PLATFORM is controlled and operated by Lumen in Brazil. Any dispute
              relating to these Terms shall be governed by Brazilian law, with courts of
              Curitiba having exclusive jurisdiction.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
