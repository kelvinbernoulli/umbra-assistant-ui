import { BellRing } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import UnavailableSetting from "../components/UnavailableSetting";

export default function NotificationsSettingsPage() {
  return (
    <>
      <section className="settings-section">
        <SectionHeading
          eyebrow="Daily brief"
          title="Choose when Umbra checks in"
        />
        <UnavailableSetting title="Morning brief" />
        <label className="setting-row">
          <div>
            <strong>Delivery time</strong>
            <span>Scheduling is not available yet.</span>
          </div>
          <input
            className="setting-control setting-control--time"
            type="time"
            aria-label="Delivery time"
            disabled
          />
        </label>
        <UnavailableSetting title="Weekend briefs" />
      </section>
      <section className="settings-section">
        <SectionHeading
          eyebrow="Activity alerts"
          title="What should interrupt you"
        />
        <UnavailableSetting title="Important messages" />
        <UnavailableSetting title="Event reminders" />
        <UnavailableSetting title="Command notifications" />
      </section>
      <section className="settings-section">
        <SectionHeading eyebrow="Quiet hours" title="Protect your focus" />
        <UnavailableSetting title="Pause non-urgent alerts" />
        <div className="settings-time-grid">
          <label>
            <span>From</span>
            <input className="setting-control" type="time" disabled />
          </label>
          <span className="settings-time-grid__rule" aria-hidden="true" />
          <label>
            <span>Until</span>
            <input className="setting-control" type="time" disabled />
          </label>
        </div>
      </section>
      <section className="settings-section settings-section--compact">
        <div className="settings-test-row">
          <span className="settings-test-row__icon">
            <BellRing size={18} />
          </span>
          <div>
            <strong>Browser notifications</strong>
            <span>Notification delivery is not available yet.</span>
          </div>
        </div>
        <UnavailableSetting title="Email digest" />
      </section>
    </>
  );
}
