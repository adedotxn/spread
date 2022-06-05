import React from 'react'
import styles from '../styles/header.module.css'
import github from '../images/github-fill.svg'
import ConnectBtn from './connect-btn'

function Header({connectWallet, connected, currentAccount}) {
  return (
    <header className={styles.header}>
        <h2>SPREAD</h2>

        <nav>
            <ul>
                 {connected ? 
                    <li className={styles.connected}> <ConnectBtn connectWallet = {connectWallet} connected ={connected} currentAccount = {currentAccount} /> </li>
                     :  
                    <li className={styles.connect}> <ConnectBtn connectWallet = {connectWallet} connected ={connected} currentAccount = {currentAccount} /> </li>
                  }
                <li> <img src={github} alt="github" /> </li>
            </ul>
        </nav>
    </header>
  )
}

export default Header