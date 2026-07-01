export const tipJarAbi = [
  {
    type: "function",
    name: "tip",
    stateMutability: "payable",
    inputs: [
      { name: "creator", type: "address" },
      { name: "message", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getStats",
    stateMutability: "view",
    inputs: [{ name: "creator", type: "address" }],
    outputs: [
      { name: "total", type: "uint256" },
      { name: "count", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "totalReceived",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "tipCount",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "event",
    name: "Tipped",
    inputs: [
      { name: "creator", type: "address", indexed: true },
      { name: "tipper", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "message", type: "string", indexed: false },
    ],
    anonymous: false,
  },
  { type: "error", name: "ZeroAmount", inputs: [] },
  { type: "error", name: "InvalidCreator", inputs: [] },
  { type: "error", name: "ForwardFailed", inputs: [] },
] as const;

export const TIPJAR_ADDRESS = process.env
  .NEXT_PUBLIC_TIPJAR_ADDRESS as `0x${string}`;
