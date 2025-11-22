import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { SkillNode } from '../types';

export default function SkillTree() {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [userXP, setUserXP] = useState(0);

  useEffect(() => {
    loadSkills();
    loadUserData();
  }, []);

  const loadSkills = async () => {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, 'skills'));
    const skillsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SkillNode[];
    setSkills(skillsData);
  };

  const loadUserData = async () => {
    const auth = getAuth();
    const db = getFirestore();
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserXP(userDoc.data().xp || 0);
      }
    }
  };

  const handleSkillPress = (skill: SkillNode) => {
    if (skill.unlocked) {
      // Navigate to lesson list for this skill
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Skill Tree</Text>
        <Text style={styles.xp}>XP: {userXP}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {skills.map((skill) => (
          <TouchableOpacity
            key={skill.id}
            style={[
              styles.skillNode,
              !skill.unlocked && styles.locked,
              skill.completed && styles.completed,
            ]}
            onPress={() => handleSkillPress(skill)}
            disabled={!skill.unlocked}
          >
            <Text style={styles.skillTitle}>{skill.title}</Text>
            <Text style={styles.skillDescription}>{skill.description}</Text>
            <Text style={styles.skillMeta}>
              {skill.completed ? '✓ Completed' : `${skill.lessons.length} lessons`}
            </Text>
            {!skill.unlocked && (
              <Text style={styles.requirement}>
                Requires {skill.xpRequired} XP
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  xp: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  skillNode: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  locked: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    opacity: 0.6,
  },
  completed: {
    borderColor: '#34C759',
    backgroundColor: '#f0fff4',
  },
  skillTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  skillDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  skillMeta: {
    fontSize: 14,
    color: '#007AFF',
  },
  requirement: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: 5,
  },
});
