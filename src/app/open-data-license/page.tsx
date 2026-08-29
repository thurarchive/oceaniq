import React from 'react';
import LegalPageLayout from '@/components/ui/LegalPageLayout';

export default function OpenDataLicensePage() {
  return (
    <LegalPageLayout
      title="Oceaniq Open Data License"
      effectiveDate="10th of October 2026"
      lastUpdated="29th of August 2026"
    >
      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-8 text-sm">
        <p className="m-0 font-medium">
          <strong>Summary:</strong> Oceaniq-published datasets are licensed under the Creative Commons Attribution 4.0 International (CC BY 4.0) license, unless a dataset page, file, or metadata record expressly states otherwise. You may share and adapt the data, including commercially, subject to attribution.
        </p>
      </div>

      <section>
        <h2>License Overview</h2>
        <p>
          You are free to share and adapt the published data under the terms of the{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Creative Commons Attribution 4.0 International (CC BY 4.0) License
          </a>.
        </p>
      </section><br />

      <section>
        <h2>Attribution Requirements</h2>
        <p>If you share or adapt Oceaniq data, you must:</p>
        <ul>
          <li>Credit Oceaniq and identified contributors/authors where supplied.</li>
          <li>Provide a link to the relevant dataset or source where practicable.</li>
          <li>Include a link to the CC BY 4.0 license.</li>
          <li>Indicate whether changes were made to the original data.</li>
          <li>Do not imply in any way that Oceaniq or its contributors endorse you or your reuse of the data.</li>
        </ul><br />

        <h3>Example Attribution:</h3>
        <pre className="bg-muted/40 p-4 rounded-lg border border-border text-sm overflow-x-auto whitespace-pre-wrap">
          Source: Oceaniq, [Dataset Title], licensed under CC BY 4.0. Changes were made.
        </pre>
      </section><br />

      <section>
        <h2>Exclusions</h2>
        <p>The Open Data License does <strong>not</strong> cover:</p>
        <ul>
          <li>Personal data and private account information.</li>
          <li>Unpublished submissions or draft reports.</li>
          <li>Third-party materials that may be included or linked.</li>
          <li>Trademarks, logos, and brand assets of Oceaniq or partners.</li>
          <li>Content explicitly marked with another license or access restriction.</li>
        </ul>
      </section><br />

      <section>
        <h2>Data Review and Withholding</h2>
        <p>Oceaniq may de-identify, aggregate, generalize, delay, redact, review, or withhold sensitive observations before public release to protect privacy, sensitive environments, or security.</p>
      </section><br />

      <section>
        <h2>Disclaimer</h2>
        <p>
          <strong>Datasets are provided “as is.”</strong> They may contain errors, omissions, or unverified information. The data should not be used as the sole basis for safety, navigation, emergency, enforcement, or high-stakes decisions.
        </p>
      </section><br />

      <section>
        <h2>Dataset-Specific Terms</h2>
        <p>
          <em>Note:</em> The individual dataset page and its metadata control if they specify additional conditions or a different license for that specific dataset.
        </p>
      </section><br />
    </LegalPageLayout>
  );
}
