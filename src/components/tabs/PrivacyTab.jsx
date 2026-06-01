import { ShieldCheck } from "lucide-react";
import { RESPONSIBLE_GAMBLING_URL } from "../../constants/worldCupData";

const CONTACT_EMAIL = "suadpllana12@gmail.com";
const LAST_UPDATED = "June 2026";

function Section({ title, children }) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-900 p-5">
      <h3 className="mb-3 text-lg font-black tracking-tight text-white">{title}</h3>
      <div className="space-y-3 text-sm leading-relaxed text-zinc-400">{children}</div>
    </section>
  );
}

export default function PrivacyTab() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="rounded-lg border border-white/10 bg-zinc-900 p-6">
        <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Legal
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Privacy Policy &amp; Terms</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Last updated: {LAST_UPDATED}. This page explains how WC2026.live (the &ldquo;Site&rdquo;) handles data, cookies, advertising, and the
          terms of use. By using the Site you agree to this policy.
        </p>
      </section>

      <Section title="Information we collect">
        <p>
          We do not ask you to create an account or submit personal information. Your match predictions and game high scores are stored only in
          your own browser (localStorage) and never sent to us. Our hosting provider may log standard technical data such as IP address, browser
          type, and pages visited for security and analytics.
        </p>
      </Section>

      <Section title="Cookies and advertising">
        <p>
          We use Google AdSense to display ads. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this
          and other websites. Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you based on your visits.
        </p>
        <p>
          You can opt out of personalized advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300 underline hover:text-white">Google Ads Settings</a>,{" "}
          <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300 underline hover:text-white">aboutads.info</a>, or{" "}
          <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300 underline hover:text-white">youronlinechoices.eu</a>.
        </p>
        <p>
          If you visit from the European Economic Area, the UK, or Switzerland, a Google-certified consent banner lets you accept, reject, or
          manage advertising and cookie preferences before personalized ads are shown.
        </p>
      </Section>

      <Section title="Affiliate and betting disclosure">
        <p>
          Some outbound links to sportsbooks are affiliate links marked as sponsored. If you sign up or place a bet through them, we may earn a
          commission at no extra cost to you. Betting content is informational only and intended for adults (18+) where online betting is legal.
          Please gamble responsibly &mdash; see{" "}
          <a href={RESPONSIBLE_GAMBLING_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300 underline hover:text-white">BeGambleAware.org</a>.
        </p>
      </Section>

      <Section title="Editorial accuracy">
        <p>
          Fixtures and news are aggregated from public sources and may change. Predictions and odds are model estimates for editorial purposes
          only &mdash; they are not guarantees, financial advice, or live sportsbook prices. This Site is independent and not affiliated with,
          endorsed by, or sponsored by FIFA.
        </p>
      </Section>

      <Section title="Terms of use">
        <p>
          The Site is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any losses arising from use of the Site,
          including betting decisions. You agree to use the Site lawfully and not to misuse, scrape, or disrupt it.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          We may update this policy from time to time; the &ldquo;last updated&rdquo; date will change accordingly. For any questions or requests,
          contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-amber-300 underline hover:text-white">{CONTACT_EMAIL}</a>.
        </p>
      </Section>
    </div>
  );
}
