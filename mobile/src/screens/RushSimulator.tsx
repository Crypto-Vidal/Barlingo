import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Order } from '../types';

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
    } else if (timeRemaining === 0 && isActive) {
      handleTimeOut();
    }
  }, [timeRemaining, isActive]);

  const startSimulation = () => {
    generateOrders();
    setScore(0);
    setIsActive(true);
  };

  const generateOrders = () => {
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
    // Move to next order or end
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
    // Save score and show results
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rush Hour Simulator</Text>
        {isActive && (
          <View style={styles.stats}>
            <Text style={styles.score}>Score: {score}</Text>
            <Text style={[styles.timer, timeRemaining < 30 && styles.timerLow]}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        )}
      </View>

      {!isActive && !currentOrder && (
        <View style={styles.startScreen}>
          <Text style={styles.instruction}>
            Complete orders as quickly as possible!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startSimulation}>
            <Text style={styles.startButtonText}>Start Rush</Text>
          </TouchableOpacity>
        </View>
      )}

      {isActive && currentOrder && (
        <View style={styles.gameArea}>
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>Order #{currentOrder.id}</Text>
            <Text style={styles.difficulty}>Difficulty: {currentOrder.difficulty}</Text>

            <View style={styles.itemsList}>
              <Text style={styles.itemsTitle}>Items:</Text>
              {currentOrder.items.map((item, index) => (
                <Text key={index} style={styles.item}>• {item}</Text>
              ))}
            </View>

            <Text style={styles.total}>Total: ${currentOrder.totalPrice}</Text>
          </View>

          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteOrder}>
            <Text style={styles.completeButtonText}>Complete Order</Text>
          </TouchableOpacity>

          <View style={styles.queue}>
            <Text style={styles.queueTitle}>Waiting Orders: {orders.length - orders.indexOf(currentOrder) - 1}</Text>
          </View>
        </View>
      )}

      {!isActive && currentOrder === null && orders.length > 0 && (
        <View style={styles.resultsScreen}>
          <Text style={styles.resultsTitle}>Rush Complete!</Text>
          <Text style={styles.finalScore}>Final Score: {score}</Text>
          <TouchableOpacity style={styles.playAgainButton} onPress={startSimulation}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  score: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  timer: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  timerLow: {
    color: '#FF3B30',
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  difficulty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  itemsList: {
    marginBottom: 15,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  item: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  completeButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  queue: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  queueTitle: {
    fontSize: 16,
    color: '#666',
  },
  resultsScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 24,
    color: '#007AFF',
    marginBottom: 40,
  },
  playAgainButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
