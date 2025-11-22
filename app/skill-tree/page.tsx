'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { SkillNode } from '@/lib/types';

export default function SkillTree() {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [userXP, setUserXP] = useState(0);

  useEffect(() => {
    loadSkills();
    loadUserData();
  }, []);

  const loadSkills = async () => {
    const snapshot = await getDocs(collection(db, 'skills'));
    const skillsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SkillNode[];
    setSkills(skillsData);
  };

  const loadUserData = async () => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserXP(userDoc.data().xp || 0);
      }
    }
  };

  const handleSkillPress = (skill: SkillNode) => {
    if (skill.unlocked) {
      router.push(`/lesson/${skill.lessons[0]}`);
    }
  };

  return (
    <div className="container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        background: 'white',
        borderRadius: 12,
        marginBottom: 20
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>Skill Tree</h1>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#007AFF' }}>XP: {userXP}</div>
      </div>

      <div style={{ display: 'grid', gap: 15 }}>
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="card"
            style={{
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: skill.completed ? '#34C759' : skill.unlocked ? '#007AFF' : '#ccc',
              background: skill.unlocked ? 'white' : '#f0f0f0',
              opacity: skill.unlocked ? 1 : 0.6,
              cursor: skill.unlocked ? 'pointer' : 'not-allowed'
            }}
            onClick={() => handleSkillPress(skill)}
          >
            <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{skill.title}</h3>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>{skill.description}</p>
            <div style={{ fontSize: 14, color: '#007AFF' }}>
              {skill.completed ? '✓ Completed' : `${skill.lessons.length} lessons`}
            </div>
            {!skill.unlocked && (
              <div style={{ fontSize: 12, color: '#ff3b30', marginTop: 5 }}>
                Requires {skill.xpRequired} XP
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
