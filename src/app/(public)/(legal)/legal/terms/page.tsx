// Create: src/app/(public)/(legal)/terms/page.tsx
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - Cosbaii",
  description: "Terms and Conditions for using the Cosbaii platform",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-paytone text-4xl sm:text-5xl color-cosbaii-primary mb-4">
          Terms and Conditions
        </h1>
        <p className="text-gray-600">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to Cosbaii ("we," "our," or "us"). By accessing or using our platform 
            at www.cosbaii.com (the "Platform"), you agree to be bound by these Terms and 
            Conditions ("Terms"). If you do not agree to these Terms, please do not use our Platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Cosbaii is a platform designed to provide cosplayers with digital identity verification, 
            portfolio management, and credential tracking services.
          </p>
        </section>

        {/* Acceptance of Terms */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            2. Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By creating an account, accessing, or using any part of the Platform, you acknowledge 
            that you have read, understood, and agree to be bound by these Terms, as well as our 
            Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms at any time. Your continued use of the 
            Platform after any changes constitutes acceptance of those changes.
          </p>
        </section>

        {/* Eligibility */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            3. Eligibility
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To use Cosbaii, you must:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Be at least 13 years of age (or the minimum age required in your jurisdiction)</li>
            <li>Have the legal capacity to enter into binding agreements</li>
            <li>Not be prohibited from using our services under applicable laws</li>
            <li>Provide accurate and complete registration information</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            If you are under 18, you must have permission from a parent or guardian to use the Platform.
          </p>
        </section>

        {/* Account Registration */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            4. Account Registration and Security
          </h2>
          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            4.1 Account Creation
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You must create an account to access certain features of the Platform. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Keep your password secure and confidential</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            4.2 Verification Process
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Cosbaii implements a verification process to ensure authenticity. By submitting 
            verification materials, you grant us the right to review and verify your identity 
            and cosplay credentials. We reserve the right to reject or revoke verification at our discretion.
          </p>
        </section>

        {/* User Conduct */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            5. User Conduct and Prohibited Activities
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Use the Platform for any illegal or unauthorized purpose</li>
            <li>Impersonate another person or entity</li>
            <li>Upload false, misleading, or fraudulent content</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Post content that infringes on intellectual property rights</li>
            <li>Upload malicious code, viruses, or harmful software</li>
            <li>Attempt to gain unauthorized access to the Platform</li>
            <li>Use automated systems to access the Platform without permission</li>
            <li>Scrape, copy, or use our content without authorization</li>
            <li>Interfere with the proper functioning of the Platform</li>
          </ul>
        </section>

        {/* Content and Intellectual Property */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            6. Content and Intellectual Property
          </h2>
          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            6.1 User Content
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You retain ownership of the content you upload to Cosbaii ("User Content"). 
            By uploading content, you grant Cosbaii a worldwide, non-exclusive, royalty-free 
            license to use, display, reproduce, and distribute your content on the Platform 
            for the purpose of providing our services.
          </p>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            6.2 Platform Content
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            All content, features, and functionality on the Platform (excluding User Content) 
            are owned by Cosbaii and are protected by copyright, trademark, and other intellectual 
            property laws.
          </p>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            6.3 Copyright Infringement
          </h3>
          <p className="text-gray-700 leading-relaxed">
            We respect intellectual property rights. If you believe your work has been infringed, 
            please contact us at support@cosbaii.com with detailed information.
          </p>
        </section>

        {/* Privacy */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            7. Privacy and Data Protection
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, 
            and protect your personal information. By using the Platform, you consent to our 
            data practices as described in our Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We implement reasonable security measures to protect your data, but cannot guarantee 
            absolute security. You acknowledge the inherent risks of transmitting information online.
          </p>
        </section>

        {/* Fees and Payments */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            8. Fees and Payments
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Currently, Cosbaii offers free access to its core features during the early access phase. 
            We reserve the right to introduce paid features or subscription plans in the future.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If we introduce paid services, you will be notified in advance and can choose whether 
            to subscribe. All fees will be clearly disclosed before purchase.
          </p>
        </section>

        {/* Termination */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            9. Termination
          </h2>
          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            9.1 By You
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            You may terminate your account at any time by contacting us at support@cosbaii.com 
            or through your account settings.
          </p>

          <h3 className="font-semibold text-xl text-gray-800 mb-3 mt-6">
            9.2 By Us
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to suspend or terminate your account if:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>You violate these Terms</li>
            <li>Your account is inactive for an extended period</li>
            <li>We are required to do so by law</li>
            <li>We discontinue the Platform</li>
          </ul>
        </section>

        {/* Disclaimers */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            10. Disclaimers
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
            EITHER EXPRESS OR IMPLIED. COSBAII DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Merchantability and fitness for a particular purpose</li>
            <li>Non-infringement of intellectual property rights</li>
            <li>Accuracy, reliability, or completeness of content</li>
            <li>Uninterrupted or error-free service</li>
            <li>Security of data transmission</li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            11. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, COSBAII SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Damages resulting from user errors or third-party actions</li>
            <li>Unauthorized access to or use of our servers or your data</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Our total liability shall not exceed the amount you paid us in the 12 months 
            preceding the claim, or $100 if you have not made any payments.
          </p>
        </section>

        {/* Indemnification */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            12. Indemnification
          </h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to indemnify, defend, and hold harmless Cosbaii, its officers, directors, 
            employees, and agents from any claims, liabilities, damages, losses, and expenses 
            arising from your use of the Platform, violation of these Terms, or infringement 
            of any rights of another party.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            13. Governing Law and Dispute Resolution
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms shall be governed by and construed in accordance with the laws of 
            [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Any disputes arising from these Terms shall be resolved through binding arbitration 
            in accordance with the rules of [Arbitration Association], except where prohibited by law.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            14. Changes to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms at any time. We will notify you of 
            material changes via email or through the Platform. Your continued use after 
            such notification constitutes acceptance of the modified Terms.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            15. Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions about these Terms, please contact us:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> support@cosbaii.com<br />
              <strong>Website:</strong> www.cosbaii.com
            </p>
          </div>
        </section>

        {/* Severability */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            16. Severability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If any provision of these Terms is found to be unenforceable or invalid, that 
            provision shall be limited or eliminated to the minimum extent necessary, and 
            the remaining provisions shall remain in full force and effect.
          </p>
        </section>

        {/* Entire Agreement */}
        <section className="mb-8">
          <h2 className="font-bold text-2xl text-cosbaii-gray mb-4">
            17. Entire Agreement
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms, together with our Privacy Policy, constitute the entire agreement 
            between you and Cosbaii regarding your use of the Platform and supersede all 
            prior agreements and understandings.
          </p>
        </section>
      </div>

      {/* Footer Note */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          By using Cosbaii, you acknowledge that you have read and understood these Terms and 
          agree to be bound by them.
        </p>
      </div>
    </div>
  );
}