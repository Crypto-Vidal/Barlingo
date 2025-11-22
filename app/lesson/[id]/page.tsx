'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Lesson, Assessment } from '@/lib/types';

export default function LessonPlayer() {
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
    if (lessonDoc.exists()) {
      setLesson({ id: lessonDoc.id, ...lessonDoc.data() } as Lesson);
    }
  };

  const handleNext = () => {
    if (!lesson) return;

    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!lesson || !selectedAnswer) return;

    const assessment = lesson.assessments[0];
    const isCorrect = selectedAnswer === assessment.correct_answer;

    setShowFeedback(true);

    if (isCorrect) {
      await fetch('/api/gradeLesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          answers: [{ assessmentId: assessment.id, answer: selectedAnswer }],
        }),
      });
    }
  };

  if (!lesson) {
    return <div className="container">Loading...</div>;
  }

  const step = lesson.steps[currentStep];
  const isQuiz = step.type === 'quiz';
  const assessment = isQuiz ? lesson.assessments[0] : null;

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>{lesson.title}</h1>
        <p style={{ fontSize: 14, color: '#666' }}>
          Step {currentStep + 1} / {lesson.steps.length}
        </p>
      </div>

      <div className="card">
        {step.type === 'text' && (
          <p style={{ fontSize: 16, lineHeight: 1.5, color: '#333' }}>{step.content}</p>
        )}

        {step.type === 'video' && (
          <div style={{
            height: 200,
            background: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8
          }}>
            <p style={{ color: 'white' }}>Video: {step.content}</p>
          </div>
        )}

        {isQuiz && assessment && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
              {assessment.question}
            </h3>

            {assessment.options?.map((option, index) => (
              <div
                key={index}
                style={{
                  padding: 15,
                  border: `2px solid ${
                    showFeedback && option === assessment.correct_answer ? '#34C759' :
                    showFeedback && selectedAnswer === option ? '#FF3B30' :
                    selectedAnswer === option ? '#007AFF' : '#ddd'
                  }`,
                  background: showFeedback && option === assessment.correct_answer ? '#E8F5E9' :
                            showFeedback && selectedAnswer === option ? '#FFEBEE' :
                            selectedAnswer === option ? '#E3F2FF' : 'white',
                  borderRadius: 8,
                  marginBottom: 10,
                  cursor: showFeedback ? 'default' : 'pointer'
                }}
                onClick={() => !showFeedback && setSelectedAnswer(option)}
              >
                {option}
              </div>
            ))}

            {!showFeedback && selectedAnswer && (
              <button
                className="btn btn-primary"
                onClick={handleSubmitQuiz}
                style={{ width: '100%', marginTop: 20 }}
              >
                Submit Answer
              </button>
            )}

            {showFeedback && (
              <div style={{ marginTop: 15, padding: 15, borderRadius: 8 }}>
                <p style={{
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: selectedAnswer === assessment.correct_answer ? '#34C759' : '#FF3B30'
                }}>
                  {selectedAnswer === assessment.correct_answer ? '✓ Correct!' : '✗ Incorrect'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleNext}
        disabled={isQuiz && !showFeedback}
        style={{
          width: '100%',
          marginTop: 20,
          background: (isQuiz && !showFeedback) ? '#ccc' : '#007AFF'
        }}
      >
        {currentStep === lesson.steps.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}
