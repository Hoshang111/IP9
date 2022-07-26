import React, { useEffect, useState }  from "react";
import OwnershipAgreement from "./contracts/OwnershipAgreement.json";
import Web3 from "web3";

import "./App.css";

const App = () => {
  const [seller, setSeller] = useState("NA");
  const [buyer, setbuyer] = useState("NA");
  const [des, setDes] = useState("No Des");
  const [price, setprice] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState([]);
  const [contractAddress, setcontractAddress] = useState("");
  const [contract, setContract] = useState({});
  const [status, setStatus] = useState("NO STATUS");
  // state = { seller: null, buyer: null, descr: null, price: 0, web3: null, accounts: null, contract: null, statusMessage: null };

  
  useEffect( async () => {
    if (window.ethereum) {
      (window.ethereum).request({method: 'eth_requestAccounts'})
      .then((val) => {
        setAccount(val);
        console.log("acc: " + val);
      })
      .catch((ee) => {
        console.log("Error: "+ ee);
      });

    } else {
      alert("MetaMask Not Found");
    }

    const web_3 = new Web3(window.ethereum);
    const netw = await web_3.eth.net.getNetworkType();
    console.log(netw);
    setWeb3(web_3);
    // console.log(JSON.stringify(OwnershipAgreement.abi));
    const contr = await new web_3.eth.Contract(OwnershipAgreement.abi, "0x7Dfae75f7B3a96a5123A859b20ad9f742f6979a0");
    setcontractAddress(contr.options.address);
    console.log(contr);
    // const justRun = async () => {
    //   try {
    //     const web_3 = await getWeb3();
    //     console.log(web_3);
    //     const Etheraccount = await web_3.eth.getAccounts();
    //     console.log(Etheraccount);
        // const OwnershipContract = await truffleContract(OwnershipAgreement);
        // OwnershipContract.setProvider(web_3.currentProvider);
        // console.log(OwnershipContract);
        // const inst= await OwnershipContract.deployed();
        // console.log(inst);
    //     setWeb3(web_3);
    //     setAccount(Etheraccount);
    //     setcontract(inst);
    //     console.log(contract);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // justRun();
    // run();
  }, []);

  const confirmClick = async () =>{
    contract.confirmReceipt({ from: account[0] });
  }

  const run= async () =>{
    const balance = await web3.eth.getBalance(contract.address);
    const price_1 = (await contract.price()).toString();
    const status_1 = await contract.confirmed();
    setprice(price_1);
    console.log(price);
    console.log("check");
    setStatus(StatusOfThePayment(status_1,parseInt(balance),price_1));
    const seller_1 = await contract.seller();
    setSeller(seller_1);
    const buyer_1 = await contract.buyer();
    setbuyer(buyer_1);
    const des_1 = await contract.descr();
    setDes(des_1);
  };

  const StatusOfThePayment = (status, balance, price) => {
    if(status) {
      return "Confirmed!";
    } else{
      if (balance === price) {
        return "Paid!";
      } else {
        return "Waiting for Payment";
      }
    }
  };

  return (
    <>
      {!web3 ?
        (<div>Waiting for WEB3</div>)
        :
        (<div className="App">
          <div className="navbar">
            Account: {account}
          </div>
          <h1>Ownership Agreement</h1>
            <h4>Contract Address: {contractAddress}</h4>
            <h4>Entity: {}</h4>
            <h4>Item: {}</h4>
            <h4>Date: {} </h4>
            <h4>Confirmed: {}</h4>
        </div>)
      }
    </>
    
  );
};

export default App;
