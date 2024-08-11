// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { IEntropyConsumer } from "./IEntropyConsumer.sol";
import { IEntropy } from "./IEntropy.sol";

contract FreelanceContract is IEntropyConsumer {
    address public freelancer;
    address public client;
    uint256 public amount;
    string public terms;
    uint256 public deadline;
    address[] public arbitrators;
    mapping(address => bytes32[]) public arbitratorAttestations;
    bool public isDisputed;
    bool public isResolved;
    IEntropy entropy;
    address provider;
    uint64 entropySequenceNumber;

    enum ContractState { Ongoing, Disputed, Resolved }
    ContractState public state;

    event WorkCompleted(address indexed client);
    event DisputeRaised(address indexed by);
    event DisputeResolved(address indexed by, bool inFavorOfClient);
    event ArbitratorsSelected(address indexed arbitrator1, address indexed arbitrator2);

    constructor(
        address _freelancer,
        address _client,
        uint256 _amount,
        string memory _terms,
        uint256 _deadline,
        address _entropyAddress
    ) payable {
        freelancer = _freelancer;
        client = _client;
        amount = _amount;
        terms = _terms;
        deadline = _deadline;
        state = ContractState.Ongoing;
        entropy = IEntropy(_entropyAddress);
        provider = entropy.getDefaultProvider();
    }

    modifier onlyClient() {
        require(msg.sender == client, "Only the client can perform this action.");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only the freelancer can perform this action.");
        _;
    }

    modifier onlyArbitrator() {
        require(isArbitrator(msg.sender), "Only assigned arbitrators can perform this action.");
        _;
    }

    function markWorkCompleted() external onlyClient {
        require(state == ContractState.Ongoing, "Contract is not in an active state.");
        state = ContractState.Resolved;
        isResolved = true;
        payable(freelancer).transfer(amount);
        emit WorkCompleted(client);
    }

    function raiseDispute(address[] memory potentialArbitrators) external {
        require(msg.sender == client || msg.sender == freelancer, "Only the client or freelancer can raise a dispute.");
        require(state == ContractState.Ongoing, "Contract is not in an active state.");
        require(potentialArbitrators.length > 1, "At least two arbitrators required.");

        state = ContractState.Disputed;
        isDisputed = true;

        requestRandomArbitrators(potentialArbitrators);
        emit DisputeRaised(msg.sender);
    }

    function isArbitrator(address _address) public view returns (bool) {
        for (uint256 i = 0; i < arbitrators.length; i++) {
            if (arbitrators[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function attestToDispute(bytes32 attestationUID, bool inFavorOfClient) external onlyArbitrator {
        require(state == ContractState.Disputed, "Contract is not in a disputed state.");
        
        // Ensure the arbitrator has not attested more than once
        require(arbitratorAttestations[msg.sender].length < 1, "Arbitrator has already attested.");

        arbitratorAttestations[msg.sender].push(attestationUID);

        if (inFavorOfClient) {
            state = ContractState.Resolved;
            isResolved = true;
            payable(client).transfer(amount);
            emit DisputeResolved(msg.sender, true);
        } else {
            state = ContractState.Resolved;
            isResolved = true;
            payable(freelancer).transfer(amount);
            emit DisputeResolved(msg.sender, false);
        }
    }

    function requestRandomArbitrators(address[] memory potentialArbitrators) internal {
        uint fee = entropy.getFee(provider);
        bytes32 randomSeed = keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender));
        entropySequenceNumber = entropy.requestWithCallback{value: fee}(provider, randomSeed);
        // Store the potential arbitrators to use them in the callback
        entropyCallbackData[entropySequenceNumber] = potentialArbitrators;
    }

    mapping(uint64 => address[]) entropyCallbackData;

    // Implementing the IEntropyConsumer interface

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address _provider,
        bytes32 randomNumber
    ) internal override {
        require(sequenceNumber == entropySequenceNumber, "Invalid sequence number");

        address[] memory potentialArbitrators = entropyCallbackData[sequenceNumber];
        delete entropyCallbackData[sequenceNumber];

        uint256 randomIndex1 = uint256(randomNumber) % potentialArbitrators.length;
        uint256 randomIndex2 = (uint256(randomNumber) >> 128) % potentialArbitrators.length;

        // Ensure two different arbitrators are selected
        if (randomIndex1 == randomIndex2) {
            randomIndex2 = (randomIndex2 + 1) % potentialArbitrators.length;
        }

        address selectedArbitrator1 = potentialArbitrators[randomIndex1];
        address selectedArbitrator2 = potentialArbitrators[randomIndex2];

        // Clear the existing arbitrators array and add the selected ones
        delete arbitrators;
        arbitrators.push(selectedArbitrator1);
        arbitrators.push(selectedArbitrator2);

        emit ArbitratorsSelected(selectedArbitrator1, selectedArbitrator2);
    }
}

