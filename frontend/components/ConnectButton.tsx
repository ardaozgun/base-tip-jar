"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";

export function ConnectButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  if (!isConnected) {
    const connector =
      connectors.find((c) => c.id === "baseAccount") ?? connectors[0];
    return (
      <button
        className="secondary"
        disabled={isPending || !connector}
        onClick={() => connector && connect({ connector })}
      >
        {isPending ? "Connecting…" : "Connect wallet"}
      </button>
    );
  }

  if (chainId !== baseSepolia.id) {
    return (
      <button className="secondary" onClick={() => switchChain({ chainId: baseSepolia.id })}>
        Switch to Base Sepolia
      </button>
    );
  }

  return (
    <button className="secondary" onClick={() => disconnect()}>
      {address?.slice(0, 6)}…{address?.slice(-4)} · Disconnect
    </button>
  );
}
