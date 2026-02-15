// Assessment Components
export { QuestionCard } from './QuestionCard';
export { QuizProgress } from './QuizProgress';
export { AssessmentCard } from './AssessmentCard';
export { AssessmentList } from './AssessmentList';
export { AssessmentResultComponent } from './AssessmentResult';
export { AssessmentView } from './AssessmentView';
export { AssessmentFeedback } from './AssessmentFeedback';
export { AssessmentReports } from './AssessmentReports';

// Types re-export for convenience
export type {
    Question,
    Assessment,
    AssessmentResult,
    AssessmentAttempt,
    AssessmentStats,
    TopicAssessmentProgress,
    QuizStreak,
    QuestionAnswer,
    AssessmentFormData,
    QuestionType,
    AssessmentType,
    Difficulty,
} from '@/types/assessment';

export {
    ASSESSMENT_TYPE_LABELS,
    ASSESSMENT_TYPE_DESCRIPTIONS,
    ASSESSMENT_TYPE_COLORS,
    QUESTION_TYPE_LABELS,
    DIFFICULTY_LABELS,
    DIFFICULTY_COLORS,
    ASSESSMENT_XP,
    HIGH_SCORE_BONUS,
    PERFECT_SCORE_BONUS,
    DIFFICULTY_XP_MULTIPLIER,
    DEFAULT_ASSESSMENT_SETTINGS,
} from '@/types/assessment';
