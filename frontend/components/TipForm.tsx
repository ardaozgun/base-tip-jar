"use client";

import { useMemo, useState } from "react";
import { encodeFunctionData, isAddress, parseEther } from "viem";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Attribution } from "ox/erc8021";
import { tipJarAbi, TIPJAR_ADDRESS } from "@/lib/tipjarAbi";

const PRESETS = ["0.001", "0.005", "0.02"];
const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://sepolia.basescan.org";
const BUILDER_CODE = process.env.NEXT_PUBLIC_BUILDER_CODE;

export function TipForm({ creator }: { creator: string }) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState(PRESETS[1]);
  const [message, setMessage] = useState("");

  const { sendTransaction, data: hash, isPending, error, reset } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const creatorIsValid = isAddress(creator);

  const dataSuffix = useMemo(() => {
    if (!BUILDER_CODE) return undefined;
    try {
      return Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
    } catch {
      return undefined;
    }
  }, []);

  function handleSubmit() {
    if (!creatorIsValid || !TIPJAR_ADDRESS) return;

    const callData = encodeFunctionData({
      abi: tipJarAbi,
      functionName: "tip",
      args: [creator as `0x${string}`, message.slice(0, 140)],
    });

    const fullData = dataSuffix
      ? ((callData + dataSuffix.slice(2)) as `0x${string}`)
      : callData;

    sendTransaction({
      to: TIPJAR_ADDRESS,
      data: fullData,
      value: parseEther(amount || "0"),
    });
  }

  if (!creatorIsValid) {
    return (
      <div className="status" data-tone="error">
        No valid creator address. Open this page as <code>/?creator=0xCreatorAddress</code>.
      </div>
    );
  }

  return (
    <>
      <label htmlFor="amount">Amount (ETH, Base Sepolia)</label>
      <div className="amount-row">
        {PRESETS.map((p) => (
          <button key={p} type="button" className="amount-chip" data-active={amount === p} onClick={() => setAmount(p)}>
            {p}
          </button>
        ))}
      </div>
      <input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.01" />

      <label htmlFor="message">Message (optional)</label>
      <textarea id="message" rows={2} maxLength={140} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Loved this!" />

      <button className="primary" disabled={!isConnected || isPending || isConfirming || !amount} onClick={handleSubmit}>
        {!isConnected ? "Connect wallet to tip" : isPending ? "Confirm in wallet…" : isConfirming ? "Confirming…" : "Send tip"}
      </button>

      {error && (
        <div className="status" data-tone="error">
          {error.message.includes("User rejected") ? "Transaction rejected in wallet." : "Tip failed. The wallet or network rejected the transaction."}
        </div>
      )}

      {hash && !isConfirmed && (
        <div className="status" data-tone="pending">
          Waiting for confirmation on Base Sepolia…{" "}
          <a href={`${EXPLORER}/tx/${hash}`} target="_blank" rel="noreferrer">View on explorer</a>
        </div>
      )}

      {isConfirmed && hash && (
        <div className="status" data-tone="success">
          Tip confirmed.{" "}
          <a href={`${EXPLORER}/tx/${hash}`} target="_blank" rel="noreferrer">View on explorer</a>
          <div>
            <button className="secondary" style={{ marginTop: 10 }} onClick={() => { reset(); setMessage(""); }}>
              Send another tip
            </button>
          </div>
        </div>
      )}
    </>
  );
}
