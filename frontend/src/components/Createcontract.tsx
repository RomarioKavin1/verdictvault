"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@account-kit/react";
import { factoryabi } from "@/utils/abi";
import Button from "./Button";
import Link from "next/link";
import Spinner from "./Spinner";
const factoryContractAddress = "0x73a9b390e02e842879Da557b801fF4135d194307";

const Createcontract = () => {
  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });

  const [freelancerAddress, setFreelancerAddress] = useState<string>("");
  const [clientAddress, setClientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [terms, setTerms] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [createdContractAddress, setCreatedContractAddress] = useState<
    string | null
  >(null);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    waitForTxn: true,
    onSuccess: ({ hash }: { hash: string }) => {
      console.log("Transaction hash:", hash);
      setHash(hash);
    },
    onError: (error: any) => {
      console.error("Error sending user operation:", error);
    },
  });

  const deployContract = async () => {
    try {
      // Validate inputs
      setLoading(true);
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

  // Set up provider and listen for ContractDeployed event
  useEffect(() => {
    const setupProvider = async () => {
      if (window.ethereum) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(
          factoryContractAddress,
          factoryabi,
          ethersProvider
        );

        factoryContract.on(
          "ContractDeployed",
          (newContract, client, freelancer, amount, terms, deadline) => {
            // Check if the client and freelancer addresses match the input
            if (client === clientAddress && freelancer === freelancerAddress) {
              setCreatedContractAddress(newContract);
              console.log("Contract Address:", newContract);
            }
          }
        );
      } else {
        console.error("No Ethereum provider found");
      }
    };
    setupProvider();
  }, [clientAddress, freelancerAddress]);

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 justify-center items-center">
        <div className="bg-white shadow-sm ring-2 ring-slate-300 sm:rounded-xl">
          <div className="px-4 py-4 sm:p-2">
            {!loading && (
              <div className="grid max-w-2xl grid-cols-1 m-8">
                <div className="sm:col-span-5">
                  <label
                    htmlFor="client-name"
                    className="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Client Address
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        id="client-name"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-5 mt-4">
                  <label
                    htmlFor="freelancer-name"
                    className="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Freelancer Address
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        id="freelancer-name"
                        value={freelancerAddress}
                        onChange={(e) => setFreelancerAddress(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-5 mt-4">
                  <label
                    htmlFor="contract-amount"
                    className="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Contract Amount (ETH)
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        id="contract-amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-5 mt-4">
                  <label
                    htmlFor="contract-terms"
                    className="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Contract Terms
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="contract-terms"
                      rows={4}
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-1 mt-4">
                  <label
                    htmlFor="deadline"
                    className="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Deadline
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="date"
                        id="deadline"
                        value={date}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setDeadline(date.getTime().toString());
                          setDate(e.target.value);
                        }}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-6  border-gray-900/10 px-4 py-4 sm:px-8 mt-8">
                  <button
                    type="button"
                    onClick={deployContract}
                    disabled={isSendingUserOperation}
                    className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <div className="flex items-center justify-center gap-2">
                      Submit
                      {isSendingUserOperation && (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9137 86.7994 32.2935 88.168 35.8757C89.083 38.2648 91.5423 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <div>
                {createdContractAddress == "" && <Spinner />}

                {hash && (
                  <Button
                    text="View Transaction"
                    link={`https://base-sepolia.blockscout.com/tx/${hash}`}
                    new1={true}
                  />
                )}
              </div>
            )}
            {createdContractAddress && (
              <p>Deployed Contract Address: {createdContractAddress}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createcontract;
