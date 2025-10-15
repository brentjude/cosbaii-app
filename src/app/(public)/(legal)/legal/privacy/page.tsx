// Update: src/app/(public)/(legal)/legal/privacy/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Cosbaii",
  description: "Privacy Policy for the Cosbaii platform",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-8">
        <h1 className="font-paytone text-4xl sm:text-5xl color-cosbaii-primary mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            At Cosbaii ("we," "our," or "us"), we respect your privacy and are committed 
            to protecting your personal information. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you use our platform 
            at www.cosbaii.com (the "Platform").
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using Cosbaii, you agree to the collection and use of information in accordance 
            with this Privacy Policy. If you do not agree with our policies and practices, 
            please do not use our Platform.
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            1. Information We Collect
          </h2>
          
          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            1.1 Information You Provide to Us
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li><strong>Account Information:</strong> Name, email address, username, password, and profile picture</li>
            <li><strong>Profile Content:</strong> Cosplay photos, portfolio images, bio, social media links, and other content you upload</li>
            <li><strong>Verification Information:</strong> Documents and materials submitted for identity verification</li>
            <li><strong>Competition Data:</strong> Event participation records, awards, rankings, and achievements</li>
            <li><strong>Communication Data:</strong> Messages, comments, feedback, and correspondence with us</li>
            <li><strong>Payment Information:</strong> Billing details (processed securely through third-party payment processors)</li>
            <li><strong>Preferences:</strong> Communication preferences, privacy settings, and notification choices</li>
          </ul>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            1.2 Information Collected Automatically
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            When you access our Platform, we automatically collect certain information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
            <li><strong>Usage Data:</strong> Pages viewed, time spent on pages, links clicked, search queries</li>
            <li><strong>Location Data:</strong> General geographic location based on IP address</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and similar tracking technologies</li>
          </ul>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            1.3 Information from Third Parties
          </h3>
          <p className="text-gray-700 leading-relaxed">
            We may receive information from third-party services when you link your accounts 
            (e.g., Google sign-in, social media platforms) or from event organizers who add 
            competition results to your profile.
          </p>
        </section>

        {/* 2. How We Use Your Information */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Account Management:</strong> Create and manage your account, verify your identity</li>
            <li><strong>Platform Services:</strong> Provide, maintain, and improve our services</li>
            <li><strong>Personalization:</strong> Customize your experience and show relevant content</li>
            <li><strong>Communication:</strong> Send updates, newsletters, event notifications, and marketing materials (with your consent)</li>
            <li><strong>Security:</strong> Protect against fraud, unauthorized access, and security threats</li>
            <li><strong>Analytics:</strong> Analyze usage patterns to improve our Platform</li>
            <li><strong>Compliance:</strong> Comply with legal obligations and enforce our Terms and Conditions</li>
            <li><strong>Support:</strong> Respond to inquiries and provide customer support</li>
            <li><strong>Community Features:</strong> Enable social features like following, messaging, and content sharing</li>
          </ul>
        </section>

        {/* 3. Legal Basis for Processing */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            3. Legal Basis for Processing (GDPR)
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you are in the European Economic Area (EEA), we process your personal data based on:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Consent:</strong> You have given clear consent for processing for specific purposes</li>
            <li><strong>Contract Performance:</strong> Processing is necessary to fulfill our contract with you</li>
            <li><strong>Legal Obligations:</strong> Processing is necessary to comply with legal requirements</li>
            <li><strong>Legitimate Interests:</strong> Processing is in our legitimate interests (e.g., security, analytics) and doesn't override your rights</li>
          </ul>
        </section>

        {/* 4. How We Share Your Information */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            4. How We Share Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may share your information in the following circumstances:
          </p>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            4.1 Public Profile Information
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Information you choose to make public (profile picture, username, bio, portfolio, 
            achievements) is visible to other users and may appear in search results.
          </p>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            4.2 Service Providers
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We share information with third-party vendors who perform services on our behalf:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Cloud hosting providers (e.g., Vercel, AWS)</li>
            <li>Database services (e.g., Supabase, PostgreSQL)</li>
            <li>Email service providers</li>
            <li>Payment processors (they receive payment information directly)</li>
            <li>Analytics providers (e.g., Google Analytics)</li>
          </ul>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            4.3 Event Organizers
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            With your consent, we may share your profile with event organizers for competition 
            registration, credential verification, and result tracking.
          </p>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            4.4 Legal Requirements
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may disclose your information if required by law or in response to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Legal processes (subpoenas, court orders)</li>
            <li>Enforcement of our Terms and Conditions</li>
            <li>Protection of rights, property, or safety</li>
            <li>Investigation of fraud or security issues</li>
          </ul>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            4.5 Business Transfers
          </h3>
          <p className="text-gray-700 leading-relaxed">
            If Cosbaii is involved in a merger, acquisition, or asset sale, your information 
            may be transferred. We will notify you before your information becomes subject to 
            a different Privacy Policy.
          </p>
        </section>

        {/* 5. Data Retention */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            5. Data Retention
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We retain your personal information for as long as necessary to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Provide our services and maintain your account</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes and enforce our agreements</li>
            <li>Maintain security and prevent fraud</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            When you delete your account, we will delete or anonymize your personal information 
            within 30 days, except where retention is required by law or for legitimate business purposes.
          </p>
        </section>

        {/* 6. Your Privacy Rights */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            6. Your Privacy Rights
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Depending on your location, you may have the following rights:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
            <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for processing at any time</li>
            <li><strong>Opt-Out:</strong> Opt out of marketing communications</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            To exercise these rights, contact us at privacy@cosbaii.com. We will respond within 
            30 days of receiving your request.
          </p>
        </section>

        {/* 7. Cookies and Tracking */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            7. Cookies and Tracking Technologies
          </h2>
          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            7.1 Types of Cookies We Use
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li><strong>Essential Cookies:</strong> Required for the Platform to function (e.g., authentication)</li>
            <li><strong>Performance Cookies:</strong> Collect anonymous usage data for analytics</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Marketing Cookies:</strong> Track your activity for advertising purposes (with consent)</li>
          </ul>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            7.2 Managing Cookies
          </h3>
          <p className="text-gray-700 leading-relaxed">
            You can control cookies through your browser settings. However, disabling certain 
            cookies may limit your ability to use some features of the Platform.
          </p>
        </section>

        {/* 8. Data Security */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            8. Data Security
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We implement reasonable security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Encryption of data in transit (HTTPS/SSL)</li>
            <li>Encryption of sensitive data at rest</li>
            <li>Secure authentication and password hashing</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and employee training</li>
            <li>Monitoring for suspicious activity</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            However, no method of transmission over the internet is 100% secure. We cannot 
            guarantee absolute security, but we strive to use commercially acceptable means 
            to protect your personal information.
          </p>
        </section>

        {/* 9. Children's Privacy */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            9. Children's Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Cosbaii is intended for users aged 13 and older. We do not knowingly collect 
            personal information from children under 13 without parental consent.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you are a parent or guardian and believe your child has provided us with 
            personal information without your consent, please contact us at privacy@cosbaii.com, 
            and we will delete the information promptly.
          </p>
        </section>

        {/* 10. International Data Transfers */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            10. International Data Transfers
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your information may be transferred to and processed in countries other than your 
            country of residence. These countries may have different data protection laws.
          </p>
          <p className="text-gray-700 leading-relaxed">
            When we transfer data internationally, we ensure appropriate safeguards are in place 
            through standard contractual clauses, Privacy Shield frameworks, or other legally 
            recognized transfer mechanisms.
          </p>
        </section>

        {/* 11. Third-Party Links */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            11. Third-Party Links and Services
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our Platform may contain links to third-party websites, services, or applications. 
            We are not responsible for the privacy practices of these third parties. We encourage 
            you to review their privacy policies before providing any personal information.
          </p>
        </section>

        {/* 12. California Privacy Rights */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            12. California Privacy Rights (CCPA)
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you are a California resident, you have additional rights under the California 
            Consumer Privacy Act (CCPA):
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Right to know what personal information we collect, use, and share</li>
            <li>Right to delete your personal information (with certain exceptions)</li>
            <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
            <li>Right to non-discrimination for exercising your privacy rights</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            To exercise these rights, contact us at privacy@cosbaii.com or call 1-800-XXX-XXXX.
          </p>
        </section>

        {/* 13. Changes to Privacy Policy */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            13. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our 
            practices or legal requirements. We will notify you of material changes by:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Posting the updated policy on our Platform with a new "Last Updated" date</li>
            <li>Sending an email notification to your registered email address</li>
            <li>Displaying a prominent notice on the Platform</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Your continued use of the Platform after changes are posted constitutes acceptance 
            of the updated Privacy Policy.
          </p>
        </section>

        {/* 14. Contact Us */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            14. Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions, concerns, or requests regarding this Privacy Policy or our 
            data practices, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              <strong>Email:</strong> privacy@cosbaii.com<br />
              <strong>Support Email:</strong> support@cosbaii.com<br />
              <strong>Website:</strong> www.cosbaii.com<br />
              <strong>Data Protection Officer:</strong> dpo@cosbaii.com
            </p>
          </div>
        </section>

        {/* 15. Your Consent */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            15. Your Consent
          </h2>
          <p className="text-gray-700 leading-relaxed">
            By using Cosbaii, you consent to this Privacy Policy and agree to its terms. 
            If you do not agree with this policy, please do not use our Platform.
          </p>
        </section>
      </div>

      {/* Footer Note */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          This Privacy Policy is effective as of the date stated at the top of this page. 
          We encourage you to review this policy periodically for any updates.
        </p>
      </div>
    </div>
  );
}