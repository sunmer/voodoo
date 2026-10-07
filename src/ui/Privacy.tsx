import {Header} from './Header';

export function SiteFooter() {
  return <footer className="site-footer">
      <a href="#/">cliphou.se</a>
      <a href="#/privacy">Privacy</a>
    </footer>;
}

export function PrivacyPage() {
  return <div className="page">
    <Header />
    <main className="privacy-page">
      <h1>Privacy</h1>
      <h2>Your account and stars</h2>
      <p>Google sign-in uses Firebase Authentication. It provides your account identifier, name, email address, and profile picture. Your starred video IDs and save times are stored in Cloud Firestore under your account. Stars are private, not public ratings.</p>
      <p>Signing out does not delete stars. Unstar a video to remove its bookmark. Account deletion requests must be handled by the service operator.</p>
      <h2>Your edits</h2>
      <p>Text edits, colors, and your brand kit stay in this browser's local storage. They are not synced to your account. Clearing site data removes them from this device.</p>
      <h2>Analytics</h2>
      <p>When configured, Google Analytics runs automatically when the site loads and receives page views, sign-ins, bookmark actions, and props downloads. It may use first-party cookies to measure visits. We do not send your name, email, account identifier, search terms, or edited video text to Analytics. Google may process device, network, and usage information.</p>
      <p>Advertising storage, Google signals, and advertising personalization are disabled. This site does not show an analytics consent screen.</p>
      <h2>Service providers</h2>
      <p>Hosting providers process requests needed to deliver the site. Google processes account and bookmark data to provide authentication and storage. Essential browser storage keeps your sign-in and edits.</p>
      <a className="link-btn" href="#/">Back to videos</a>
    </main>
  </div>;
}
