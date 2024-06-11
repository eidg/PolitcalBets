import React from 'react';

const BetList = ({ bets }) => {
  return (
    <div>
      <h2>Available Bets</h2>
      <ul>
        {bets.map((bet, index) => (
          <li key={index}>
            {bet.question} - Closes on: {new Date(bet.closeDate * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BetList;
