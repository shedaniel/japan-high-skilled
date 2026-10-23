import type {
  Profile,
  ScoreResult,
  ScoreSection,
  ScoreSectionId,
} from "@/domain/types";

export type UpdateProfile = (updater: (profile: Profile) => Profile) => void;

export interface CalculatorSectionProps {
  profile: Profile;
  update: UpdateProfile;
  score: ScoreResult;
}

export function sectionById(
  score: ScoreResult,
  id: ScoreSectionId,
): ScoreSection {
  return (
    score.sections.find((section) => section.id === id) ?? {
      id,
      points: 0,
      max: 0,
      lines: [],
    }
  );
}

export function bonusLinePoints(
  score: ScoreResult,
  lineId: string,
): number {
  const bonuses = sectionById(score, "bonuses");
  return bonuses.lines.find((line) => line.id === lineId)?.points ?? 0;
}

export function universityBonusPoints(score: ScoreResult): number {
  return (
    bonusLinePoints(score, "designatedUniversity") +
    bonusLinePoints(score, "japaneseInstitution")
  );
}
