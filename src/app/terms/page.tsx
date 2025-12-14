import { Container } from "@/components/Container";

export default function TermsPage() {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
      <Container>
        <div className="max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p>
            These terms govern your use of the Skynet Consulting website and services.
          </p>
          <h2 className="text-xl font-semibold">Use of the site</h2>
          <p>
            You agree to use the site in compliance with applicable laws and not to disrupt or attempt to gain unauthorized access to our systems.
          </p>
          <h2 className="text-xl font-semibold">Information provided</h2>
          <p>
            If you submit forms, you confirm the information is accurate and that you have the right to share it.
          </p>
          <h2 className="text-xl font-semibold">Intellectual property</h2>
          <p>
            Content on this site is owned by Skynet Consulting or its licensors. Do not copy or redistribute without permission.
          </p>
          <h2 className="text-xl font-semibold">No warranty</h2>
          <p>
            The site is provided “as is” without warranties. We do not guarantee uninterrupted or error-free operation.
          </p>
          <h2 className="text-xl font-semibold">Limitation of liability</h2>
          <p>
            To the extent permitted by law, Skynet Consulting is not liable for indirect or consequential damages arising from use of the site.
          </p>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            Questions about these terms: <a className="underline" href="mailto:skynet.consulting.dz@email.com">skynet.consulting.dz@email.com</a>.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: 2025-12-14</p>
        </div>
      </Container>
    </main>
  );
}
