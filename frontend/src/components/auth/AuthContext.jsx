// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSuccess,
} from "../redux/user/userSlice";


// Web3Auth configuration
const clientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x14a34",
  rpcTarget:
    "https://base-sepolia.infura.io/v3/763d9b7735b04bf58b91993dcc143866",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Create Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  // Initialize Web3Auth
  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        });

        setWeb3auth(web3authInstance);

        await web3authInstance.initModal();

        if (web3authInstance.connected) {
          setProvider(web3authInstance.provider);
          setIsLoggedIn(true);

          // Fetch user info if already connected
          const userInfo = await web3authInstance.getUserInfo();
          const accounts = await web3authInstance.provider.request({
            method: "eth_accounts",
          });

          if (accounts && accounts.length > 0) {
            const walletAddress = accounts[0];

            // Retrieve user data from local storage if available
            const storedUser = localStorage.getItem("authUser");
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              setUser(userData);

              // Also update Redux store
              const token = localStorage.getItem("authToken");
              dispatch(signInSuccess({ user: userData, token }));
            } else {
              // If not in local storage, fetch from backend
              try {
                const response = await axios.post(
                  "http://localhost:5000/api/auth",
                  {
                    name: userInfo.name,
                    email: userInfo.email || "",
                    walletAddress,
                  }
                );

                if (response.status === 200 || response.status === 201) {
                  setUser(response.data.user);
                  localStorage.setItem(
                    "authUser",
                    JSON.stringify(response.data.user)
                  );
                  localStorage.setItem("authToken", response.data.token);

                  // Update Redux store
                  dispatch(signInSuccess(response.data));
                }
              } catch (error) {
                console.error("Error fetching user data:", error);
                dispatch(signInFailure(error.message));
              }
            }
          }
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
        setError(error.message);
        dispatch(signInFailure(error.message));
      } finally {
        setLoading(false);
      }
    };

    initWeb3Auth();
  }, [dispatch]);

  // Login function
  const login = async () => {
    if (!web3auth) {
      const errorMsg = "Web3Auth not initialized";
      setError(errorMsg);
      dispatch(signInFailure(errorMsg));
      return;
    }

    setLoading(true);
    setError(null);

    // Dispatch Redux action to indicate sign-in started
    dispatch(signInStart());

    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setIsLoggedIn(true);

      const userInfo = await web3auth.getUserInfo();
      const accounts = await web3authProvider.request({
        method: "eth_accounts",
      });

      const walletAddress = accounts[0];

      if (!walletAddress) {
        const errorMsg = "Wallet address not found";
        throw new Error(errorMsg);
      }

      // Send user data to backend
      const response = await axios.post("http://localhost:5000/api/auth", {
        name: userInfo.name,
        email: userInfo.email || "",
        walletAddress,
      });

      if (response.status === 200 || response.status === 201) {
        setUser(response.data.user);

        // Store auth data in localStorage for persistence
        localStorage.setItem("authUser", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", response.data.token);

        // Update Redux store on successful sign-in
        dispatch(signInSuccess(response.data));

        return response.data;
      } else {
        const errorMsg = "Invalid response from server";
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message);
      dispatch(signInFailure(error.message));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    if (!web3auth) {
      const errorMsg = "Web3Auth not initialized";
      setError(errorMsg);
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setIsLoggedIn(false);
      setUser(null);

      // Clear localStorage
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");

      // Dispatch Redux action on sign-out
      dispatch(signOutSuccess());
    } catch (error) {
      console.error("Logout Error:", error);
      setError(error.message);
    }
  };

  // Auth context value
  const value = {
    user,
    isLoggedIn,
    loading,
    error,
    login,
    logout,
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
