import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

interface Answer {
  assessmentId: string;
  answer: string | string[];
}

interface GradeLessonRequest {
  lessonId: string;
  answers: Answer[];
}

interface Assessment {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching';
  question: string;
  options?: string[];
  correct_answer: string | string[];
  points: number;
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  assessments: Assessment[];
  xp_value: number;
  pass_threshold: number;
}

export const gradeLesson = functions.https.onCall(async (data: GradeLessonRequest, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { lessonId, answers } = data;
  const userId = context.auth.uid;

  try {
    // Fetch lesson
    const lessonDoc = await db.collection('lessons').doc(lessonId).get();
    if (!lessonDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Lesson not found');
    }

    const lesson = { id: lessonDoc.id, ...lessonDoc.data() } as Lesson;

    // Grade each answer
    let totalPoints = 0;
    let earnedPoints = 0;
    const results: { assessmentId: string; correct: boolean; points: number }[] = [];

    for (const assessment of lesson.assessments) {
      totalPoints += assessment.points;

      const userAnswer = answers.find(a => a.assessmentId === assessment.id);
      if (!userAnswer) {
        results.push({ assessmentId: assessment.id, correct: false, points: 0 });
        continue;
      }

      // Verify answer
      let isCorrect = false;
      if (assessment.type === 'multiple_choice' || assessment.type === 'fill_blank') {
        isCorrect = normalizeAnswer(userAnswer.answer as string) ===
                    normalizeAnswer(assessment.correct_answer as string);
      } else if (assessment.type === 'matching' && Array.isArray(assessment.correct_answer)) {
        isCorrect = JSON.stringify(userAnswer.answer) === JSON.stringify(assessment.correct_answer);
      }

      const pointsEarned = isCorrect ? assessment.points : 0;
      earnedPoints += pointsEarned;
      results.push({ assessmentId: assessment.id, correct: isCorrect, points: pointsEarned });
    }

    // Calculate score
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= lesson.pass_threshold;
    const xpEarned = passed ? lesson.xp_value : 0;

    // Fetch or create progress document
    const progressQuery = await db.collection('progress')
      .where('userId', '==', userId)
      .where('lessonId', '==', lessonId)
      .limit(1)
      .get();

    let progressRef;
    if (progressQuery.empty) {
      progressRef = db.collection('progress').doc();
      await progressRef.set({
        userId,
        lessonId,
        completed: passed,
        score,
        attempts: 1,
        lastAttempt: admin.firestore.FieldValue.serverTimestamp(),
        xpEarned,
      });
    } else {
      progressRef = progressQuery.docs[0].ref;
      const currentData = progressQuery.docs[0].data();

      await progressRef.update({
        completed: passed || currentData.completed,
        score: Math.max(score, currentData.score || 0),
        attempts: admin.firestore.FieldValue.increment(1),
        lastAttempt: admin.firestore.FieldValue.serverTimestamp(),
        xpEarned: passed && !currentData.completed ? xpEarned : currentData.xpEarned,
      });
    }

    // Update user XP if passed and first time
    if (passed && (progressQuery.empty || !progressQuery.docs[0].data().completed)) {
      const userRef = db.collection('users').doc(userId);
      await userRef.update({
        xp: admin.firestore.FieldValue.increment(xpEarned),
        level: admin.firestore.FieldValue.increment(xpEarned >= 100 ? 1 : 0),
      });
    }

    return {
      success: true,
      score,
      passed,
      xpEarned,
      results,
      totalPoints,
      earnedPoints,
    };
  } catch (error) {
    console.error('Error grading lesson:', error);
    throw new functions.https.HttpsError('internal', 'Failed to grade lesson');
  }
});

function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/[^\w\s]/g, '');
}
