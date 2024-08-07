"use client";
import React, { useState, useEffect } from "react";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import {
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@account-kit/react";

import { ethers, JsonRpcSigner } from "ethers";

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID =
  "0x09893263605c87d6883b0c561bb9ffe913ebb2b97033a855b0bcd824c5df42a7";

const MyComponent = () => {
  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });
  const [attestationUID, setAttestationUID] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();
  const user = useUser();

  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation({
    client,
    waitForTxn: true,
    onSuccess: ({ hash, request }) => {
      console.log("Transaction hash:", hash);
      console.log("User operation request:", request);
    },
    onError: (error) => {
      console.error("Error sending user operation:", error);
    },
  });

  useEffect(() => {
    const setupSigner = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      } else {
        console.error("No Ethereum provider found");
      }
    };
    setupSigner();
  }, []);

  const handleAttest = async () => {
    try {
      if (!signer) {
        throw new Error("Signer not initialized");
      }

      const eas = new EAS(easContractAddress);
      await eas.connect(signer);

      const schemaEncoder = new SchemaEncoder(
        "uint8 plaintiff,uint8 defendant,string comments"
      );
      const encodedData = schemaEncoder.encodeData([
        { name: "plaintiff", value: "2", type: "uint8" },
        { name: "defendant", value: "9", type: "uint8" },
        { name: "comments", value: "hii", type: "string" },
      ]);

      console.log("Encoded Data:", encodedData);

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: "0x0000000000000000000000000000000000000000",
          expirationTime: BigInt(0),
          revocable: false,
          data: encodedData,
        },
      });

      console.log("Transaction sent:", tx);

      const newAttestationUID = await tx.wait();
      setAttestationUID(newAttestationUID);
      console.log("New attestation UID:", newAttestationUID);

      return {
        uo: {
          target: easContractAddress,
          data: tx.data,
          value: 0n,
        },
      };
    } catch (error) {
      console.error("Error during attestation:", error);
    }
  };

  return (
    <div>
      {user ? (
        <p>
          Logged in as {user.email ?? "anon"} {user.address}
        </p>
      ) : (
        <p>You are not logged in</p>
      )}
      <button
        onClick={async () => {
          const userOperation = await handleAttest();
          if (userOperation) {
            sendUserOperation(userOperation);
          }
        }}
        disabled={isSendingUserOperation}
      >
        {isSendingUserOperation ? "Sending..." : "Send Attestation"}
      </button>
      {attestationUID && <p>New attestation UID: {attestationUID}</p>}
    </div>
  );
};

export default MyComponent;
