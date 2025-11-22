import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Lesson, Assessment } from '../types';

interface Props {
  lessonId: string;
}

export default function LessonPlayer({ lessonId }: Props) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    const db = getFirestore();
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
    } else {
      handleComplete();
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitQuiz = async () => {
    if (!lesson || !selectedAnswer) return;

    const assessment = lesson.assessments[0];
    const isCorrect = selectedAnswer === assessment.correct_answer;

    setShowFeedback(true);

    if (isCorrect) {
      // Call Cloud Function to grade and update progress
      const response = await fetch('https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/gradeLesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          answers: [{ assessmentId: assessment.id, answer: selectedAnswer }],
        }),
      });

      const result = await response.json();
      console.log('Grading result:', result);
    }
  };

  const handleComplete = () => {
    // Navigate back to skill tree or next lesson
  };

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const step = lesson.steps[currentStep];
  const isQuiz = step.type === 'quiz';
  const assessment = isQuiz ? lesson.assessments[0] : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.progress}>
          Step {currentStep + 1} / {lesson.steps.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {step.type === 'text' && (
          <Text style={styles.text}>{step.content}</Text>
        )}

        {step.type === 'video' && (
          <View style={styles.videoPlaceholder}>
            <Text>Video: {step.content}</Text>
          </View>
        )}

        {isQuiz && assessment && (
          <View style={styles.quiz}>
            <Text style={styles.question}>{assessment.question}</Text>

            {assessment.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  selectedAnswer === option && styles.selectedOption,
                  showFeedback && option === assessment.correct_answer && styles.correctOption,
                  showFeedback && selectedAnswer === option && option !== assessment.correct_answer && styles.wrongOption,
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={showFeedback}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

            {!showFeedback && selectedAnswer && (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuiz}>
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              </TouchableOpacity>
            )}

            {showFeedback && (
              <View style={styles.feedback}>
                <Text style={[styles.feedbackText, selectedAnswer === assessment.correct_answer ? styles.correct : styles.wrong]}>
                  {selectedAnswer === assessment.correct_answer ? '✓ Correct!' : '✗ Incorrect'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, isQuiz && !showFeedback && styles.disabledButton]}
          onPress={handleNext}
          disabled={isQuiz && !showFeedback}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === lesson.steps.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  quiz: {
    marginTop: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  option: {
    padding: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FF',
  },
  correctOption: {
    borderColor: '#34C759',
    backgroundColor: '#E8F5E9',
  },
  wrongOption: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedback: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  correct: {
    color: '#34C759',
  },
  wrong: {
    color: '#FF3B30',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
