import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useWeb3 } from '../../context/Web3Context';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const walletMenuRef = useRef(null);
  const {
    account,
    networkName,
    isConnecting,
    isConnected,
    error,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    formatAddress,
  } = useWeb3();

  // Close wallet menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target)) {
        setShowWalletMenu(false);
      }
    };

    if (showWalletMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWalletMenu]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <>
      {/* Error Banner */}
      {error && !isOpen && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <div className="container py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                onClick={() => window.location.reload()}
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="container">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Building icon with modern design */}
                  <rect x="8" y="15" width="8" height="20" fill="#0d9488" opacity="0.8"/>
                  <rect x="18" y="10" width="8" height="25" fill="#0d9488"/>
                  <rect x="28" y="18" width="8" height="17" fill="#0d9488" opacity="0.6"/>
                  {/* Windows */}
                  <rect x="10" y="18" width="2" height="2" fill="white"/>
                  <rect x="13" y="18" width="2" height="2" fill="white"/>
                  <rect x="10" y="22" width="2" height="2" fill="white"/>
                  <rect x="13" y="22" width="2" height="2" fill="white"/>
                  <rect x="20" y="14" width="2" height="2" fill="white"/>
                  <rect x="23" y="14" width="2" height="2" fill="white"/>
                  <rect x="20" y="18" width="2" height="2" fill="white"/>
                  <rect x="23" y="18" width="2" height="2" fill="white"/>
                  <rect x="30" y="22" width="2" height="2" fill="white"/>
                  <rect x="33" y="22" width="2" height="2" fill="white"/>
              </svg>
              <span className="text-2xl font-bold icon-primary mt-1.5">BestCity</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="nav-link">
                {item.name}
              </Link>
            ))}

            {/* Wallet Connection Button */}
            {!isConnected ? (
              <button
                className="btn disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="relative" ref={walletMenuRef}>
                <button
                  className="btn flex items-center space-x-2"
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>{formatAddress(account)}</span>
                </button>

                {showWalletMenu && (
                  <div className="absolute right-0 mt-2 w-64 card shadow-lg z-50">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-secondary-200 dark:border-secondary-700">
                        <span className="text-sm text-muted">Connected</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Account</p>
                        <p className="text-sm font-mono text-body">{formatAddress(account)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Network</p>
                        <p className="text-sm text-body">{networkName}</p>
                      </div>
                      <button
                        className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        onClick={() => {
                          disconnectWallet();
                          setShowWalletMenu(false);
                        }}
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="text-body hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block nav-link hover:bg-primary-50 dark:hover:bg-secondary-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Wallet Connection */}
              {!isConnected ? (
                <button
                  className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:opacity-50"
                  onClick={() => {
                    connectWallet();
                    setIsOpen(false);
                  }}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <div className="p-3 bg-primary-50 dark:bg-secondary-700 rounded-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-sm font-medium text-body">Connected</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted">Account</p>
                      <p className="text-sm font-mono text-body">{formatAddress(account)}</p>
                    </div>
                    <div className="space-y-1 mt-2">
                      <p className="text-xs text-muted">Network</p>
                      <p className="text-sm text-body">{networkName}</p>
                    </div>
                  </div>
                  <button
                    className="w-full px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                    onClick={() => {
                      disconnectWallet();
                      setIsOpen(false);
                    }}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-3 pb-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;