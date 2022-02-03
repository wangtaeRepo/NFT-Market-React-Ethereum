import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import logo from '../img/logo2.png'
import web3 from '../connection/web3'
import Web3Context from '../store/web3-context'
import { Link } from 'react-router-dom'

const Navigation = () => {
  const web3Ctx = useContext(Web3Context)
  const connectWalletHandler = async () => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      console.error(error)
    }
    // Load accounts
    web3Ctx.loadAccount(web3)
    console.log(web3Ctx.account)
  }

  /* Network 확인 후 etherscan 연결 - 추후 구현 예정 */
  // let etherscanUrl
  // if (web3Ctx.networkId === 3) {
  //   etherscanUrl = 'https://ropsten.etherscan.io'
  // } else if (web3Ctx.networkId === 4) {
  //   etherscanUrl = 'https://rinkeby.etherscan.io'
  // } else if (web3Ctx.networkId === 5) {
  //   etherscanUrl = 'https://goerli.etherscan.io'
  // } else {
  //   etherscanUrl = 'https://etherscan.io'
  // }

  return (
    <NavigationStyled>
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <ul className="nav-items">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <div>
            <Link to="/MintNFT">MintNFT</Link>
          </div>
        </li>
        <li>
          <a href="#">FAQs</a>
        </li>
        <li>
          <a href="#">Activity</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
        <li className="nav-item">
          {web3Ctx.account > 0 ? (
            'Connected: ' +
            String(web3Ctx.account).substring(0, 6) +
            '...' +
            String(web3Ctx.account).substring(38)
          ) : (
            <div className="primary-btn" onClick={connectWalletHandler}>
              Connect Wallet
            </div>
          )}

          {/* 계정 연동 상태에 맞춰 연결 또는 etherscan 연결 - 추후 구현 예정 */}
          {/* {web3Ctx.account && (
            <a
              className="nav-link small"
              href={`${etherscanUrl}/address/${web3Ctx.account}`}
              target="blank"
              rel="noopener noreferrer"
            >
              {web3Ctx.account}
            </a>
          )}
          {!web3Ctx.account && (
            <div className="primary-btn" onClick={connectWalletHandler}>
              MetaMask Connect
            </div>
          )} */}
        </li>
      </ul>
    </NavigationStyled>
  )
}

const NavigationStyled = styled.nav`
  transform: translateX(5%);
  width: 95%;
  min-height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .nav-items {
    display: flex;
    align-items: center;
    li {
      margin: 0 1rem;
    }
    .primary-btn {
      margin-left: 3rem;
      background-color: rgba(57, 95, 246, 0.3);
      padding: 0.6rem 1.3rem;
      border-radius: 70px;
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      &:hover {
        background-color: rgba(57, 95, 246, 1);
      }
    }
  }
  .logo {
    img {
      width: 60px;
    }
  }
`

export default Navigation
