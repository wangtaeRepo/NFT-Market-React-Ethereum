import React from 'react'

const CollectionContext = React.createContext({
  contract: null,
  contractWithSigner: null,
  totalSupply: null,
  collection: [],
  nftIsLoading: true,
  loadContract: () => {},
  loadTotalSupply: () => {},
  loadCollection: () => {},
  setNftIsLoading: () => {},
})

export default CollectionContext
