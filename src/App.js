// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, in-progress, crashed
  const [history, setHistory] = useState([]);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const startGame = () => {
    if (balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    setGameStatus('in-progress');
    setBalance(prev => prev - betAmount);
    
    // Generate a random crash point between 1.1x and 10x
    const crashPoint = (Math.random() * 9 + 1.1).toFixed(2);
    
    let current = 1.0;
    const interval = setInterval(() => {
      current += 0.01 * animationSpeed;
      setCurrentMultiplier(parseFloat(current.toFixed(2)));
      
      if (current >= crashPoint) {
        clearInterval(interval);
        setGameStatus('crashed');
        setHistory(prev => [crashPoint, ...prev.slice(0, 9)]);
      }
    }, 100);
  };

  const cashOut = () => {
    if (gameStatus !== 'in-progress') return;
    
    const winnings = betAmount * currentMultiplier;
    setBalance(prev => prev + winnings);
    setGameStatus('crashed');
    setHistory(prev => [`C@${currentMultiplier.toFixed(2)}x`, ...prev.slice(0, 9)]);
  };

  const resetGame = () => {
    setGameStatus('waiting');
    setCurrentMultiplier(1.0);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Aviatar</h1>
        <div className="balance">Balance: ${balance}</div>
      </header>

      <main className="game-container">
        <div className="game-main">
          <div className="multiplier-display">
            <div className={`multiplier-value ${gameStatus === 'in-progress' ? 'active' : ''}`}>
              {currentMultiplier.toFixed(2)}x
            </div>
            <div className="multiplier-label">
              {gameStatus === 'waiting' && 'Place your bet to start'}
              {gameStatus === 'in-progress' && 'Multiplier is increasing...'}
              {gameStatus === 'crashed' && 'Game over! Place a new bet'}
            </div>
          </div>

          <div className="control-panel">
            {gameStatus !== 'in-progress' ? (
              <button className="bet-button" onClick={startGame}>
                Place Bet: ${betAmount}
              </button>
            ) : (
              <button className="cashout-button" onClick={cashOut}>
                Cash Out: ${(betAmount * currentMultiplier).toFixed(2)}
              </button>
            )}
          </div>

          <div className="bet-controls">
            <div className="bet-amount">
              <label>Bet Amount:</label>
              <input 
                type="range" 
                min="10" 
                max="500" 
                step="10"
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value))}
                disabled={gameStatus === 'in-progress'}
              />
              <span>${betAmount}</span>
            </div>
            
            <div className="speed-control">
              <label>Speed:</label>
              <select 
                value={animationSpeed} 
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                disabled={gameStatus === 'in-progress'}
              >
                <option value={0.5}>Slow</option>
                <option value={1}>Normal</option>
                <option value={2}>Fast</option>
              </select>
            </div>
          </div>
        </div>

        <div className="game-sidebar">
          <div className="history-card">
            <h3>Recent Multipliers</h3>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="empty-history">No games played yet</div>
              ) : (
                history.map((item, index) => (
                  <div 
                    key={index} 
                    className={`history-item ${typeof item === 'string' && item.startsWith('C@') ? 'cashed-out' : ''}`}
                  >
                    {typeof item === 'string' && item.startsWith('C@') 
                      ? `Cashed out at ${item.substring(2)}` 
                      : `Crashed at ${item}x`
                    }
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="stats-card">
            <h3>Game Stats</h3>
            <div className="stat">
              <span>Current Balance:</span>
              <span>${balance}</span>
            </div>
            <div className="stat">
              <span>Total Bets:</span>
              <span>{history.length}</span>
            </div>
            <div className="stat">
              <span>Biggest Win:</span>
              <span>
                {history.length > 0 
                  ? Math.max(...history.map(item => 
                      typeof item === 'string' ? parseFloat(item.substring(2)) : parseFloat(item)
                    ).filter(val => !isNaN(val))).toFixed(2) + 'x' 
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;