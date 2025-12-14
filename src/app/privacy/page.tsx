import { Container } from "@/components/Container";

export default function PrivacyPage() {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16">
      <Container>
        <div className="max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p>
            We care about your privacy. This page describes how we handle data collected through this website.
          </p>
          <h2 className="text-xl font-semibold">What we collect</h2>
          <p>
            We collect minimal analytics (page views, basic device information) to improve the site experience. If you submit a form, we collect the fields you provide (such as name, company, email) to contact you.
          </p>
          <h2 className="text-xl font-semibold">How we use data</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve our services and site experience.</li>
            <li>Respond to your requests and communicate with you.</li>
            <li>Security monitoring and fraud prevention.</li>
          </ul>
          <h2 className="text-xl font-semibold">Sharing</h2>
          <p>
            We do not sell your data. We may use trusted processors (hosting, analytics) under contract to operate the service.
          </p>
          <h2 className="text-xl font-semibold">Retention</h2>
          <p>
            We keep data only as long as necessary for the purposes above or to meet legal obligations.
          </p>
          <h2 className="text-xl font-semibold">Your rights</h2>
          <p>
            You can request access, correction, or deletion of your personal data. Contact us at <a className="underline" href="mailto:skynet.consulting.dz@email.com">skynet.consulting.dz@email.com</a>.
          </p>
          <h2 className="text-xl font-semibold">Cookies</h2>
          <p>
            We use cookies for essential functionality and basic analytics. You can adjust your browser settings to refuse cookies.
          </p>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            For privacy questions, contact: <a className="underline" href="mailto:skynet.consulting.dz@email.com">skynet.consulting.dz@email.com</a>.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: 2025-12-14</p>
        </div>
      </Container>
    </main>
  );
}
