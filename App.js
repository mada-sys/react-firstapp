import { useState } from 'react';
import './App.css'; // Asigură-te că fișierul CSS este importat!

function Square({ value, onSquareClick }) {
  // Adăugăm data-value pentru a permite CSS-ului să coloreze X și O
  return (
    <button className="square" onClick={onSquareClick} data-value={value}>
      {value}
    </button>
  );
}

// Funcția Board primește acum o nouă prop: onWinner, pentru a comunica starea jocului
function Board({ xIsNext, squares, onPlay, onWinner }) { 
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(sq => sq); 
  
  let status;
  let statusClass = "status"; 

  if (winner) {
    // Mesaj de câștig cu iconițe festive (Artificii & Cash)
    status = `FELICITĂRI! Câștigător: ${winner} 🎉💰💸`; 
    statusClass += ' status-winner'; 
    onWinner(true); // Activează artificiile la câștig
  } else if (isDraw) {
    // Mesaj simpatic de remiză
    status = 'Remiză! Egalitate ca-n povești. 🤝';
    statusClass += ' status-draw'; 
    onWinner(false); // Dezactivează artificiile la remiză
  } else {
    status = 'Urmează: ' + (xIsNext ? 'X' : 'O');
    onWinner(false); // Dezactivează artificiile în timpul jocului
  }

  return (
    <>
      <div className={statusClass}>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false); // Noua stare pentru controlul artificiilor
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
    // Dacă se face o nouă mutare, asigură-te că artificiile dispar
    setShowFireworks(false);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // Dacă se sare la o mutare anterioară, dezactivează artificiile
    setShowFireworks(false);
  }

  // Funcție de callback trimisă către Board pentru a actualiza starea showFireworks
  const handleWinnerUpdate = (isWinner) => {
      // Setează starea artificiilor bazat pe dacă a fost sau nu un câștigător
      setShowFireworks(isWinner);
  };

  const moves = history.map((squares, move) => {
    let description;
    // O mică îmbunătățire: arată mutarea curentă fără buton
    if (move === currentMove) {
        description = 'Ești la mutarea #' + move;
        return (
            <li key={move}>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>{description}</span>
            </li>
        );
    } else if (move > 0) {
      description = 'Mergi la mutarea #' + move;
    } else {
      description = 'Începutul jocului';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    // Aplică clasa 'fireworks-active' containerului principal când e câștigător
    <div className={`game ${showFireworks ? 'fireworks-active' : ''}`}> 
      <div className="game-board">
        {/* Trimite funcția de callback onWinner către Board */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onWinner={handleWinnerUpdate} />
      </div>
      <div className="game-info">
        <h3>Istoric Mutări</h3>
        <ol>{moves}</ol>
      </div>
      {/* Containerul pentru artificiile CSS spectaculoase! */}
      {showFireworks && <div className="fireworks-container"></div>}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}