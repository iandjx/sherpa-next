import "../styles/globals.css";
import type { AppProps } from "next/app";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import { useEffect } from "react";
import SherpaContextProvider from "../context/SherpaContext";

function getLibrary(provider: any) {
  const library = new Web3(provider);
  // library.pollingInterval = 15000
  return library;
}
function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <SherpaContextProvider>
        <Component {...pageProps} />
      </SherpaContextProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
