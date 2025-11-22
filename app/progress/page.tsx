'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Progress as ProgressType, User } from '@/lib/types';

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
    return <div className="container">Loading...</div>;
  }

  const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="container">
      <div style={{ background: '#007AFF', padding: 40, borderRadius: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>
          Your Progress
        </h1>
        <p style={{ fontSize: 16, color: 'white', opacity: 0.9 }}>
          {user.displayName || 'User'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>{user.xp}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 5 }}>Total XP</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>{user.level}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 5 }}>Level</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#007AFF' }}>{user.streak}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 5 }}>Day Streak</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Lesson Progress</h2>
        <div style={{
          height: 10,
          background: '#e0e0e0',
          borderRadius: 5,
          overflow: 'hidden',
          marginBottom: 10
        }}>
          <div style={{
            height: '100%',
            width: `${completionRate}%`,
            background: '#34C759'
          }} />
        </div>
        <p style={{ fontSize: 14, color: '#666' }}>
          {completedLessons} / {totalLessons} lessons completed ({completionRate.toFixed(0)}%)
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Recent Activity</h2>
        {progress
          .sort((a, b) => new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime())
          .slice(0, 5)
          .map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 12,
              paddingBottom: 12,
              borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                  Lesson {item.lessonId}
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  {new Date(item.lastAttempt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: item.completed ? 20 : 16,
                  fontWeight: 600,
                  color: item.completed ? '#34C759' : '#007AFF',
                  marginBottom: 2
                }}>
                  {item.completed ? '✓' : `${item.score}%`}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>+{item.xpEarned} XP</div>
              </div>
            </div>
          ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Achievements</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {user.streak >= 7 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f0f0f0',
              padding: '8px 12px',
              borderRadius: 20
            }}>
              <span style={{ fontSize: 20, marginRight: 6 }}>🔥</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Week Warrior</span>
            </div>
          )}
          {user.level >= 5 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f0f0f0',
              padding: '8px 12px',
              borderRadius: 20
            }}>
              <span style={{ fontSize: 20, marginRight: 6 }}>⭐</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Rising Star</span>
            </div>
          )}
          {completedLessons >= 10 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f0f0f0',
              padding: '8px 12px',
              borderRadius: 20
            }}>
              <span style={{ fontSize: 20, marginRight: 6 }}>🎓</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Quick Learner</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
