import { ApiAccess } from "../components/ApiState";
import TimelineFeed from "../components/TimelineFeed";
export default function TimelinePage() {
  return (
    <div className="page">
      <div className="page-intro">
        <p className="eyebrow">One continuous view</p>
        <h1>Your timeline</h1>
        <p className="page-intro__copy">
          Messages, emails, events, and reminders from your workspace.
        </p>
      </div>
      <ApiAccess>
        <TimelineFeed />
      </ApiAccess>
    </div>
  );
}
