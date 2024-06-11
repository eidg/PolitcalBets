import React, { useState } from 'react';

const PlaceBet = ({ contract, fetchBets }) => {
  const [betIndex, setBetIndex] = useState('');
  const [yes, setYes] = useState(true);
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.placeBet(betIndex, yes, { value: ethers.utils.parseEther(amount) });
      await tx.wait();
      fetchBets();
      setBetIndex('');
      setYes(true);
      setAmount('');
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
      <div>
        <label>
          <input type="radio" value="yes" checked={yes} onChange={() => setYes(true)} /> Yes
        </label>
        <label>
          <input type="radio" value="no" checked={!yes} onChange={() => setYes(false)} /> No
        </label>
      </div>
      <div>
        <label>Amount (ETH):</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <button type="submit">Place Bet</button>
    </form>
  );
};

export default PlaceBet;
