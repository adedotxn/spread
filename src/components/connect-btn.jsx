import React from 'react'
import {truncate} from '../utils/utils'


function ConnectBtn({network, connected, currentAccount, connectWallet}) {
  return (
    <>
        {connected ? <button> {truncate(currentAccount)} <br/> {network} </button>  : <button onClick={connectWallet} >CONNECT<br/> WALLET</button>}
    </>
  )
}

export default ConnectBtn