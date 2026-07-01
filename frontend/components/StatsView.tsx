"use client";

import { formatEther, isAddress } from "viem";
import { useReadContract } from "wagmi";
import { tipJarAbi, TIPJAR_ADDRESS } from "@/lib/tipjarAbi";

export function StatsView({ creator }: { creator: string }) {
  const enabled = isAddress(creator) && Boolean(TIPJAR_ADDRESS);

  const { data, isLoading, isError } = useReadContract({
    abi: tipJarAbi,
    address: TIPJAR_ADDRESS,
    functionName: "getStats",
    args: enabled ? [creator as `0x${string}`] : undefined,
    query: { enabled, refetchInterval: 15_000 },
  });

  const total = data?.[0] ?? 0n;
  const count = data?.[1] ?? 0n;
  const fillPct = Math.min(100, Number(total > 0n ? 30 + Number(count) * 8 : 0));

  return (
    <div className="jar">
      <div className="jar-fill" style={{ height: `${fillPct}%` }} />
      <div className="jar-content">
        <p className="stat-label">Total received on this jar</p>
        <p className="stat-total">
          {isLoading ? "…" : isError ? "—" : `${Number(formatEther(total)).toFixed(4)} ETH`}
        </p>
        <p className="stat-count">
          {isError
            ? "Contract not reachable — check NEXT_PUBLIC_TIPJAR_ADDRESS."
            : `${count.toString()} tip${count === 1n ? "" : "s"} so far`}
        </p>
      </div>
    </div>
  );
}
