import React from 'react';
import LegalPageLayout from '@/components/ui/LegalPageLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      effectiveDate="10th of October 2026"
      lastUpdated="29th of August 2026"
    >
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-8 text-sm">
        <p className="m-0 font-medium">
          <strong>Summary:</strong> Oceaniq collects environmental observation data and basic account information to operate the citizen-science platform. Submissions containing names, photos of identifiable people, contact details, or exact sensitive locations may become visible to authorized reviewers or may be included in public/aggregated/open datasets depending on Oceaniq’s publication controls. <strong>Please do not upload unnecessary personal information. Private contact details are not publicly exposed by default.</strong>
        </p>
      </div>

      <nav aria-label="Table of contents" className="mb-10 p-6 bg-muted/20 border border-border rounded-lg">
        <h2 className="text-lg font-semibold mt-0 mb-4">Table of Contents</h2>
        <ul className="space-y-2 list-none pl-0 m-0 text-sm">
          <li><a href="#who-we-are" className="text-primary hover:underline">1. Who we are and scope of this policy</a></li>
          <li><a href="#information-we-collect" className="text-primary hover:underline">2. Information Oceaniq collects</a></li>
          <li><a href="#how-we-use" className="text-primary hover:underline">3. How Oceaniq uses information</a></li>
          <li><a href="#legal-basis" className="text-primary hover:underline">4. Legal basis and consent</a></li>
          <li><a href="#handling-observations" className="text-primary hover:underline">5. How environmental observations and location data are handled</a></li>
          <li><a href="#public-data" className="text-primary hover:underline">6. Public, shared, aggregated, and open-data handling</a></li>
          <li><a href="#account-security" className="text-primary hover:underline">7. Account security and user responsibilities</a></li>
          <li><a href="#third-parties" className="text-primary hover:underline">8. Service providers and third parties</a></li>
          <li><a href="#data-retention" className="text-primary hover:underline">9. Data retention</a></li>
          <li><a href="#user-rights" className="text-primary hover:underline">10. User choices and rights</a></li>
          <li><a href="#privacy-assistance" className="text-primary hover:underline">11. How to request account deletion or privacy assistance</a></li>
          <li><a href="#children-policy" className="text-primary hover:underline">12. Children and minimum-age policy</a></li>
          <li><a href="#security-limitations" className="text-primary hover:underline">13. Security limitations and breach response</a></li>
          <li><a href="#international-transfers" className="text-primary hover:underline">14. International processing and transfers</a></li>
          <li><a href="#changes" className="text-primary hover:underline">15. Changes to the Privacy Policy</a></li>
          <li><a href="#contact" className="text-primary hover:underline">16. Contact information</a></li>
        </ul>
      </nav>

      <section id="who-we-are">
        <h2>1. Who we are and scope of this policy</h2>
        <p>Oceaniq is a marine-waste monitoring and citizen-science platform operated by [LEGAL_ENTITY_NAME]. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website, mapping tools, and data submission services.</p>
        <p>Oceaniq is intended to be operated with regard to applicable Indonesian data-protection requirements, including Law No. 27 of 2022 on Personal Data Protection, where applicable.</p>
      </section><br />

      <section id="information-we-collect">
        <h2>2. Information Oceaniq collects</h2>
        <p>We collect information you provide directly to us and information generated when you use the platform:</p>
        <ul>
          <li><strong>Account information:</strong> Name, email address, profile details, and login/authentication identifiers.</li>
          <li><strong>User-generated content:</strong> Marine debris observations, descriptions, categories, counts, survey records, comments, and uploaded images/files.</li>
          <li><strong>Location information:</strong> Coordinates, site names, survey areas, and map interactions. We may also collect device-provided location if you permit it.</li>
          <li><strong>Technical/usage data:</strong> IP address, device/browser data, standard web logs, and local-storage/session technologies necessary to operate the platform.</li>
          <li><strong>Communications:</strong> Support requests, feedback, reports, or messages sent to Oceaniq.</li>
        </ul>
      </section><br />

      <section id="how-we-use">
        <h2>3. How Oceaniq uses information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve the Oceaniq platform.</li>
          <li>Process, display, and analyze environmental observation data.</li>
          <li>Create anonymized statistics, geographic summaries, environmental trends, and dashboard analytics.</li>
          <li>Communicate with you regarding your account, updates, or support inquiries.</li>
          <li>Ensure the security and integrity of our service.</li>
        </ul>
      </section><br />

      <section id="legal-basis">
        <h2>4. Legal basis and consent</h2>
        <p>By registering an account and using Oceaniq, you consent to the collection and use of your information as described in this Privacy Policy. We process your data to fulfill our Terms of Service (operating the platform), with your consent, and for our legitimate interest in providing a citizen-science environmental monitoring service.</p>
      </section><br />

      <section id="handling-observations">
        <h2>5. How environmental observations and location data are handled</h2>
        <p>Observations you submit are the core of Oceaniq's citizen-science mission. Location coordinates, survey data, and uploaded photos are processed to visualize marine waste. Please avoid uploading photos that clearly identify individuals or sensitive non-public locations unless necessary for the environmental observation.</p>
      </section><br />

      <section id="public-data">
        <h2>6. Public, shared, aggregated, and open-data handling</h2>
        <p>Certain data you submit, such as observations, metadata, and photos, may be made publicly visible on our maps and dashboards. Depending on Oceaniq's publication controls, this data may also be aggregated or released as downloadable open datasets. While we do not publicly expose private contact details (like your email address) by default, user-generated content you submit for publication is intended for public consumption and reuse under our Open Data License.</p>
      </section><br />

      <section id="account-security">
        <h2>7. Account security and user responsibilities</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. Do not share your login information. If you suspect unauthorized access to your account, please notify us immediately.</p>
      </section><br />

      <section id="third-parties">
        <h2>8. Service providers and third parties</h2>
        <p>We may share your information with trusted service providers who assist us in operating the platform (such as cloud hosting, authentication, and database services). These providers are authorized to use your information only as necessary to provide services to us. If our actual third-party processors change, we will update this section accordingly.</p>
      </section><br />

      <section id="data-retention">
        <h2>9. Data retention</h2>
        <p>We retain your personal information only as long as reasonably necessary to fulfill the purposes for which it was collected, to provide the Oceaniq service, and to comply with our legal obligations.</p>
      </section><br />

      <section id="user-rights">
        <h2>10. User choices and rights</h2>
        <p>Depending on your location and applicable law, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>Request deletion of your account and associated personal data.</li>
          <li>Withdraw your consent to processing where applicable.</li>
          <li>Object to or request restriction of certain processing activities.</li>
        </ul>
      </section><br />

      <section id="privacy-assistance">
        <h2>11. How to request account deletion or privacy assistance</h2>
        <p>To request access, correction, or deletion of your data, or if you need privacy-related assistance, please contact us at [PRIVACY_CONTACT_EMAIL]. Note that complete deletion of your account may remove your observations from the platform, though already published or aggregated open data may remain available where permitted by law.</p>
      </section><br />

      <section id="children-policy">
        <h2>12. Children and minimum-age policy</h2>
        <p>Oceaniq is not directed to children under the age of 13 (or higher age required by local law). We do not knowingly collect personal information from children without appropriate parental consent. If we become aware that we have inadvertently collected such information, we will take steps to delete it.</p>
      </section><br />

      <section id="security-limitations">
        <h2>13. Security limitations and breach response</h2>
        <p>We implement reasonable security measures to protect your data. However, no internet transmission or electronic storage is entirely secure. In the event of a data breach that compromises your personal information, we will take reasonable steps to mitigate the impact and notify you as required by applicable law.</p>
      </section><br />

      <section id="international-transfers">
        <h2>14. International processing and transfers</h2>
        <p>Oceaniq may process and store data on servers located outside of your country of residence. We will take reasonable steps to ensure that your data is treated securely and in accordance with this Privacy Policy. We may update this section if our international processing arrangements change.</p>
      </section><br />

      <section id="changes">
        <h2>15. Changes to the Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will post the revised policy on this page with an updated "Last Updated" date. If the changes are material, we may provide more prominent notice or request your consent where required by law.</p>
      </section><br />

      <section id="contact">
        <h2>16. Contact information</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>
          [LEGAL_ENTITY_NAME]<br />
          [BUSINESS_ADDRESS]<br />
          Email: [CONTACT_EMAIL]
        </p>
      </section>
    </LegalPageLayout>
  );
}
