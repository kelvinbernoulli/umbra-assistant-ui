import { LockKeyhole, Mic, Volume2 } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { Toggle } from "../components/Toggle";
import { useSettings } from "../hooks/useSettings";
import { useUmbra } from "../hooks/useUmbra";

const languages = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "en-NG", label: "English (Nigeria)" },
  { value: "fr-FR", label: "French (France)" },
  { value: "es-ES", label: "Spanish (Spain)" },
];

export default function VoiceLanguageSettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { openCommand } = useUmbra();

  return (
    <>
      <section className="settings-section">
        <SectionHeading eyebrow="Voice input" title="Talk naturally to Umbra" />
        <div className="setting-row">
          <div>
            <strong>Voice commands</strong>
            <span>
              Use your microphone to search, navigate, and send commands to the
              server.
            </span>
          </div>
          <Toggle
            active={settings.voiceCommands}
            onClick={() =>
              updateSettings({ voiceCommands: !settings.voiceCommands })
            }
            label="Voice commands"
          />
        </div>
        <div className="setting-row">
          <div>
            <strong>Run after a pause</strong>
            <span>
              Automatically submit a command when you finish speaking.
            </span>
          </div>
          <Toggle
            active={settings.autoSubmitVoice}
            onClick={() =>
              updateSettings({ autoSubmitVoice: !settings.autoSubmitVoice })
            }
            label="Run voice commands after a pause"
          />
        </div>
        <div className="setting-row">
          <div>
            <strong>Spoken confirmations</strong>
            <span>Read completed voice-command results back to you.</span>
          </div>
          <Toggle
            active={settings.spokenConfirmations}
            onClick={() =>
              updateSettings({
                spokenConfirmations: !settings.spokenConfirmations,
              })
            }
            label="Spoken confirmations"
          />
        </div>
      </section>

      <section className="settings-section">
        <SectionHeading eyebrow="Language" title="Recognition & replies" />
        <label className="setting-row">
          <div>
            <strong>Recognition language</strong>
            <span>The language Umbra listens for.</span>
          </div>
          <select
            className="setting-control"
            value={settings.recognitionLanguage}
            onChange={(event) =>
              updateSettings({ recognitionLanguage: event.target.value })
            }
          >
            {languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
        <label className="setting-row">
          <div>
            <strong>Spoken response language</strong>
            <span>Used when spoken confirmations are enabled.</span>
          </div>
          <select
            className="setting-control"
            value={settings.responseLanguage}
            onChange={(event) =>
              updateSettings({ responseLanguage: event.target.value })
            }
          >
            <option value="same">Same as recognition</option>
            {languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="settings-section settings-section--compact">
        <div className="settings-test-row">
          <span className="settings-test-row__icon">
            <Volume2 size={18} />
          </span>
          <div>
            <strong>Try your voice setup</strong>
            <span>
              Open the command deck and test recognition with these settings.
            </span>
          </div>
          <button
            className="button button--gold"
            onClick={() => openCommand("voice")}
            disabled={!settings.voiceCommands}
          >
            <Mic size={15} /> Test voice
          </button>
        </div>
        <div className="settings-note">
          <LockKeyhole size={15} />
          <span>
            Microphone access is requested only while Umbra is listening.
          </span>
        </div>
      </section>
    </>
  );
}
