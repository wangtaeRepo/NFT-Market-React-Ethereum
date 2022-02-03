import React from 'react'
import ReactDOM from 'react-dom'
import GlobalStyle from './GlobalStyle'
import App from './App'

import Web3Provider from './store/Web3Provider'
import CollectionProvider from './store/CollectionProvider'

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    {/* Metamask 계정 데이터 적용 */}
    <Web3Provider>
      {/* Contract 관련 데이터 적용 */}
      <CollectionProvider>
        <App />
      </CollectionProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
