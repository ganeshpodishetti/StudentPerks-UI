import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for PerksCrowd, explaining how we collect and use your data.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        Last updated: March 23, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">1. Introduction</h2>
          <p className="mt-2">
            PerksCrowd ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how
            we collect, use, and share information about you when you use our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">2. Information We Collect</h2>
          <p className="mt-2 text-sm font-semibold">Information You Provide to Us:</p>
          <ul className="list-disc ml-6 mt-1 space-y-1">
            <li>Account Information: When you register, we collect your name, email address, and password.</li>
            <li>Profile Information: You may choose to provide additional information such as your university or brand interests.</li>
            <li>Content Submissions: We collect the deals, links, and descriptions you submit to the platform.</li>
          </ul>
          
          <p className="mt-4 text-sm font-semibold">Information from Third Parties (Google OAuth):</p>
          <p className="mt-1">
            If you choose to sign in using Google, we receive your name, email address, and profile picture from Google.
            This information is used to create or sync your PerksCrowd account. 
          </p>
          <p className="mt-2 italic">
            PerksCrowd&apos;s use and transfer to any other app of information received from Google APIs will adhere to 
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline px-1">
              Google API Services User Data Policy
            </a>, including the Limited Use requirements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">3. How We Use Your Information</h2>
          <p className="mt-2">
            We use the information we collect to:
          </p>
          <ul className="list-disc ml-6 mt-1 space-y-1">
            <li>Provide, maintain, and improve our services.</li>
            <li>Verify your identity and prevent unauthorized access.</li>
            <li>Process and display the deals you submit.</li>
            <li>Communicate with you about your account and updates to our services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">4. Data Sharing and Disclosure</h2>
          <p className="mt-2">
            We do not sell your personal information. We may share information with third-party service providers 
            who perform services on our behalf (e.g., hosting providers, email services), but only to the extent 
            necessary for them to provide those services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">5. Your Choices and Rights</h2>
          <p className="mt-2">
            You can access, update, or delete your account information at any time through your profile settings. 
            If you wish to permanently delete your account and all associated data, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">6. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by 
            posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">7. Contact Us</h2>
          <p className="mt-2">
            If you have any questions about this Privacy Policy, please contact us at support@perkscrowd.com.
          </p>
        </section>
      </div>
    </main>
  )
}
