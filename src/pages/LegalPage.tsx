import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'
import LegalLinks from '../components/LegalLinks'

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL?.trim()
const operator = import.meta.env.VITE_APP_OPERATOR?.trim()

function Contact() {
  return <section><h2>Contact</h2>
    {operator && <p>Umbra is operated by {operator}.</p>}
    <p>{supportEmail
      ? <>For questions about these terms, privacy, or requests to access or delete your information, email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.</>
      : <>For privacy questions or requests to access or delete your information, contact the person or organization that provided you with access to Umbra.</>}</p>
    <p>Do not include passwords, Google sign-in tokens, or session cookies in a support request.</p>
  </section>
}

function PrivacyPolicy() {
  return <>
    <p className="legal-intro">This policy explains how Umbra handles information when you sign in, connect a source, or use your workspace.</p>
    <section><h2>Information we collect</h2>
      <p>When you sign in with Google, Umbra receives your Google account identifier, email address, name, and confirmation that your email is verified. We use this information to create or find your account, associate it with your workspace, and authenticate requests. Umbra does not receive your Google password.</p>
      <p>Content submitted to your workspace can include messages, emails, calendar events, reminders, search queries, and commands. Information processed depends on the features and sources you use. Service providers may also process technical information such as IP addresses, request timestamps, and error logs to deliver and protect the service.</p>
    </section>
    <section><h2>Google Calendar permissions</h2>
      <p>Connecting Google Calendar is optional and separate from signing in. The connection requests read-only permission for your calendars and events, which can include titles, descriptions, times, locations, and attendees. This permission does not allow Umbra to create, edit, or delete Google Calendar events.</p>
      <p>Umbra stores an encrypted authorization credential to maintain your connection. Connecting alone does not import events; the calendar view displays records that have been added to your workspace.</p>
    </section>
    <section><h2>How information is used and processed</h2>
      <p>Umbra uses account information to manage access and workspace content to provide the organization, timeline, and search features you request. When content is indexed for semantic search, it is converted into numerical representations using an embedding model. Pinecone processes and stores those representations together with text and metadata needed to retrieve records.</p>
      <p>Creating search representations is not training a general-purpose AI model. Umbra does not use Google user data to train general-purpose AI models, sell that data, or use it for advertising.</p>
      <p>Google processes sign-in and authorization requests. Hosting, database, and search providers process information needed to operate Umbra. The site also requests fonts from Google Fonts, which sends your browser's network information to Google. Provider processing may take place outside your country.</p>
      <p>Umbra's use and transfer of information received from Google APIs is subject to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">Google API Services User Data Policy</a>, including its Limited Use requirements. Access to Google data is limited to requested features and permitted support, security, and legal purposes.</p>
    </section>
    <section><h2>Cookies and browser storage</h2>
      <p>Umbra uses cookies to keep you signed in and protect sign-in attempts. Session cookies cannot be read by frontend JavaScript. Preferences such as your theme are saved in your browser. Google sign-in credentials and Umbra session secrets are not stored in browser local storage.</p>
    </section>
    <section><h2>Storage, retention, and security</h2>
      <p>Account and workspace records are stored on the server. Google connection credentials are encrypted at rest, and session secrets are stored as hashes. These measures reduce risk, but no service can guarantee absolute security.</p>
      <p>Account and workspace records remain stored until removed by the operator or an applicable retention process. Umbra does not currently offer a user-configurable automatic deletion period. Signing out ends your session; it does not delete your account or saved content.</p>
    </section>
    <section><h2>Your choices and deletion requests</h2>
      <p>You can disconnect Google Calendar from <Link to="/connections">Connections</Link> to remove the credential stored by Umbra. You can also revoke access in your <a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer">Google Account connections</a>. Neither action automatically deletes previously saved workspace records.</p>
      <p><Link to="/settings/privacy-data">Privacy and data settings</Link> let you export or reset browser preferences. Those controls do not export or delete server records. Contact the operator to request access, correction, or deletion of your account and workspace information. Some records may need to be retained for security or legal obligations.</p>
    </section>
    <section><h2>Changes to this policy</h2><p>We will update this page when data practices change. New uses of Google information will be disclosed, and additional consent will be requested where required before those uses begin.</p></section>
    <Contact />
  </>
}

function TermsOfService() {
  return <>
    <p className="legal-intro">These terms cover your use of Umbra, a workspace for organizing and searching information from sources you choose to connect. By using Umbra, you agree to these terms.</p>
    <section><h2>Your account</h2><p>You must have authority to use the Google account you sign in with and to share the information you submit. Keep your account secure and notify the operator if you suspect unauthorized access. You are responsible for activity you authorize through your account.</p></section>
    <section><h2>Your content and permissions</h2><p>You retain your rights in content you provide. You permit Umbra and the service providers needed to operate it to store, process, and display that content to provide the features you request. Only submit information you have permission to use, including information about other people.</p><p>Connecting a third-party service authorizes access within the permissions shown during consent. You may disconnect it or revoke access through that provider. Third-party services also have their own terms and privacy policies.</p></section>
    <section><h2>Acceptable use</h2><p>Do not use Umbra for unlawful activity, to infringe another person's rights, to distribute malicious content, or to access another user's workspace without permission. Do not bypass security controls, misuse credentials, or interfere with the service.</p></section>
    <section><h2>Availability and accuracy</h2><p>Umbra is under development. Features may be unavailable, change, or be interrupted. Search results, imported records, and any automated output may be incomplete or inaccurate. Check important information against its original source and keep your own copies of records you need. Umbra is not an emergency service.</p></section>
    <section><h2>Privacy</h2><p>The <Link to="/privacy">Privacy Policy</Link> explains account information, connected data, service providers, cookies, retention, and your available controls. Disconnecting a source or signing out does not by itself delete saved content.</p></section>
    <section><h2>Ending access</h2><p>You may stop using Umbra at any time and request removal of your account and data. Access may be limited or suspended to address misuse, security threats, legal requirements, or service closure. Where practical, the operator will provide notice of significant changes affecting access.</p></section>
    <section><h2>Responsibility and legal rights</h2><p>To the extent permitted by applicable law, Umbra is provided as available without a promise of uninterrupted operation or error-free results. Nothing in these terms excludes rights or responsibilities that cannot lawfully be excluded, including mandatory consumer protections.</p></section>
    <section><h2>Updates to these terms</h2><p>Updated terms will be published here with a revised date. Material changes will be communicated where appropriate. If you do not agree to updated terms, you may stop using the service.</p></section>
    <Contact />
  </>
}

export default function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const title = kind === 'privacy' ? 'Privacy policy' : 'Terms of service'
  useEffect(() => {
    const previous = document.title
    document.title = `${title} | Umbra`
    return () => { document.title = previous }
  }, [title])
  return <div className="legal-page" key={kind}>
    <header className="legal-header"><Link to="/" aria-label="Umbra home"><BrandMark /></Link><Link className="text-link" to="/">Back to Umbra</Link></header>
    <main className="legal-document">
      <p className="eyebrow">Umbra · Your information, your workspace</p><h1>{title}</h1>
      <p className="legal-date">Last updated <time dateTime="2026-09-22">September 22, 2026</time></p>
      {kind === 'privacy' ? <PrivacyPolicy /> : <TermsOfService />}
    </main>
    <footer className="legal-footer"><LegalLinks /></footer>
  </div>
}
