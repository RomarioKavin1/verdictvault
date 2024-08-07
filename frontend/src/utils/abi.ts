export const easABI = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "schema",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "input",
        type: "uint256",
      },
    ],
    name: "attestUint",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IEAS",
        name: "eas",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidEAS",
    type: "error",
  },
];
