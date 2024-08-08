"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import {
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@account-kit/react";
import { factoryabi } from "@/utils/abi";

const factoryContractAddress = "0x73a9b390e02e842879Da557b801fF4135d194307";

const MyComponent = () => {
  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });

  const [freelancerAddress, setFreelancerAddress] = useState<string>("");
  const [clientAddress, setClientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [terms, setTerms] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [createdContractAddress, setCreatedContractAddress] = useState<
    string | null
  >(null);

  const user = useUser();
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    waitForTxn: true,
    onSuccess: ({ hash }: { hash: string }) => {
      console.log("Transaction hash:", hash);
    },
    onError: (error: any) => {
      console.error("Error sending user operation:", error);
    },
  });

  const deployContract = async () => {
    try {
      // Validate inputs
      if (
        !ethers.isAddress(freelancerAddress) ||
        !ethers.isAddress(clientAddress)
      ) {
        throw new Error("Invalid address format");
      }

      // Convert amount to wei and deadline to number
      const amountInWei = ethers.parseEther(amount);
      const deadlineTimestamp = parseInt(deadline, 10);

      // Create an instance of the contract interface
      const factoryInterface = new ethers.Interface(factoryabi);
      // Encode the function call
      const data = factoryInterface.encodeFunctionData("deployContract", [
        freelancerAddress,
        clientAddress,
        amountInWei,
        terms,
        deadlineTimestamp,
      ]);

      // Prepare the transaction
      const tx = {
        to: factoryContractAddress,
        data,
        value: amountInWei, // The amount to send with the deployment
      };

      console.log("Transaction Data:", tx);

      // Send the transaction as a UserOperation
      const userOperation = {
        uo: {
          target: factoryContractAddress,
          data,
          value: amountInWei,
        },
      };
      sendUserOperation(userOperation);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  return (
    <div>
      {user ? (
        <p>
          Logged in as {user.email ?? "anon"} ({user.address})
        </p>
      ) : (
        <p>You are not logged in</p>
      )}

      <div>
        <label>
          Freelancer Address
          <input
            className="  text-black"
            type="text"
            value={freelancerAddress}
            onChange={(e) => setFreelancerAddress(e.target.value)}
            placeholder="0xD1a7297B88f470e5e57c5183cB6D43b59024465F"
          />
        </label>
      </div>
      <div>
        <label>
          Client Address
          <input
            className="  text-black"
            type="text"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
            placeholder="0x89c27f76EEF3e09D798FB06a66Dd461d7d21f111"
          />
        </label>
      </div>
      <div>
        <label>
          Amount (ETH)
          <input
            className="  text-black"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1"
          />
        </label>
      </div>
      <div>
        <label>
          Contract Terms
          <input
            className="  text-black"
            type="text"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="gucci gang"
          />
        </label>
      </div>
      <div>
        <label>
          Deadline (Unix Timestamp)
          <input
            className="  text-black"
            type="number"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="1725662400"
          />
        </label>
      </div>
      <button onClick={deployContract} disabled={isSendingUserOperation}>
        {isSendingUserOperation ? "Deploying..." : "Deploy Contract"}
      </button>
      {createdContractAddress && (
        <p>Deployed Contract Address: {createdContractAddress}</p>
      )}
    </div>
  );
};

export default MyComponent;
