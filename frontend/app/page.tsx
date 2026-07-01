"use client";

import { useSearchParams } from "next/navigation";
import { ConnectButton } from "@/components/ConnectButton";
import { StatsView } from "@/components/StatsView";
import { TipForm } from "@/components/TipForm";

export default function TipJarPage() {
  const params = useSearchParams();
  const creator = params.get("creator") ?? "";

  return (
    <main className="wrap">
      <p className="eyebrow">Base Tip Jar</p>
      <h1>Send a tip, no middleman.</h1>
      <p className="sub">
        Every tip goes straight to the creator's wallet on Base Sepolia. This contract never holds funds — it only records the total.
      </p>

      <StatsView creator={creator} />
      <ConnectButton />

      <div style={{ marginTop: 12 }}>
        <TipForm creator={creator} />
      </div>

      <p className="foot">Built with the Base Builder AI Guide · Base Sepolia · Builder Code attribution enabled</p>
    </main>
  );
}
