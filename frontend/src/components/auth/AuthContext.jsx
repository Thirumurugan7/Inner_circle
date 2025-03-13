// // src/context/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { Web3Auth } from "@web3auth/modal";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import {
//   signInStart,
//   signInSuccess,
//   signInFailure,
//   signOutSuccess,
// } from "../redux/user/userSlice";


// const clientId =
//   "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
// const chainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0x14a34",
//   rpcTarget:
//     "https://base-sepolia.infura.io/v3/763d9b7735b04bf58b91993dcc143866",
// };



// const privateKeyProvider = new EthereumPrivateKeyProvider({
//   config: { chainConfig },
// });

// // Create Auth Context
// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [web3auth, setWeb3auth] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const dispatch = useDispatch();

//   // Initialize Web3Auth
//   useEffect(() => {
//   const initWeb3Auth = async () => {
//     try {
//       const web3authInstance = new Web3Auth({
//         clientId,
//         web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
//         privateKeyProvider,
//       });

//       setWeb3auth(web3authInstance);

//       // Ensure modal initialization is completed before continuing
//       await web3authInstance.initModal();

//       if (web3authInstance.connected) {
//         setProvider(web3authInstance.provider);
//         setIsLoggedIn(true);

//         const userInfo = await web3authInstance.getUserInfo();
//         const accounts = await web3authInstance.provider.request({
//           method: "eth_accounts",
//         });

//         if (accounts && accounts.length > 0) {
//           const walletAddress = accounts[0];

//           try {
//             const response = await axios.post(
//               "http://localhost:5001/api/auth",
//               {
//                 name: userInfo.name,
//                 email: userInfo.email || "",
//                 walletAddress,
//               }
//             );

//             if (response.status === 200 || response.status === 201) {
//               setUser(response.data.user);
//               dispatch(signInSuccess(response.data));
//             }
//           } catch (error) {
//             console.error("Error fetching user data:", error);
//             dispatch(signInFailure(error.message));
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Web3Auth initialization error:", error);
//       setError(error.message);
//       dispatch(signInFailure(error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   initWeb3Auth();
// }, [dispatch]);


//   // Login function
//   const login = async () => {
//   if (!web3auth) {
//     const errorMsg = "Web3Auth not initialized";
//     setError(errorMsg);
//     dispatch(signInFailure(errorMsg));
//     return;
//   }

//   // Ensure modal is initialized before calling connect()
//   if (!web3auth.modal) {
//     const errorMsg = "Login modal is not initialized";
//     setError(errorMsg);
//     dispatch(signInFailure(errorMsg));
//     return;
//   }

//   setLoading(true);
//   setError(null);
//   dispatch(signInStart());

//   try {
//     await web3auth.initModal(); // Ensure the modal is initialized
//     const web3authProvider = await web3auth.connect();

//     setProvider(web3authProvider);
//     setIsLoggedIn(true);

//     const userInfo = await web3auth.getUserInfo();
//     const accounts = await web3authProvider.request({
//       method: "eth_accounts",
//     });

//     if (!accounts || accounts.length === 0) {
//       throw new Error("Wallet address not found");
//     }

//     const walletAddress = accounts[0];

//     const response = await axios.post("http://localhost:5001/api/auth", {
//       name: userInfo.name,
//       email: userInfo.email || "",
//       walletAddress,
//     });

//     if (response.status === 200 || response.status === 201) {
//       setUser(response.data.user);
//       dispatch(signInSuccess(response.data));
//       return response.data;
//     } else {
//       throw new Error("Invalid response from server");
//     }
//   } catch (error) {
//     console.error("Login Error:", error);
//     setError(error.message);
//     dispatch(signInFailure(error.message));
//     throw error;
//   } finally {
//     setLoading(false);
//   }
// };


//   // Logout function
//   const logout = async () => {
//     if (!web3auth) {
//       const errorMsg = "Web3Auth not initialized";
//       setError(errorMsg);
//       return;
//     }

//     try {
//       await web3auth.logout();
//       setProvider(null);
//       setIsLoggedIn(false);
//       setUser(null);

   

//       // Dispatch Redux action on sign-out
//       dispatch(signOutSuccess());
//     } catch (error) {
//       console.error("Logout Error:", error);
//       setError(error.message);
//     }
//   };

//   // Auth context value
//   const value = {
//     user,
//     isLoggedIn,
//     loading,
//     error,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook to use the auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === null) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };


// src/components/auth/AuthContext.js
// src/components/auth/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSuccess
} from "../redux/user/userSlice";

// Web3Auth configuration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7", 
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
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
  
  // Get auth state from Redux
  const dispatch = useDispatch();
  const { currentUser, loading: reduxLoading, error } = useSelector(state => state.user);
  
  // Computed values based on Redux state
  const isLoggedIn = !!currentUser;
  const user = currentUser;

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
          
          // If Web3Auth is connected but Redux doesn't have user data, retrieve it
          if (!isLoggedIn) {
            try {
              dispatch(signInStart());
              const userInfo = await web3authInstance.getUserInfo();
              const accounts = await web3authInstance.provider.request({
                method: "eth_accounts",
              });
              
              if (accounts && accounts.length > 0) {
                const walletAddress = accounts[0];
                
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
        }
      } catch (error) {
        console.error("Web3Auth initialization error:", error);
        dispatch(signInFailure(error.message));
      } finally {
        setLoading(false);
      }
    };

    initWeb3Auth();
  }, [dispatch, isLoggedIn]);

  // Login function
  const login = async () => {
    if (!web3auth) {
      dispatch(signInFailure("Web3Auth not initialized"));
      return;
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
      const response = await axios.post("https://inner-circle-nine.vercel.app/api/auth", {
        name: userInfo.name,
        email: userInfo.email || "",
        walletAddress,
      });
      
      if (response.status === 200 || response.status === 201) {
        dispatch(signInSuccess(response.data));
        return response.data;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login Error:", error);
      dispatch(signInFailure(error.message));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    if (!web3auth) {
      dispatch(signInFailure("Web3Auth not initialized"));
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      
      // Update Redux state
      dispatch(signOutSuccess());
    } catch (error) {
      console.error("Logout Error:", error);
      // Note: We don't dispatch an error here since we're logging out
    }
  };

  // Combined loading state (either context is loading or redux is loading)
  const combinedLoading = loading || reduxLoading;

  // Auth context value
  const value = {
    user,
    isLoggedIn,
    loading: combinedLoading,
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