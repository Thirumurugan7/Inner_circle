

import React, { createContext, useState, useContext, useEffect } from "react";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import RPC from "./ethersRPC";

// Web3Auth configuration
const clientId =
  "BCqmu1bRDa-JEq8vKUfHAfoPeW4IFSikPk40Sq6b3kgEWR0yFcypeimcdcs4UXDAKNyftuJubBdcB_E6SV7mOcM";
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

// Create Web3Auth instance outside the component
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

// Configure adapters
async function configureAdapters() {
  const adapters = await getDefaultExternalAdapters({
    options: {
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      privateKeyProvider,
    },
  });
  adapters.forEach((adapter) => web3auth.configureAdapter(adapter));
}
configureAdapters();

// Create the auth context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  // Get auth state from Redux
  const dispatch = useDispatch();
  const {
    currentUser,
    loading: reduxLoading,
    error,
  } = useSelector((state) => state.user);

  // Computed values based on Redux state
  const isLoggedIn = !!currentUser;

  // Initialize Web3Auth
  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        // Check if user is already logged in
        if (web3auth.connected) {
          try {
            dispatch(signInStart());
            const userInfo = await web3auth.getUserInfo();
            const accounts = await web3auth.provider.request({
              method: "eth_accounts",
            });

            if (accounts && accounts.length > 0) {
              const walletAddress = accounts[0];

              // Check if we have user data in localStorage

              // Fetch from backend
              const response = await axios.post(
                "https://inner-circle-nine.vercel.app/api/auth",
                {
                  name: userInfo.name,
                  email: userInfo.email || "",
                  walletAddress,
                }
              );

              if (response.status === 200 || response.status === 201) {
                dispatch(signInSuccess(response.data));
              }
            }
          } catch (error) {
            console.error("Error syncing Web3Auth state with Redux:", error);
            dispatch(signInFailure(error.message));
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
        dispatch(signInFailure(error.message));
        setLoading(false);
      }
    };

    init();
  }, [dispatch]);

  // Login function
 const login = async () => {
   if (!web3auth) {
     dispatch(signInFailure("Web3Auth not initialized"));
     return false;
   }

   dispatch(signInStart());

   try {
     const web3authProvider = await web3auth.connect();
     setProvider(web3authProvider);

     const userInfo = await web3auth.getUserInfo();
     const accounts = await web3authProvider.request({
       method: "eth_accounts",
     });

     const walletAddress = accounts[0];

     if (!walletAddress) {
       throw new Error("Wallet address not found");
     }

     // Send user data to backend
     const response = await axios.post(
       "https://inner-circle-nine.vercel.app/api/auth",
       {
         name: userInfo.name,
         email: userInfo.email || "",
         walletAddress,
       }
     );

     if (response.status === 200 || response.status === 201) {
       dispatch(signInSuccess(response.data));

       // Get the user data directly from response
       const userData = response.data.user;
       const statusCode = response.status;

       console.log("User data for navigation:", userData);
       console.log("Status code:", statusCode);

       // Navigation logic based on user data and status code
       if (statusCode === 200) {
         if (userData.Refferal && !userData.minted) {
           navigate("/sbt-mint", { replace: true });
         } else if (userData.Refferal && userData.minted) {
           navigate("/dashboard", { replace: true });
         } else {
           // Fallback if conditions aren't met
           navigate("/referral", { replace: true });
         }
       } else if (statusCode === 201) {
         if (userData.Refferal && !userData.minted) {
           navigate("/sbt-mint", { replace: true });
         } else if (!userData.Refferal) {
           navigate("/referral", { replace: true });
         } else {
           // Fallback for new users with other conditions
           navigate("/dashboard", { replace: true });
         }
       } else {
         // Handle unexpected status codes
         navigate("/signin");
       }

       return true;
     } else {
       throw new Error("Invalid response from server");
     }
   } catch (error) {
     console.error("Login Error:", error);
     dispatch(signInFailure(error.message));
     return false;
   }
 };
  // Logout function
  const logout = async () => {
    if (!web3auth) {
      dispatch(signInFailure("Web3Auth not initialized"));
      return false;
    }

    try {
      await web3auth.logout();
      setProvider(null);

      // Update Redux state
      dispatch(signOutSuccess());

      // Clear localStorage

      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  };

  // User info function
  const getUserInfo = async () => {
    try {
      const userInfo = await web3auth.getUserInfo();
      return userInfo;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  };

  // Blockchain functions
  const getAccounts = async () => {
    if (!provider) {
      console.error("Provider not initialized");
      return null;
    }
    return await RPC.getAccounts(provider);
  };

  const getBalance = async () => {
    if (!provider) {
      console.error("Provider not initialized");
      return null;
    }
    return await RPC.getBalance(provider);
  };

  const signMessage = async () => {
    if (!provider) {
      console.error("Provider not initialized");
      return null;
    }
    return await RPC.signMessage(provider);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.error("Provider not initialized");
      return null;
    }
    return await RPC.sendTransaction(provider);
  };

  // Combined loading state (either context is loading or redux is loading)
  const combinedLoading = loading || reduxLoading;

  // Context value
  const value = {
    provider,
    user: currentUser,
    isLoggedIn,
    loading: combinedLoading,
    error,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    sendTransaction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
