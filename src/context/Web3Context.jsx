import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Get network name from chain ID
  const getNetworkName = (chainId) => {
    const networks = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
      '0xa4b1': 'Arbitrum One',
      '0xa': 'Optimism',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      // Create provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      setAccount(accounts[0]);
      setChainId(chainId);
      setProvider(provider);

      console.log('Wallet connected:', accounts[0]);
      console.log('Network:', getNetworkName(chainId));
    } catch (err) {
      console.error('Error connecting wallet:', err);
      if (err.code === 4001) {
        setError('Connection request rejected. Please approve the connection request.');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setError(null);
    console.log('Wallet disconnected');
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    console.log('Accounts changed:', accounts);
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else if (accounts[0] !== account) {
      // User switched to a different account
      setAccount(accounts[0]);
      console.log('Switched to account:', accounts[0]);
    }
  };

  // Handle chain changes
  const handleChainChanged = (newChainId) => {
    console.log('Network changed:', getNetworkName(newChainId));
    setChainId(newChainId);
    // Reload the page as recommended by MetaMask
    window.location.reload();
  };

  // Set up event listeners
  useEffect(() => {
    if (!isMetaMaskInstalled()) {
      return;
    }

    // Listen for account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Listen for chain changes
    window.ethereum.on('chainChanged', handleChainChanged);

    // Check if already connected
    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({
            method: 'eth_chainId',
          });
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          setAccount(accounts[0]);
          setChainId(chainId);
          setProvider(provider);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };

    checkConnection();

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const value = {
    account,
    chainId,
    networkName: chainId ? getNetworkName(chainId) : null,
    isConnecting,
    isConnected: !!account,
    error,
    provider,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectWallet,
    disconnectWallet,
    formatAddress,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
