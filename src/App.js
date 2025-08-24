// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Card component
const Card = ({ value, suit, isSelected, onClick, isDraggable }) => {
  const getSuitSymbol = (suit) => {
    switch(suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getCardColor = (suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  const getDisplayValue = (value) => {
    if (value === 1) return 'A';
    if (value >= 2 && value <= 10) return value;
    if (value === 11) return 'J';
    if (value === 12) return 'Q';
    if (value === 13) return 'K';
    return '';
  };

  return (
    <div 
      className={`card ${isSelected ? 'selected' : ''} ${isDraggable ? 'draggable' : ''}`}
      onClick={onClick}
      data-value={value}
      data-suit={suit}
    >
      <div className="card-inner">
        <div className="card-top">
          <span className={`card-value ${getCardColor(suit)}`}>{getDisplayValue(value)}</span>
          <span className={`card-suit ${getCardColor(suit)}`}>{getSuitSymbol(suit)}</span>
        </div>
        <div className="card-center">
          <span className={`card-suit-large ${getCardColor(suit)}`}>{getSuitSymbol(suit)}</span>
        </div>
        <div className="card-bottom">
          <span className={`card-value ${getCardColor(suit)}`}>{getDisplayValue(value)}</span>
          <span className={`card-suit ${getCardColor(suit)}`}>{getSuitSymbol(suit)}</span>
        </div>
      </div>
    </div>
  );
};

// Deck component
const Deck = ({ cards, onDrawCard }) => {
  return (
    <div className="deck" onClick={onDrawCard}>
      <div className="deck-cards">
        {cards > 0 && <div className="deck-card back"></div>}
        {cards > 1 && <div className="deck-card back"></div>}
        {cards > 2 && <div className="deck-card back"></div>}
      </div>
      <div className="deck-count">{cards} cards</div>
    </div>
  );
};

// Discard pile component
const DiscardPile = ({ topCard, onClick }) => {
  if (!topCard) {
    return <div className="discard-pile empty" onClick={onClick}></div>;
  }

  return (
    <div className="discard-pile" onClick={onClick}>
      <Card value={topCard.value} suit={topCard.suit} />
    </div>
  );
};

// Player hand component
const PlayerHand = ({ cards, onSelectCard, selectedCards }) => {
  return (
    <div className="player-hand">
      {cards.map((card, index) => (
        <Card
          key={`${card.value}-${card.suit}-${index}`}
          value={card.value}
          suit={card.suit}
          isSelected={selectedCards.includes(index)}
          onClick={() => onSelectCard(index)}
          isDraggable={true}
        />
      ))}
    </div>
  );
};

// Meld area component
const MeldArea = ({ melds, onSelectMeldCard }) => {
  return (
    <div className="meld-area">
      <h3>Melds</h3>
      {melds.length === 0 ? (
        <div className="no-melds">No melds yet. Create sets or sequences!</div>
      ) : (
        melds.map((meld, meldIndex) => (
          <div key={meldIndex} className="meld">
            {meld.cards.map((card, cardIndex) => (
              <Card
                key={`meld-${meldIndex}-card-${cardIndex}`}
                value={card.value}
                suit={card.suit}
                onClick={() => onSelectMeldCard(meldIndex, cardIndex)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

// Main App component
function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [melds, setMelds] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [gameStatus, setGameStatus] = useState('ready');
  const [score, setScore] = useState(0);

  // Initialize deck
  useEffect(() => {
    initializeDeck();
  }, []);

  const initializeDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = Array.from({ length: 13 }, (_, i) => i + 1);
    
    const newDeck = [];
    suits.forEach(suit => {
      values.forEach(value => {
        newDeck.push({ value, suit });
      });
    });
    
    // Shuffle the deck
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    
    setDeck(newDeck);
    setDiscardPile([]);
    setMelds([]);
    setSelectedCards([]);
    setGameStatus('ready');
    setScore(0);
  };

  const startGame = () => {
    if (deck.length < 13) {
      alert("Not enough cards to start the game!");
      return;
    }
    
    const newPlayerHand = deck.slice(0, 13);
    const newDeck = deck.slice(13);
    
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    setGameStatus('playing');
  };

  const drawCard = () => {
    if (deck.length === 0) {
      alert("No cards left in the deck!");
      return;
    }
    
    const newDeck = [...deck];
    const drawnCard = newDeck.pop();
    
    setDeck(newDeck);
    setPlayerHand([...playerHand, drawnCard]);
  };

  const drawFromDiscard = () => {
    if (discardPile.length === 0) {
      alert("No cards in the discard pile!");
      return;
    }
    
    const newDiscardPile = [...discardPile];
    const drawnCard = newDiscardPile.pop();
    
    setDiscardPile(newDiscardPile);
    setPlayerHand([...playerHand, drawnCard]);
  };

  const discardCard = () => {
    if (selectedCards.length !== 1) {
      alert("Please select exactly one card to discard");
      return;
    }
    
    const selectedIndex = selectedCards[0];
    const cardToDiscard = playerHand[selectedIndex];
    
    const newPlayerHand = playerHand.filter((_, index) => index !== selectedIndex);
    setPlayerHand(newPlayerHand);
    setDiscardPile([...discardPile, cardToDiscard]);
    setSelectedCards([]);
  };

  const selectCard = (index) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter(i => i !== index));
    } else {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const createMeld = () => {
    if (selectedCards.length < 3) {
      alert("You need at least 3 cards to create a meld");
      return;
    }
    
    const selectedCardsData = selectedCards.map(index => playerHand[index]);
    
    // Check if selected cards form a valid set (same value, different suits)
    const isSet = selectedCardsData.every(card => 
      card.value === selectedCardsData[0].value
    );
    
    // Check if selected cards form a valid sequence (same suit, consecutive values)
    const sortedCards = [...selectedCardsData].sort((a, b) => a.value - b.value);
    let isSequence = true;
    for (let i = 1; i < sortedCards.length; i++) {
      if (sortedCards[i].value !== sortedCards[i-1].value + 1 || 
          sortedCards[i].suit !== sortedCards[0].suit) {
        isSequence = false;
        break;
      }
    }
    
    if (!isSet && !isSequence) {
      alert("Selected cards don't form a valid set or sequence");
      return;
    }
    
    // Remove selected cards from hand and add to melds
    const newPlayerHand = playerHand.filter((_, index) => !selectedCards.includes(index));
    setPlayerHand(newPlayerHand);
    setMelds([...melds, { cards: selectedCardsData, type: isSet ? 'set' : 'sequence' }]);
    setSelectedCards([]);
    
    // Update score
    const meldScore = selectedCardsData.reduce((sum, card) => {
      if (card.value >= 10) return sum + 10; // Face cards are worth 10
      return sum + card.value;
    }, 0);
    setScore(score + meldScore);
  };

  const declareWin = () => {
    if (playerHand.length > 0) {
      alert("You still have cards in your hand!");
      return;
    }
    
    setGameStatus('won');
    alert(`Congratulations! You won with ${score} points!`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Rummy Circle</h1>
        <div className="score">Score: {score}</div>
        <div className="controls">
          {gameStatus === 'ready' && (
            <button className="btn btn-primary" onClick={startGame}>Start Game</button>
          )}
          {gameStatus === 'playing' && (
            <>
              <button className="btn btn-secondary" onClick={drawCard}>Draw Card</button>
              <button className="btn btn-danger" onClick={discardCard} disabled={selectedCards.length !== 1}>
                Discard
              </button>
              <button className="btn btn-success" onClick={createMeld} disabled={selectedCards.length < 3}>
                Create Meld
              </button>
              <button className="btn btn-warning" onClick={declareWin}>Declare Win</button>
            </>
          )}
          <button className="btn btn-info" onClick={initializeDeck}>New Game</button>
        </div>
      </header>

      <main className="game-area">
        <div className="table-center">
          <Deck cards={deck.length} onDrawCard={drawCard} />
          <DiscardPile topCard={discardPile[discardPile.length - 1]} onClick={drawFromDiscard} />
        </div>

        <MeldArea melds={melds} />

        <PlayerHand 
          cards={playerHand} 
          onSelectCard={selectCard}
          selectedCards={selectedCards}
        />
      </main>

      {gameStatus === 'won' && (
        <div className="win-overlay">
          <div className="win-message">
            <h2>Congratulations! You Won!</h2>
            <p>Your score: {score} points</p>
            <button className="btn btn-primary" onClick={initializeDeck}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;