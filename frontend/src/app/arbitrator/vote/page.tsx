"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useUser } from "@account-kit/react";
import { freelanceContractABI } from "@/utils/abi";
import Nav from "@/components/Nav";

const FreelanceContractPage = () => {
  const user = useUser();
  const contractAddress = "0x072A5f0b0e0afba093542108Df4E5A5D9Cf20654";
  const [contract, setContract] = useState<any>(null);
  const [contractState, setContractState] = useState<string>("");
  const [arbitrators, setArbitrators] = useState<string[]>([]);
  const [reason, setAttestationReason] = useState<string>("");
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
  const [attestationAmount, setAttestationAmount] = useState(50); // Default to 50%
  const getReadableState = (state: number) => {
    switch (state) {
      case 0:
        return "Ongoing 🟦";
      case 1:
        return "Disputed 🟥";
      case 2:
        return "Resolved 🟩";
      default:
        return "Under Progress 🟨";
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
    <div className="bg-white min-h-screen">
      <Nav selected={2} />
      <div className="flex flex-col text-black pt-10 px-56 items-center justify-center">
        <div className="flex items-center justify-center font-bold text-4xl border-b-2 pb-3">
          <p>Freelance Contract Details</p>
        </div>
        <div className="m-5 w-fit">
          {contract ? (
            <div className="bg-white shadow-sm ring-2 ring-slate-300 sm:rounded-xl px-4 py-4 sm:p-2">
              <div className="grid max-w-2xl grid-cols-1 m-8">
                <p className="text-lg font-bold leading-6 text-gray-900">
                  Contract Address:{" "}
                  <span className=" font-normal">{contractAddress}</span>
                </p>
                <p className="text-lg font-bold leading-6 text-gray-900">
                  Freelancer:{" "}
                  <span className=" font-normal">{contract.freelancer}</span>
                </p>
                <p className="text-lg font-bold leading-6 text-gray-900">
                  Client:{" "}
                  <span className=" font-normal">{contract.client}</span>
                </p>
                <p className="text-lg font-bold leading-6 text-gray-900">
                  Amount:{" "}
                  <span className=" font-normal">{contract.amount} ETH</span>
                </p>
                <p className="text-lg font-bold leading-6 text-gray-900">
                  Terms:<span className=" font-normal"> {contract.terms}</span>
                </p>
                <p className="text-lg font-bold leading-6 text-gray-900">
                  Deadline:{" "}
                  <span className=" font-normal">
                    {new Date(
                      Number(contract.deadline) * 1000
                    ).toLocaleString()}
                  </span>
                </p>
                <p className="text-lg font-bold leading-6 text-gray-900">
                  State: <span className=" font-normal">{contractState}</span>
                </p>

                <div className="mt-4">
                  <h3 className="text-lg font-bold leading-6 text-gray-900">
                    Attest Dispute
                  </h3>

                  <div className="mt-6">
                    <label className="block text-lg font-bold leading-6 text-gray-900 mb-2">
                      Distribute Attestation Amount
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={attestationAmount}
                      onChange={(e) =>
                        setAttestationAmount(Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span>In Favor of Client: {attestationAmount}%</span>
                      <span>
                        In Favor of Freelancer: {100 - attestationAmount}%
                      </span>
                    </div>
                    <label className="block text-md font-bold leading-6 text-gray-900 mb-2">
                      Provide Reason For your decision
                    </label>
                    <textarea
                      className="text-black block flex-1 border-0 bg-transparent py-1.5 pl-1 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full"
                      placeholder="Give Reason for attestation"
                      value={reason}
                      onChange={(e) => setAttestationReason(e.target.value)}
                    />
                  </div>
                  <button
                    className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2"
                    onClick={attestToDispute}
                  >
                    Submit Attestation
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Loading contract details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelanceContractPage;
