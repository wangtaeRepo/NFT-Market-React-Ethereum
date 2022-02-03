import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Load Component
import MainArea from "./components/MainArea";
import MintForm from "./components/MintForm";
import Navigation from "./components/Navigation";

// Metamask 데이터 가져오기
import web3 from "./connection/web3";
import Web3Context from "./store/web3-context";

// Contract 데이터 가져오기
import { ethers } from "ethers";
import contractABI from "./abis/MADTOKEN.json";
import CollectionContext from "./store/collection-context";
import { MADTOKEN_ADDRESS } from "./constants/address";

const App = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);

  useEffect(() => {
    // Metamask 계정 확인
    if (!web3) {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      return;
    }

    // Load BlockChain Data
    const loadBlockchainData = async () => {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error(error);
      }

      // Load account
      const accounts = await web3Ctx.loadAccount(web3);
      // Load Network ID
      const networkId = await web3Ctx.loadNetworkId(web3);
      console.log("accounts!!" + accounts);
      console.log("network ID!!" + networkId);

      // Load Contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(contractABI);
      const contract = collectionCtx.loadContract(
        MADTOKEN_ADDRESS,
        contractABI.abi,
        provider
      );
      console.log("contract address!!" + contract.address);

      // Load contractWithSigner
      const privateKey =
        "0x61f8851ecd6ff6fb0c13639d55ffd0e1b4bbabcb210fcd0014095395c31c117f"; // MetaMask PrivateKey
      const contractWithSigner = collectionCtx.loadContractWithSigner(
        contract,
        privateKey,
        provider
      );
      console.log("contractWithSigner!!" + contractWithSigner);

      if (contract) {
        console.log("Collection contract deployed to ropsten detwork");
        console.log("collectionContract address", contract.address);

        let totalSupply = await collectionCtx.loadTotalSupply(contract);
        collectionCtx.setNftIsLoading(false);
        collectionCtx.loadCollection(contract, totalSupply);
      } else {
        window.alert(
          "NFTMarketplace contract not deployed to detected network."
        );
      }

      // Metamask Event Subscription - Account changed
      window.ethereum.on("accountsChanged", (accounts) => {
        web3Ctx.loadAccount(web3);
      });

      // Metamask Event Subscription - Network changed
      window.ethereum.on("chainChanged", (networkId) => {
        window.location.reload();
      });
    };

    loadBlockchainData();
  }, []);

  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<MainArea />} />
          <Route path="/MintNFT" element={<MintForm />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
