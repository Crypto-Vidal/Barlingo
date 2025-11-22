'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/lib/types';

export default function RushSimulator() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isActive && currentOrder) {
      handleTimeOut();
    }
  }, [timeRemaining, isActive]);

  const startSimulation = () => {
    const sampleOrders: Order[] = [
      {
        id: '1',
        items: ['Mojito', 'Margarita', 'Old Fashioned'],
        totalPrice: 45,
        timeLimit: 120,
        difficulty: 'medium',
      },
      {
        id: '2',
        items: ['Cosmopolitan', 'Manhattan'],
        totalPrice: 30,
        timeLimit: 90,
        difficulty: 'easy',
      },
      {
        id: '3',
        items: ['Mai Tai', 'Long Island', 'Negroni', 'Aperol Spritz'],
        totalPrice: 60,
        timeLimit: 180,
        difficulty: 'hard',
      },
    ];

    setOrders(sampleOrders);
    setCurrentOrder(sampleOrders[0]);
    setTimeRemaining(sampleOrders[0].timeLimit);
    setScore(0);
    setIsActive(true);
  };

  const handleCompleteOrder = () => {
    if (!currentOrder) return;

    const timeBonus = Math.floor(timeRemaining / 10);
    const orderScore = currentOrder.totalPrice + timeBonus;
    setScore(score + orderScore);

    const nextIndex = orders.indexOf(currentOrder) + 1;
    if (nextIndex < orders.length) {
      setCurrentOrder(orders[nextIndex]);
      setTimeRemaining(orders[nextIndex].timeLimit);
    } else {
      endSimulation();
    }
  };

  const handleTimeOut = () => {
    const nextIndex = currentOrder ? orders.indexOf(currentOrder) + 1 : 0;
    if (nextIndex < orders.length) {
      setCurrentOrder(orders[nextIndex]);
      setTimeRemaining(orders[nextIndex].timeLimit);
    } else {
      endSimulation();
    }
  };

  const endSimulation = () => {
    setIsActive(false);
    setCurrentOrder(null);
  };

  return (
    <div className="container">
      <div style={{ padding: 20, background: '#007AFF', borderRadius: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>
          Rush Hour Simulator
        </h1>
        {isActive && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 18, color: 'white', fontWeight: 600 }}>Score: {score}</div>
            <div style={{
              fontSize: 20,
              color: timeRemaining < 30 ? '#FF3B30' : 'white',
              fontWeight: 'bold'
            }}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        )}
      </div>

      {!isActive && !currentOrder && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, marginBottom: 30, color: '#666' }}>
            Complete orders as quickly as possible!
          </p>
          <button className="btn btn-primary" onClick={startSimulation}>
            Start Rush
          </button>
        </div>
      )}

      {isActive && currentOrder && (
        <>
          <div className="card" style={{
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#007AFF',
            marginBottom: 20
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
              Order #{currentOrder.id}
            </h2>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 15, textTransform: 'capitalize' }}>
              Difficulty: {currentOrder.difficulty}
            </p>

            <div style={{ marginBottom: 15 }}>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Items:</p>
              {currentOrder.items.map((item, index) => (
                <p key={index} style={{ fontSize: 16, marginLeft: 10, marginBottom: 5 }}>
                  • {item}
                </p>
              ))}
            </div>

            <p style={{ fontSize: 18, fontWeight: 'bold', color: '#007AFF' }}>
              Total: ${currentOrder.totalPrice}
            </p>
          </div>

          <button className="btn btn-success" onClick={handleCompleteOrder} style={{ width: '100%' }}>
            Complete Order
          </button>

          <div className="card" style={{ marginTop: 20, background: '#f0f0f0' }}>
            <p style={{ fontSize: 16, color: '#666' }}>
              Waiting Orders: {orders.length - orders.indexOf(currentOrder) - 1}
            </p>
          </div>
        </>
      )}

      {!isActive && currentOrder === null && orders.length > 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>Rush Complete!</h2>
          <p style={{ fontSize: 24, color: '#007AFF', marginBottom: 40 }}>Final Score: {score}</p>
          <button className="btn btn-primary" onClick={startSimulation}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
