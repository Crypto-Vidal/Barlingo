'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Onboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName,
        xp: 0,
        level: 1,
        streak: 0,
        createdAt: new Date(),
      });

      router.push('/skill-tree');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, marginTop: 100 }}>
      <div className="card">
        <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
          Welcome to Barlingo
        </h1>
        <p style={{ fontSize: 18, color: '#666', marginBottom: 40, textAlign: 'center' }}>
          Learn bartending skills
        </p>

        <form onSubmit={handleSignup}>
          <input
            className="input"
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
            Start Learning
          </button>
        </form>
      </div>
    </div>
  );
}
