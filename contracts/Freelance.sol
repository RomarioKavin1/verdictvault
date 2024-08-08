// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract FreelanceContract {
    address public freelancer;
    address public client;
    uint256 public amount;
    string public terms;
    uint256 public deadline;
    address[] public arbitrators;
    mapping(address => bytes32) public arbitratorAttestations;
    bool public isDisputed;
    bool public isResolved;

    enum ContractState { Ongoing, Disputed, Resolved }
    ContractState public state;

    event WorkCompleted(address indexed client);
    event DisputeRaised(address indexed by);
    event DisputeResolved(address indexed by, bool inFavorOfClient);

    constructor(
        address _freelancer,
        address _client,
        uint256 _amount,
        string memory _terms,
        uint256 _deadline
    ) payable {
        freelancer = _freelancer;
        client = _client;
        amount = _amount;
        terms = _terms;
        deadline = _deadline;
        state = ContractState.Ongoing;
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

    function raiseDispute(address[] memory _arbitrators) external {
        require(msg.sender == client || msg.sender == freelancer, "Only the client or freelancer can raise a dispute.");
        require(state == ContractState.Ongoing, "Contract is not in an active state.");
        state = ContractState.Disputed;
        isDisputed = true;
        arbitrators = _arbitrators;
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
        require(arbitratorAttestations[msg.sender] == bytes32(0), "Arbitrator has already attested.");
        
        arbitratorAttestations[msg.sender] = attestationUID;

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
}
