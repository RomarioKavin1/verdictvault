// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract EscrowContract {
    enum State { Created, Attested, Disputed, Resolved }
    enum DisputeDecision { None, ClientWins, FreelancerWins }

    struct Contract {
        address client;
        address freelancer;
        uint256 amount;
        string terms;
        uint256 deadline;
        address[] arbitrators;
        State state;
        address attestor;
        uint256 attestationUID;
        DisputeDecision disputeDecision;
    }

    mapping(uint256 => Contract) public contracts;
    uint256 public contractCount;
    
    // Events
    event ContractCreated(uint256 contractId, address client, address freelancer, uint256 amount, string terms, uint256 deadline);
    event ContractAttested(uint256 contractId, address freelancer, uint256 attestationUID);
    event DisputeRaised(uint256 contractId);
    event DisputeResolved(uint256 contractId, DisputeDecision decision);
    
    // Modifiers
    modifier onlyClient(uint256 contractId) {
        require(msg.sender == contracts[contractId].client, "Not the client");
        _;
    }

    modifier onlyFreelancer(uint256 contractId) {
        require(msg.sender == contracts[contractId].freelancer, "Not the freelancer");
        _;
    }

    modifier onlyArbitrator(uint256 contractId) {
        bool isArbitrator = false;
        for (uint i = 0; i < contracts[contractId].arbitrators.length; i++) {
            if (msg.sender == contracts[contractId].arbitrators[i]) {
                isArbitrator = true;
                break;
            }
        }
        require(isArbitrator, "Not an arbitrator");
        _;
    }

    // Create a new contract
    function createContract(address _freelancer, uint256 _amount, string calldata _terms, uint256 _deadline, address[] calldata _arbitrators) external payable {
        require(msg.value == _amount, "Incorrect escrow amount");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        
        contractCount++;
        contracts[contractCount] = Contract({
            client: msg.sender,
            freelancer: _freelancer,
            amount: _amount,
            terms: _terms,
            deadline: _deadline,
            arbitrators: _arbitrators,
            state: State.Created,
            attestor: address(0),
            attestationUID: 0,
            disputeDecision: DisputeDecision.None
        });

        emit ContractCreated(contractCount, msg.sender, _freelancer, _amount, _terms, _deadline);
    }

    // Freelancer attests the contract
    function attestContract(uint256 contractId, uint256 attestationUID) external onlyFreelancer(contractId) {
        Contract storage _contract = contracts[contractId];
        require(_contract.state == State.Created, "Contract not in attestation stage");
        
        _contract.attestor = msg.sender;
        _contract.attestationUID = attestationUID;
        _contract.state = State.Attested;

        emit ContractAttested(contractId, msg.sender, attestationUID);
    }

    // Raise a dispute
    function raiseDispute(uint256 contractId) external {
        Contract storage _contract = contracts[contractId];
        require(msg.sender == _contract.client || msg.sender == _contract.freelancer, "Not a participant");
        require(_contract.state == State.Attested, "Contract not attested");
        
        _contract.state = State.Disputed;

        emit DisputeRaised(contractId);
    }

    // Arbitrator resolves the dispute
    function resolveDispute(uint256 contractId, DisputeDecision decision) external onlyArbitrator(contractId) {
        Contract storage _contract = contracts[contractId];
        require(_contract.state == State.Disputed, "No dispute to resolve");
        
        _contract.state = State.Resolved;
        _contract.disputeDecision = decision;

        if (decision == DisputeDecision.ClientWins) {
            payable(_contract.client).transfer(_contract.amount);
        } else if (decision == DisputeDecision.FreelancerWins) {
            payable(_contract.freelancer).transfer(_contract.amount);
        }

        emit DisputeResolved(contractId, decision);
    }
}
