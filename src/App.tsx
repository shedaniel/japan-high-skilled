import { useCallback, useMemo } from "react";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { ActivitySelector } from "@/components/calculator/activity-selector";
import { BonusesSection } from "@/components/calculator/bonuses-section";
import { EducationSection } from "@/components/calculator/education-section";
import { LanguageSection } from "@/components/calculator/language-section";
import { ProfileSection } from "@/components/calculator/profile-section";
import { QualificationsSection } from "@/components/calculator/qualifications-section";
import { ResearchSection } from "@/components/calculator/research-section";
import { ScorePanel } from "@/components/calculator/score-panel";
import { SourcesSection } from "@/components/calculator/sources-section";
import type { UpdateProfile } from "@/components/calculator/types";
import type { ActivityType } from "@/domain/types";
import { calculateScore } from "@/lib/calculator";
import { useProfile } from "@/lib/storage";

function App() {
  const { profile, setProfile, reset, savedAt } = useProfile();
  const score = useMemo(() => calculateScore(profile), [profile]);
  const update: UpdateProfile = useCallback(
    (updater) => setProfile(updater),
    [setProfile],
  );
  const handleActivityChange = useCallback(
    (activity: ActivityType) => {
      setProfile((current) =>
        current.activity === activity ? current : { ...current, activity },
      );
    },
    [setProfile],
  );

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <AppHeader
        onImport={setProfile}
        onReset={reset}
        profile={profile}
        savedAt={savedAt}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="flex min-w-0 flex-col gap-6">
            <ActivitySelector
              activity={profile.activity}
              onChange={handleActivityChange}
            />
            <ProfileSection
              profile={profile}
              score={score}
              update={update}
            />
            <EducationSection
              profile={profile}
              score={score}
              update={update}
            />
            {profile.activity !== "management" ? (
              <ResearchSection
                profile={profile}
                score={score}
                update={update}
              />
            ) : null}
            <QualificationsSection
              profile={profile}
              score={score}
              update={update}
            />
            <LanguageSection
              profile={profile}
              score={score}
              update={update}
            />
            <BonusesSection
              profile={profile}
              score={score}
              update={update}
            />
          </div>

          <aside className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
            <ScorePanel profile={profile} score={score} />
          </aside>
        </div>

        <SourcesSection />
      </main>

      <AppFooter />
    </div>
  );
}

export default App;
