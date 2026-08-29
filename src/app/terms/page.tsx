import React from 'react';
import LegalPageLayout from '@/components/ui/LegalPageLayout';

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      effectiveDate="[EFFECTIVE_DATE]"
      lastUpdated="[LAST_UPDATED_DATE]"
    >
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-8 text-sm">
        <p className="m-0 font-medium">
          <strong>Summary:</strong> Oceaniq is a marine-waste monitoring platform. You retain ownership of content you submit, but grant Oceaniq the rights needed to operate the service and, where applicable, to release data under our Open Data License. Community observations may be incomplete or unverified; do not rely on them for high-stakes decisions. We expect you to contribute responsibly and not misuse the platform.
        </p>
      </div>

      <nav aria-label="Table of contents" className="mb-10 p-6 bg-muted/20 border border-border rounded-lg">
        <h2 className="text-lg font-semibold mt-0 mb-4">Table of Contents</h2>
        <ul className="space-y-2 list-none pl-0 m-0 text-sm">
          <li><a href="#acceptance" className="text-primary hover:underline">1. Acceptance of the Terms</a></li>
          <li><a href="#eligibility" className="text-primary hover:underline">2. Eligibility and account registration</a></li>
          <li><a href="#security" className="text-primary hover:underline">3. Account credentials and security</a></li>
          <li><a href="#permitted-use" className="text-primary hover:underline">4. Permitted use of Oceaniq</a></li>
          <li><a href="#prohibited" className="text-primary hover:underline">5. Prohibited conduct</a></li>
          <li><a href="#submissions" className="text-primary hover:underline">6. User submissions and contribution standards</a></li>
          <li><a href="#license-granted" className="text-primary hover:underline">7. License you grant to Oceaniq</a></li>
          <li><a href="#data-quality" className="text-primary hover:underline">8. Data quality, validation, attribution, and correction</a></li>
          <li><a href="#open-data" className="text-primary hover:underline">9. Public visibility, maps, downloads, and open-data release</a></li>
          <li><a href="#intellectual-property" className="text-primary hover:underline">10. Intellectual property and platform content</a></li>
          <li><a href="#third-party" className="text-primary hover:underline">11. Third-party services, maps, links, and data sources</a></li>
          <li><a href="#availability" className="text-primary hover:underline">12. Availability, changes, suspension, and termination</a></li>
          <li><a href="#disclaimers" className="text-primary hover:underline">13. Disclaimers</a></li>
          <li><a href="#limitation-liability" className="text-primary hover:underline">14. Limitation of liability</a></li>
          <li><a href="#indemnity" className="text-primary hover:underline">15. Indemnity</a></li>
          <li><a href="#governing-law" className="text-primary hover:underline">16. Governing law and dispute resolution</a></li>
          <li><a href="#changes" className="text-primary hover:underline">17. Changes to the Terms</a></li>
          <li><a href="#contact" className="text-primary hover:underline">18. Contact details</a></li>
        </ul>
      </nav>

      <section id="acceptance">
        <h2>1. Acceptance of the Terms</h2>
        <p>By registering for, accessing, or using Oceaniq, you agree to these Terms of Service. If you do not agree, you may not use the platform.</p>
      </section><br />

      <section id="eligibility">
        <h2>2. Eligibility and account registration</h2>
        <p>You must be of legal age to form a binding contract (or have parental consent if applicable) to use Oceaniq. When creating an account, you agree to provide accurate and complete information.</p>
      </section> <br />

      <section id="security">
        <h2>3. Account credentials and security</h2>
        <p>You are responsible for safeguarding your account credentials. You agree to notify us immediately of any unauthorized access to your account.</p>
      </section> <br />

      <section id="permitted-use">
        <h2>4. Permitted use of Oceaniq</h2>
        <p>You may use Oceaniq to collect, visualize, analyze, and share environmental observation data for research, citizen science, and community awareness, subject to these Terms.</p>
      </section><br />

      <section id="prohibited">
        <h2>5. Prohibited conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Submit deliberately false, deceptive, unlawful, harmful, abusive, or infringing content.</li>
          <li>Upload malware or attempt unauthorized access to the platform.</li>
          <li>Harvest or scrape personal data from the service.</li>
          <li>Interfere with maps, APIs, dashboards, accounts, or infrastructure.</li>
          <li>Misrepresent observations, fieldwork, affiliations, permissions, or data ownership.</li>
          <li>Use Oceaniq for emergency dispatch, navigation, law-enforcement decisions, or other high-risk reliance.</li>
        </ul>
      </section><br />

      <section id="submissions">
        <h2>6. User submissions and contribution standards</h2>
        <p>You are solely responsible for the content you submit. You warrant that you have all necessary rights to submit the content and that it does not infringe the rights of any third party. No contributor may submit content they do not have the right to share.</p>
      </section><br />

      <section id="license-granted">
        <h2>7. License you grant to Oceaniq</h2>
        <p>Ownership of user-created content remains with the user, subject to their rights. By submitting content, you grant Oceaniq a worldwide, royalty-free, non-exclusive license to host, process, display, moderate (where applicable), and distribute your submitted content as needed to operate the service.</p>
      </section><br />

      <section id="data-quality">
        <h2>8. Data quality, validation, attribution, and correction</h2>
        <p>Oceaniq provides tools for data collection, but community observations may be incomplete, unverified, inaccurate, delayed, or context-dependent. Users should independently evaluate data before relying on it for research, policy, operational, safety, or commercial decisions. We reserve the right to correct or remove inaccurate data.</p>
      </section><br />

      <section id="open-data">
        <h2>9. Public visibility, maps, downloads, and open-data release</h2>
        <p>Content or datasets designated as published/open data may be released under the Oceaniq Open Data License (CC BY 4.0). You agree that non-private observation data you submit may be made publicly available under these terms.</p>
      </section><br />

      <section id="intellectual-property">
        <h2>10. Intellectual property and platform content</h2>
        <p>Excluding user submissions, Oceaniq and its original content, features, and functionality are owned by [LEGAL_ENTITY_NAME] and are protected by intellectual property laws. You may not use our trademarks, logos, or brand assets without prior written permission.</p>
      </section><br />

      <section id="third-party">
        <h2>11. Third-party services, maps, links, and data sources</h2>
        <p>Oceaniq may integrate or link to third-party services, maps, or data. We do not endorse and are not responsible for the content or practices of these third parties.</p>
      </section><br />

      <section id="availability">
        <h2>12. Availability, changes, suspension, and termination</h2>
        <p>We may modify, suspend, or discontinue any part of the service at any time without notice. We may terminate or suspend your account if you violate these Terms.</p>
      </section><br />

      <section id="disclaimers">
        <h2>13. Disclaimers</h2>
        <p>Oceaniq is provided "AS IS" and "AS AVAILABLE". We disclaim all warranties, express or implied, including fitness for a particular purpose. Oceaniq is not an emergency-response service, official government enforcement, or navigation/safety service. We do not guarantee that observation data is complete, verified, current, or safe to rely upon for operational, maritime, public-safety, or regulatory decisions.</p>
      </section><br />

      <section id="limitation-liability">
        <h2>14. Limitation of liability</h2>
        <p>To the fullest extent permitted by law, Oceaniq and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service or the data within it.</p>
      </section><br />

      <section id="indemnity">
        <h2>15. Indemnity</h2>
        <p>You agree to indemnify and hold harmless Oceaniq, its officers, directors, employees, and agents from any claims, liabilities, damages, or expenses arising from your use of the service, your submissions, or your violation of these Terms.</p>
      </section><br />

      <section id="governing-law">
        <h2>16. Governing law and dispute resolution</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of Indonesia. Any disputes arising under these Terms shall be resolved in the competent courts of Indonesia.</p>
      </section><br />

      <section id="changes">
        <h2>17. Changes to the Terms</h2>
        <p>We may revise these Terms from time to time. The most current version will be posted on this page. Your continued use of Oceaniq after changes become effective constitutes your acceptance of the revised Terms.</p>
      </section><br />

      <section id="contact">
        <h2>18. Contact details</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <p>
          [LEGAL_ENTITY_NAME]<br />
          Email: [CONTACT_EMAIL]
        </p>
      </section>
    </LegalPageLayout>
  );
}
