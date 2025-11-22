export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lessonId, answers } = req.body;
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Mock lesson data
  const lesson = {
    id: lessonId,
    assessments: [
      {
        id: 'quiz-1',
        type: 'multiple_choice',
        correct_answer: 'White Rum',
        points: 10,
      },
    ],
    xp_value: 50,
    pass_threshold: 70,
  };

  let totalPoints = 0;
  let earnedPoints = 0;
  const results = [];

  for (const assessment of lesson.assessments) {
    totalPoints += assessment.points;

    const userAnswer = answers.find(a => a.assessmentId === assessment.id);
    if (!userAnswer) {
      results.push({ assessmentId: assessment.id, correct: false, points: 0 });
      continue;
    }

    const isCorrect = userAnswer.answer.trim().toLowerCase() ===
                      assessment.correct_answer.trim().toLowerCase();

    const pointsEarned = isCorrect ? assessment.points : 0;
    earnedPoints += pointsEarned;
    results.push({ assessmentId: assessment.id, correct: isCorrect, points: pointsEarned });
  }

  const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const passed = score >= lesson.pass_threshold;
  const xpEarned = passed ? lesson.xp_value : 0;

  res.status(200).json({
    success: true,
    score,
    passed,
    xpEarned,
    results,
    totalPoints,
    earnedPoints,
  });
}
