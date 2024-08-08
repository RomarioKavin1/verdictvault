"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useUser } from "@account-kit/react";
import { freelanceContractABI } from "@/utils/abi";

const FreelanceContractPage = () => {
  const user = useUser();
  const contractAddress = "0x072A5f0b0e0afba093542108Df4E5A5D9Cf20654";
  const [contract, setContract] = useState<any>(null);
  const [contractState, setContractState] = useState<string>("");
  const [arbitrators, setArbitrators] = useState<string[]>([]);
  const [attestationUID, setAttestationUID] = useState<string>("");
  const [inFavorOfClient, setInFavorOfClient] = useState<boolean>(false);

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (window.ethereum) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const contractInstance = new ethers.Contract(
          contractAddress,
          freelanceContractABI,
          ethersProvider
        );
        setContract(contractInstance);

        const freelancer = await contractInstance.freelancer();
        const client = await contractInstance.client();
        const amount = ethers.formatEther(await contractInstance.amount());
        const terms = await contractInstance.terms();
        const deadline = await contractInstance.deadline();
        const state = await contractInstance.state();

        setContractState(getReadableState(state));
        setContract({ freelancer, client, amount, terms, deadline });
      }
    };

    fetchContractDetails();
  }, [contractAddress]);

  const getReadableState = (state: number) => {
    switch (state) {
      case 0:
        return "Ongoing";
      case 1:
        return "Disputed";
      case 2:
        return "Resolved";
      default:
        return "Unknown";
    }
  };

  const markWorkCompleted = async () => {
    if (contract && user?.address === contract.client) {
      const tx = await contract.markWorkCompleted();
      await tx.wait();
      setContractState("Resolved");
    }
  };

  const raiseDispute = async () => {
    if (
      contract &&
      (user?.address === contract.client ||
        user?.address === contract.freelancer)
    ) {
      const tx = await contract.raiseDispute(arbitrators);
      await tx.wait();
      setContractState("Disputed");
    }
  };

  const attestToDispute = async () => {
    if (contract && contract.isArbitrator(user?.address)) {
      const tx = await contract.attestToDispute(
        attestationUID,
        inFavorOfClient
      );
      await tx.wait();
      setContractState("Resolved");
    }
  };

  return (
    <div>
      <h2>Freelance Contract Details</h2>
      {contract ? (
        <div>
          <p>Freelancer: {contract.freelancer}</p>
          <p>Client: {contract.client}</p>
          <p>Amount: {contract.amount} ETH</p>
          <p>Terms: {contract.terms}</p>
          <p>
            Deadline:{" "}
            {new Date(Number(contract.deadline) * 1000).toLocaleString()}
          </p>

          <p>State: {contractState}</p>

          {user?.address === contract.client && contractState === "Ongoing" && (
            <button onClick={markWorkCompleted}>Mark Work Completed</button>
          )}

          {(user?.address === contract.client ||
            user?.address === contract.freelancer) &&
            contractState === "Ongoing" && (
              <div>
                <h3>Raise Dispute</h3>
                <input
                  className="text-black"
                  type="text"
                  placeholder="Arbitrator 1 Address"
                  onChange={(e) =>
                    setArbitrators([e.target.value, ...arbitrators])
                  }
                />
                <input
                  className="text-black"
                  type="text"
                  placeholder="Arbitrator 2 Address"
                  onChange={(e) =>
                    setArbitrators([e.target.value, ...arbitrators])
                  }
                />
                <button onClick={raiseDispute}>Raise Dispute</button>
              </div>
            )}

          {contractState === "Disputed" &&
            contract.isArbitrator(user?.address) && (
              <div>
                <h3>Attest to Dispute</h3>
                <input
                  className="text-black"
                  type="text"
                  placeholder="Attestation UID"
                  value={attestationUID}
                  onChange={(e) => setAttestationUID(e.target.value)}
                />
                <div>
                  <label>
                    <input
                      type="radio"
                      value="client"
                      checked={inFavorOfClient}
                      onChange={() => setInFavorOfClient(true)}
                    />
                    In Favor of Client
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="freelancer"
                      checked={!inFavorOfClient}
                      onChange={() => setInFavorOfClient(false)}
                    />
                    In Favor of Freelancer
                  </label>
                </div>
                <button onClick={attestToDispute}>Submit Attestation</button>
              </div>
            )}
        </div>
      ) : (
        <p>Loading contract details...</p>
      )}
    </div>
  );
};

export default FreelanceContractPage;
