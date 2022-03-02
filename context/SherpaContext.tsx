import React, { createContext, ReactNode, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { injected } from "../connectors";
import * as sherpa from "@iandjx/sherpasdk";
const netId = 43113;
const AVAXContracts = [
  {
    val: 10,
    address: "0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f",
  },
  {
    val: 100,
    address: "0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f",
  },
  {
    val: 500,
    address: "0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f",
  },
];

const defaultValue = {
  sherpaClient: null,
  AVAXContracts,
};
export const SherpaContext = createContext(defaultValue);

interface SherpaContextProps {
  children: ReactNode;
}

const SherpaContextProvider = ({ children }: SherpaContextProps) => {
  const { library, active, activate } = useWeb3React();
  const [sherpaClient, setSherpaClient] = useState<any>(null);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized || window.ethereum) {
        activate(injected);
        // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
        window?.ethereum?.removeAllListeners(["networkChanged"]);
      }
    });
  }, [activate]);

  useEffect(() => {
    if (active) {
      console.log("netid", netId);
      const client = new sherpa.SherpaSDK(netId, library);
      console.log(client);
      setSherpaClient(client);
    }
  }, [active, library]);

  const context = {
    sherpaClient,
    AVAXContracts,
  };
  return (
    <SherpaContext.Provider value={context}>{children}</SherpaContext.Provider>
  );
};

export default SherpaContextProvider;
