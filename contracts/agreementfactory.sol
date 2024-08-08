// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "./Freelance.sol";
contract ContractFactory {
    address public owner;

    event ContractDeployed(address contractAddress, address client, address freelancer, uint256 amount, string terms, uint256 deadline);

    constructor() {
        owner = msg.sender;
    }

    function deployContract(
        address _freelancer,
        address _client,
        uint256 _amount,
        string memory _terms,
        uint256 _deadline
    ) external payable {
        require(msg.sender == _client, "Only the client can deploy the contract.");
        require(msg.value == _amount, "Escrow amount must be sent with the deployment.");

        FreelanceContract newContract = (new FreelanceContract){value: msg.value}(
            _freelancer,
            _client,
            _amount,
            _terms,
            _deadline
        );

        emit ContractDeployed(address(newContract), _client, _freelancer, _amount, _terms, _deadline);
    }
}
