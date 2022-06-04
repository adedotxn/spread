import {useState} from 'react'
import './App.css';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from "ethers";

import contractAddress from './contracts/contract_address.json'
import abi from './contracts/abi.json'


const XLSX = require('xlsx');
const Papa = require('papaparse')



function App() {

  const [args, setArgs] = useState([]);
  const [ERC20Address, setERC20Address] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [connected, setConnected] = useState(false)

  const [addToken, setAddToken] = useState(false)
  const [currentAccount, setCurrentAccount] = useState("")



  // getting data from the uploaded spreadsheet (.xlsx) file or .csv file
  const readUploadFile = (e) => {
    e.preventDefault();
    const fileTarget = e.target.files;
    const file = fileTarget[0];

    const xlsxType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    const csvType = "text/csv"

    if(!e.target.files) {
      return toast.error("Unsupported File")
    }

    if(file.type === xlsxType) {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
          /* parse the data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
          /* get worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {
          header: 1
      });

      console.log("is this json", data)
      setArgs(data)
      }
      reader.readAsArrayBuffer(e.target.files[0])
      toast.success(".xlsx File Uploaded", {
        position: "bottom-left"
      })
    } else if (file.type === csvType) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
          console.log(results.data)
          setArgs(results.data);
      }})
      toast.success(".csv File Uploaded", {
        position: "bottom-left" 
      })
    } else {
      toast.error("Uploaded file type unsupported")
    }


  }

  //turn the spreadsheet to a javascript object with the addresses as key and amounts as values
  const object = Object.fromEntries(args)

  //extract the addresses into one array (the addresses are the keys)
  const addressesArray = Object.keys(object)

  //extract the amounts into one array (the amounts are the values)
  const amountsArray = Object.values(object)

  console.log("array of address:", addressesArray)

  console.log("array of amounts:", amountsArray)

  const newArr = []
  amountsArray.map(e => {
    const allNum = Number(e)
    return newArr.push(allNum)
  })


  const approveTrf = () => {
    let sum = 0;
    for (let i = 0; i < newArr.length; i++) {
      sum += newArr[i];
    }

    if(sum !== 0 && ERC20Address !== '') {
      console.log("SUM TO APPROVE",sum)
      console.log("ERC20 ADDRESS", ERC20Address)

      //just call the approve function in here for the erc20 contract with 
      //approve(address of this spread contract, sum)
      //so basically ERC20Address.approve([spread contract address], sum)
    } else {
      toast.error("Sum of Tokens = 0/Invalid address")
      console.log("One of this tings is empty")

    }
  }

  const connectWallet = async() => {
    if(!connected) {
      try {
        const {ethereum} = window;
        if (!ethereum) {
          alert("Please install metamask");
          window.open("https://metamask.io/download/", "_blank");
          return;
        }
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
        setConnected(true);
       } catch (error) {
         console.log(error)
       }
    } else{
      setCurrentAccount("");
      setConnected(false)
    }
 }

  const address = contractAddress.contractAddress;
  const setToken = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const spread = new ethers.Contract(address, abi.abi, signer);
    const tokenAddress = await spread.getToken(ERC20Address);
    console.log(tokenAddress)

    setAddToken(true)
  };

  const getTokenDetails = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const spread = new ethers.Contract(address, abi.abi, provider);
      const name = await spread.getTokenName();
      const symbol = await spread.getTokenSymbol()
      console.log(name)
      console.log(symbol)
      setTokenName(name)
      setTokenSymbol(symbol)

  }

  useEffect(() => {
    if(addToken === true) {
      getTokenDetails()
    }
  }, [addToken])




  return (
    <div className="App">
      <div>
        <Toaster/>
      </div>

      <div className="input-section">
        <form action="">
          <input type="file" name="upload" className="file-input" id="file"
          onChange={readUploadFile}
          />
          <label for="file">Upload your spreasheet by clicking here</label>
          <button className="transfer-btn">Send</button>
        </form>
      </div>    

      <input type="text"  value={ERC20Address}  onChange = {e => setERC20Address(e.target.value)} />

    <button onClick={connectWallet} >Connect Wallet </button>

      <button onClick = {setToken}> Connect Token </button> <br/>

      <h2> address : {ERC20Address}  </h2>
      <h2> token name : {tokenName} </h2>
      <h2> token symbol : {tokenSymbol} </h2>
    </div>

    
  );
}

export default App;
