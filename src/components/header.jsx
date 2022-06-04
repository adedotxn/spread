import React from 'react'
import styles from '../styles/header.module.css'
import github from '../images/github-fill.svg'
import {truncate} from '../utils/utils'
import ConnectBtn from './connect-btn'

function Header({connectWallet, connected, currentAccount}) {
  return (
    <header className={styles.header}>
        <h2>SPREAD</h2>

        <nav>
            <ul>
                <li> <ConnectBtn connectWallet = {connectWallet} connected ={connected} currentAccount = {currentAccount} /> </li>
                <li> <img src={github} alt="github" /> </li>
            </ul>
        </nav>
    </header>
  )
}

export default Header