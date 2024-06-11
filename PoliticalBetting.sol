// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PoliticalBetting {
    struct Bet {
        string question;
        uint256 closeDate;
        bool outcomeLogged;
        bool outcome;
        uint256 totalYes;
        uint256 totalNo;
        mapping(address => uint256) yesBets;
        mapping(address => uint256) noBets;
    }

    Bet[] public bets;
    address public owner;
    uint256 public platformFee = 15;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createBet(string memory _question, uint256 _closeDate) public {
        require(_closeDate > block.timestamp, "Close date must be in the future");
        bets.push();
        Bet storage newBet = bets[bets.length - 1];
        newBet.question = _question;
        newBet.closeDate = _closeDate;
    }

    function placeBet(uint256 _betIndex, bool _yes) public payable {
        Bet storage bet = bets[_betIndex];
        require(block.timestamp < bet.closeDate, "Betting is closed for this event");
        require(msg.value > 0, "Bet amount must be greater than zero");

        if (_yes) {
            bet.yesBets[msg.sender] += msg.value;
            bet.totalYes += msg.value;
        } else {
            bet.noBets[msg.sender] += msg.value;
            bet.totalNo += msg.value;
        }
    }

    function logOutcome(uint256 _betIndex, bool _outcome) public onlyOwner {
        Bet storage bet = bets[_betIndex];
        require(block.timestamp > bet.closeDate, "Betting is still open for this event");
        require(!bet.outcomeLogged, "Outcome has already been logged");

        bet.outcomeLogged = true;
        bet.outcome = _outcome;
    }

    function claimWinnings(uint256 _betIndex) public {
        Bet storage bet = bets[_betIndex];
        require(bet.outcomeLogged, "Outcome has not been logged yet");
        
        uint256 winnings = 0;
        uint256 totalPool = bet.totalYes + bet.totalNo;
        uint256 platformCut = (totalPool * platformFee) / 100;
        uint256 distributionPool = totalPool - platformCut;

        if (bet.outcome) {
            require(bet.yesBets[msg.sender] > 0, "You did not win this bet");
            winnings = (distributionPool * bet.yesBets[msg.sender]) / bet.totalYes;
        } else {
            require(bet.noBets[msg.sender] > 0, "You did not win this bet");
            winnings = (distributionPool * bet.noBets[msg.sender]) / bet.totalNo;
        }

        if (winnings > 0) {
            bet.yesBets[msg.sender] = 0;
            bet.noBets[msg.sender] = 0;
            payable(msg.sender).transfer(winnings);
        }
    }
}
