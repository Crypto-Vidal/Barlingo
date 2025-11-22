import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Progress as ProgressType, User } from '../types';

export default function Progress() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressType[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);

  useEffect(() => {
    loadUserData();
    loadProgress();
  }, []);

  const loadUserData = async () => {
    const auth = getAuth();
    const db = getFirestore();

    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUser({
          uid: userDoc.id,
          ...userDoc.data(),
        } as User);
      }
    }
  };

  const loadProgress = async () => {
    const auth = getAuth();
    const db = getFirestore();

    if (!auth.currentUser) return;

    const progressQuery = query(
      collection(db, 'progress'),
      where('userId', '==', auth.currentUser.uid)
    );

    const progressSnapshot = await getDocs(progressQuery);
    const progressData = progressSnapshot.docs.map(doc => ({
      ...doc.data(),
    })) as ProgressType[];

    setProgress(progressData);
    setCompletedLessons(progressData.filter(p => p.completed).length);

    const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
    setTotalLessons(lessonsSnapshot.size);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.userName}>{user.displayName || 'User'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.xp}</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lesson Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedLessons} / {totalLessons} lessons completed ({completionRate.toFixed(0)}%)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {progress
          .sort((a, b) => new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime())
          .slice(0, 5)
          .map((item, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Lesson {item.lessonId}</Text>
                <Text style={styles.activityDate}>
                  {new Date(item.lastAttempt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.activityStats}>
                <Text style={[styles.activityScore, item.completed && styles.completed]}>
                  {item.completed ? '✓' : item.score}%
                </Text>
                <Text style={styles.activityXP}>+{item.xpEarned} XP</Text>
              </View>
            </View>
          ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsList}>
          {user.streak >= 7 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <Text style={styles.achievementText}>Week Warrior</Text>
            </View>
          )}
          {user.level >= 5 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>⭐</Text>
              <Text style={styles.achievementText}>Rising Star</Text>
            </View>
          )}
          {completedLessons >= 10 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🎓</Text>
              <Text style={styles.achievementText}>Quick Learner</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  activityStats: {
    alignItems: 'flex-end',
  },
  activityScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 2,
  },
  completed: {
    color: '#34C759',
    fontSize: 20,
  },
  activityXP: {
    fontSize: 12,
    color: '#666',
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  achievementIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
