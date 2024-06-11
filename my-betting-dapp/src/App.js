import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BetForm from './components/BetForm';
import BetList from './components/BetList';
import PlaceBet from './components/PlaceBet';
import ClaimWinnings from './components/ClaimWinnings';
import PoliticalBetting from './artifacts/contracts/PoliticalBetting.sol/PoliticalBetting.json';
import './App.css';

const betContractAddress = 'YOUR_CONTRACT_ADDRESS';

function App() {
  const [bets, setBets] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        const _signer = _provider.getSigner();
        const _contract = new ethers.Contract(betContractAddress, PoliticalBetting.abi, _signer);
        
        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
      }
    };

    loadProvider();
  }, []);

  const fetchBets = async () => {
    const betsCount = await contract.betsCount();
    let _bets = [];
    for (let i = 0; i < betsCount; i++) {
      const bet = await contract.bets(i);
      _bets.push(bet);
    }
    setBets(_bets);
  };

  useEffect(() => {
    if (contract) {
      fetchBets();
    }
  }, [contract]);

  return (
    <div className="App">
      <h1>Political Betting DApp</h1>
      <BetForm contract={contract} fetchBets={fetchBets} />
      <BetList bets={bets} />
      <PlaceBet contract={contract} fetchBets={fetchBets} />
      <ClaimWinnings contract={contract} />
    </div>
  );
}

export default App;
