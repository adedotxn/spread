import {useState} from 'react'
import './App.css';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ethers} from "ethers";

import contractAddress from './contracts/contract_address.json'
import abi from './contracts/abi.json'
import erc20abi from './contracts/erc20abi.json'


import right from './images/arrow-right.svg'
import down from './images/arrow-down.svg'

import Header from './components/header'
const XLSX = require('xlsx');
const Papa = require('papaparse')



function App() {

  const [args, setArgs] = useState([]);
  const [ERC20Address, setERC20Address] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [connected, setConnected] = useState(false)

  const [addToken, setAddToken] = useState(false)
  const [currentAccount, setCurrentAccount] = useState("");

  const [fileUploaded, setFileUploaded] = useState(false)
  const [fileDetails, expandFileDetails] = useState(false);
  const [amountSum, setAmountSum] = useState(0);

  const [approved, setApproved] = useState(false)
  const [amounts, setAmounts] = useState([]);



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
      setFileUploaded(true)
      setArgs(data)
      }
      reader.readAsArrayBuffer(e.target.files[0])

      toast.success(".xlsx File Uploaded")
    } else if (file.type === csvType) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
          console.log("CSV RESULTS : ",results.data)
          setArgs(results.data);
          setFileUploaded(true)
      }})
      toast.success(".csv File Uploaded")
    } else {
      toast.error("Uploaded file type unsupported")
    }
  }

  const object = Object.fromEntries(args);
  const addressesArray = Object.keys(object)
  const amountsArray = Object.values(object)
  function extract() {
    console.log("array of address:", addressesArray)

    const newArr = []
    amountsArray.map(e => {
      const allNum = Number(e)
      return newArr.push(allNum)
    })

    console.log("array of amounts:", newArr)
    setAmounts(newArr)

    
    let sum = 0;
    for (let i = 0; i < newArr.length; i++) {
      sum += newArr[i];
    }
    setAmountSum(sum)
  }




  useEffect(() => {
    if(fileUploaded) {
      extract()
    }
  }, [fileUploaded])

  




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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    if(data.get("token") === '') {
      return toast.error("Invalid/No Token Address")
    } else {
      const spread = new ethers.Contract(address, abi.abi, signer);
    const tokenAddress = await spread.getToken(data.get("token"));

    console.log(tokenAddress)
    console.log("with data", data.get("token"))
    setAddToken(true)
    }
  }

  useEffect(() => {
    if(addToken) {
      getTokenDetails()
      toast.success("Token Found")
    }
  }, [addToken])

  const approveTrf = async (e) => {
    e.preventDefault()
    if(amountSum !== 0 && ERC20Address !== '') {
      console.log("SUM TO APPROVE",amountSum)
      console.log("ERC20 ADDRESS", ERC20Address)

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(ERC20Address, erc20abi, signer);

      const approve = await contract.approve(address, ethers.utils.parseEther(`${amountSum.toString()}`));
      console.log("approve", approve)
      setApproved(true)
      toast.success("Spreading approved, Proceed to Spread")
    } else {
      toast.error("Sum of Tokens = 0/Invalid address")
      console.log("One of this tings is empty")
      setApproved(false)
    }
  }

  const spreadTokens = async (e) => {
    e.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    if(addressesArray === [] && amounts === []) {
      return toast.error("Empty addresses/amounts")
    }
    const contract = new ethers.Contract(address, abi.abi, signer);
    const spreadCoins = await contract.batchTransfer(addressesArray, amounts);
    console.log(spreadCoins)
    toast.success("Spreading")
  }






  return (
    <div className="App">
      <div>
        <Toaster
        toastOptions={{
          className: '',
          style: {
            fontFamily : 'Fira Code',
            },
        }}/>
      </div>

      <Header connectWallet = {connectWallet} connected = {connected} 
        currentAccount = {currentAccount}
      />

      <main>
        <section>
          <p> an eth dapp for mass disbursing of tokens  </p> 

          <span >Keep Spreading</span>  

          {/* { connected ? 
            <span >Keep Spreading</span>  
          : 
            <span><ConnectBtn connectWallet = {connectWallet} connected ={connected} currentAccount = {currentAccount} /> to continue</span> 
          }  */}
        </section>
      </main>

      
       
      <div className='inputs'>
        <form  onSubmit={handleSubmit}>
          <label> Input Token Address</label>
          <input type="text" name="token" value={ERC20Address}  onChange = {e => setERC20Address(e.target.value)} />
          <button type="submit">Connect Token</button>
        </form>

        {addToken ? 
          <div>
            <h3>{tokenName}</h3>
            <h3>{tokenSymbol}</h3>
          </div>
          :
          <div>
            <h3>TOKEN NAME</h3>
            <h3>TOKEN SYMBOL</h3>
          </div>
        }
      </div>

      <div className='upload' >
      { addToken && 
        <form>
          <label htmlFor="upload"> Upload .csv/.xlsx file</label>
          <input type="file" name="upload" className="file-input" id="file"
          onChange={readUploadFile}
          /><br/>

          <div className="details">
            <h3 onClick={() => expandFileDetails(!fileDetails) } >
              Expand to see confirm details before spreading
              {fileDetails ? <img src={down} alt="open"/> : <img src={right} alt="closed" /> }
            </h3>

            {fileDetails && <ul>
              <li>Total amount to disburse<span> {amountSum}{tokenSymbol}</span></li>
              <li>Spread to <span> {addressesArray.length} </span> addresses(es) </li>
            </ul>}
          </div>
          
          <div>
            <button className='approve' onClick={approveTrf} > Approve {amountSum}{tokenSymbol} </button>
            {approved ? <button  onClick={spreadTokens} className="transfer-btn"> START SPREAD </button> : null }
          </div>
        </form> 
      }
      </div>
      
    </div>
    
  );
}

export default App;
