// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract FreelanceContract {
    address public client;
    address public freelancer;
    uint256 public amount;
    string public terms;
    uint256 public deadline;
    bool public fundsReleased;
    bool public inDispute;
    mapping(address => bytes32) public arbitratorAttestations;
    address[] public arbitrators;
    uint256 public arbitratorCount;

    event WorkCompleted();
    event DisputeRaised();
    event DisputeResolved(string resolution);

    modifier onlyClient() {
        require(msg.sender == client, "Only client can call this function");
        _;
    }

    modifier onlyFreelancerOrClient() {
        require(msg.sender == freelancer || msg.sender == client, "Only freelancer or client can call this function");
        _;
    }

    modifier onlyArbitrators() {
        require(inDispute, "Contract is not in dispute");
        bool isArbitrator = false;
        for (uint256 i = 0; i < arbitrators.length; i++) {
            if (msg.sender == arbitrators[i]) {
                isArbitrator = true;
                break;
            }
        }
        require(isArbitrator, "Only arbitrators can call this function");
        _;
    }

    constructor(
        address _client,
        address _freelancer,
        uint256 _amount,
        string memory _terms,
        uint256 _deadline,
        address[] memory _arbitrators
    ) payable {
        require(msg.value == _amount, "Insufficient amount sent");
        client = _client;
        freelancer = _freelancer;
        amount = _amount;
        terms = _terms;
        deadline = _deadline;
        arbitrators = _arbitrators;
        arbitratorCount = _arbitrators.length;
    }

    function workCompleted() external onlyClient {
        require(!fundsReleased, "Funds already released");
        require(!inDispute, "Contract is in dispute");
        fundsReleased = true;
        payable(freelancer).transfer(amount);
        emit WorkCompleted();
    }

    function raiseDispute() external onlyFreelancerOrClient {
        require(!inDispute, "Dispute already raised");
        inDispute = true;
        emit DisputeRaised();
    }

    function submitArbitration(bytes32 attestationUID) external onlyArbitrators {
        require(inDispute, "Contract is not in dispute");
        require(arbitratorAttestations[msg.sender] == 0, "Arbitrator has already submitted attestation");
        arbitratorAttestations[msg.sender] = attestationUID;
    }

    function resolveDispute(bool inFavorOfClient) external onlyArbitrators {
        require(inDispute, "Contract is not in dispute");

        uint256 attestationCount = 0;
        for (uint256 i = 0; i < arbitrators.length; i++) {
            if (arbitratorAttestations[arbitrators[i]] != 0) {
                attestationCount++;
            }
        }

        require(attestationCount >= (arbitratorCount / 2), "Not enough attestations");

        inDispute = false;

        if (inFavorOfClient) {
            payable(client).transfer(amount);
            emit DisputeResolved("Resolved in favor of client");
        } else {
            payable(freelancer).transfer(amount);
            emit DisputeResolved("Resolved in favor of freelancer");
        }
    }
}

contract FreelanceContractFactory {
    event ContractDeployed(address contractAddress);

    function createContract(
        address freelancer,
        uint256 amount,
        string memory terms,
        uint256 deadline,
        address[] memory arbitrators
    ) external payable {
        require(msg.value == amount, "Insufficient amount sent");

        FreelanceContract newContract = (new FreelanceContract){value: msg.value}(
            msg.sender,
            freelancer,
            amount,
            terms,
            deadline,
            arbitrators
        );
        emit ContractDeployed(address(newContract));
    }
}
