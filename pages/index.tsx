import { useWeb3React } from "@web3-react/core";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { injected } from "../connectors";
import { useCallback, useEffect, useState } from "react";
import useSherpaContext from "../hooks/useSherpaContext";
import saveAs from "file-saver";

const Home: NextPage = () => {
  //home
  const { AVAXContracts, sherpaClient } = useSherpaContext();
  const client = sherpaClient as any;
  const [transaction, setTransaction] = useState<"deposit" | "withdraw">(
    "deposit"
  );

  const [selectedContract, setSelectedContract] = useState(AVAXContracts[0]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalDeps, setTotalDeps] = useState();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!client) return;
      setLoading(true);
      const weiToEther = (x: any) => x * 1e18;
      const res = await client.fetchEvents(
        weiToEther(selectedContract.val),
        "avax"
      );
      const eventList = res.events.slice(0, 12);
      setTotalDeps(res.events.length);
      setEvents(eventList);
      setLoading(false);
    };
    fetchEvents();
  }, [AVAXContracts, client, selectedContract]);

  //deposit
  const [commitment, setCommitment] = useState();
  const [noteString, setNoteString] = useState();

  const createCommitment = async () => {
    const deposit = client.createDeposit(
      weiToEther(selectedContract.val),
      "avax"
    );
    setCommitment(deposit.commitment);
    setNoteString(deposit.noteString);
  };

  //uniquekey
  const { account } = useWeb3React();
  const [checked, setIsChecked] = useState(false);
  const [transactionData, setTransactionData] = useState("");

  function isChecked(e: React.ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked;
    setIsChecked(checked);
  }

  const downloadUniqueKey = useCallback(() => {
    if (!sherpaClient) return;
    client.downloadNote(noteString, saveAs);
  }, [client, sherpaClient, noteString]);
  const deposit = async () => {
    if (!sherpaClient) return;
    setLoading(true);

    const res = await client.sendDeposit(
      weiToEther(selectedContract.val),
      commitment,
      "avax",
      account
    );
    if (res) {
      setTransaction(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!commitment) return;
    downloadUniqueKey();
  }, [commitment, downloadUniqueKey]);

  // withdraw
  const [destinationAddress, setDestinationAddress] = useState("");
  const [uniqueKey, setUniqueKey] = useState("");
  const [selfRelay, setSelfRelay] = useState(false);

  const handleOnChange = (e: any) => {
    if (e.target.checked) {
      setSelfRelay(true);
    } else {
      setSelfRelay(false);
    }
  };

  const withdraw = async () => {
    if (!client) return;
    setLoading(true);
    const [, selectedToken, valueWei] = uniqueKey.split("-");
    await client.fetchEvents(valueWei, selectedToken);
    const res = await client.withdraw(
      uniqueKey,
      destinationAddress,
      selfRelay,
      client.getRelayerList()[0] //todo move this into the button and control it
    );
    if (res) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const refreshSherpaClient = async () => {
      if (!client) return;
      await client.fetchCircuitAndProvingKey(); //must be done but can be done eagerly
    };
    refreshSherpaClient();
  }, [client]);

  return (
    <div className={styles.container}>
      <button onClick={createCommitment}>create commitment</button>
      <button onClick={deposit}>deposit</button>
      <input onChange={(e) => setUniqueKey(e.target.value)} />
      <input onChange={(e) => setDestinationAddress(e.target.value)} />
      <button onClick={withdraw}>withrdaw</button>
    </div>
  );
};

export default Home;

const weiToEther = (x: any) => x * 1e18;
