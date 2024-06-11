import React, { useState } from 'react';

const ClaimWinnings = ({ contract }) => {
  const [betIndex, setBetIndex] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.claimWinnings(betIndex);
      await tx.wait();
      setBetIndex('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Bet Index:</label>
        <input type="number" value={betIndex} onChange={(e) => setBetIndex(e.target.value)} required />
      </div>
      <button type="submit">Claim Winnings</button>
    </form>
  );
};

export default ClaimWinnings;
