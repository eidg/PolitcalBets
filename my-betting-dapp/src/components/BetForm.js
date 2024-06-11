import React, { useState } from 'react';

const BetForm = ({ contract, fetchBets }) => {
  const [question, setQuestion] = useState('');
  const [closeDate, setCloseDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.createBet(question, Math.floor(new Date(closeDate).getTime() / 1000));
      await tx.wait();
      fetchBets();
      setQuestion('');
      setCloseDate('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Question:</label>
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
      </div>
      <div>
        <label>Close Date:</label>
        <input type="datetime-local" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} required />
      </div>
      <button type="submit">Create Bet</button>
    </form>
  );
};

export default BetForm;
