import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of use for submitting and sharing deals on PerksCrowd.',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12 md:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
        Terms of Use
      </h1>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        Last updated: March 15, 2026
      </p>

      <div className="mt-8 space-y-6 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">1. Content You Submit</h2>
          <p className="mt-2">
            When you submit a deal, you confirm that you have the right to share the linked content and any brand names,
            trademarks, logos, or images included with the submission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">2. Trademarks and Copyrights</h2>
          <p className="mt-2">
            Brand assets remain the property of their respective owners. PerksCrowd does not claim ownership of third-party
            logos or trademarks and may remove any content that appears unauthorized or misleading.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">3. Fair and Informational Use</h2>
          <p className="mt-2">
            Brand references on PerksCrowd are intended for deal identification and informational purposes only. Listings
            should not imply endorsement, sponsorship, or partnership unless explicitly approved by the brand.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">4. Takedown Requests</h2>
          <p className="mt-2">
            If you are a rights holder and believe content infringes your rights, contact us with details of the listing and
            ownership proof. We will review and remove or update content as appropriate.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">5. Limitation of Liability</h2>
          <p className="mt-2">
            PerksCrowd is provided "as is" without any warranties. We are not responsible for the accuracy of 
            deals submitted by users or for any issues that may arise from using third-party websites linked 
            from our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">6. Termination</h2>
          <p className="mt-2">
            We reserve the right to suspend or terminate your account at any time for violations of these terms 
            or for any other reason at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">7. Changes</h2>
          <p className="mt-2">
            We may update these terms at any time. Continued use of PerksCrowd after updates means you accept the revised
            terms.
          </p>
        </section>
      </div>
    </main>
  )
}

