"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { freelanceContractABI } from "@/utils/abi";
import Nav from "@/components/Nav";
import {
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@account-kit/react";
const FreelanceContractPage = () => {
  const user = useUser();
  const contractAddress = "0xfFB0781ea255dAaE63A74ee8C1D7876cb5D619DE";
  const [contract, setContract] = useState<any>(null);
  const [contractState, setContractState] = useState<string>("");
  const [arbitrators, setArbitrators] = useState<string[]>([
    "0x97835b420E882A4844bA7CD08C094150e80d3af5",
    "0x41c9e39574F40Ad34c79f1C99B66A45eFB830d4c",
    "0xD88981680A1a08456638dc12F35D382142e0ce5c",
  ]);
  const [attestationUID, setAttestationUID] = useState<string>("");
  const [inFavorOfClient, setInFavorOfClient] = useState<boolean>(false);
  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });
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
      console.log(contract);
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
      try {
        // Create an instance of the contract interface
        const contractInterface = new ethers.Interface(freelanceContractABI);

        // Encode the function call
        const data = contractInterface.encodeFunctionData("raiseDispute", [
          arbitrators,
        ]);

        // Prepare the transaction
        const tx = {
          to: contractAddress,
          data,
          value: 0, // Assuming no ETH is required for raising a dispute
        };

        console.log("Transaction Data:", tx);

        // Send the transaction as a UserOperation
        const userOperation = {
          uo: {
            target: contractAddress,
            data,
            value: 0,
          },
        };

        await sendUserOperation(userOperation);

        // Update the contract state
        setContractState("Disputed 🟥");
      } catch (error) {
        console.error("Error raising dispute:", error);
      }
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
                {user?.address === contract.client &&
                  (contractState === "Under Progress 🟨" ||
                    contractState === "Ongoing 🟦") && (
                    <button
                      className="rounded-md bg-black mt-2 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={markWorkCompleted}
                    >
                      Mark Work Completed ✅
                    </button>
                  )}
                {(user?.address === contract.client ||
                  user?.address === contract.freelancer) &&
                  (contractState === "Under Progress 🟨" ||
                    contractState === "Ongoing 🟦") && (
                    <>
                      <div className=" mt-4">
                        <label
                          htmlFor="contract-terms"
                          className="block text-lg font-bold leading-6 text-gray-900"
                        >
                          Enter Reason for Dispute/Evidence :
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="contract-terms"
                            rows={4}
                            // value={terms}
                            // onChange={(e) => setTerms(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <button
                        className="rounded-md mt-2 bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={raiseDispute}
                      >
                        Raise Dispute
                      </button>
                    </>
                  )}
                {contractState === "Disputed" &&
                  contract.isArbitrator(user?.address) && (
                    <div className="mt-4">
                      <h3 className="text-lg font-bold leading-6 text-gray-900">
                        Attest to Dispute
                      </h3>
                      <input
                        className="text-black block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        type="text"
                        placeholder="Attestation UID"
                        value={attestationUID}
                        onChange={(e) => setAttestationUID(e.target.value)}
                      />
                      <div className="mt-2">
                        <label className="mr-4">
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
                      <button
                        className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2"
                        onClick={attestToDispute}
                      >
                        Submit Attestation
                      </button>
                    </div>
                  )}
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
