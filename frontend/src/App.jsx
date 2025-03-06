import React,{useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import RequestPosted from "./pages/RequestPosted";
import PageNotFound from "./pages/PageNotFound";
import RegularRequestPosted from "./pages/RegularRequestPosted";
import PredefinedRequest from "./pages/PredefinedRequest";
import AskForHelp from "./pages/AskForHelp";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import AllRequest from "./pages/AllRequest";
import MemberDashboard from "./pages/MemberDashboard";
import PointsAllocation from "./pages/PointsAllocation";
import MintSBT from "./pages/MintSBT";
import Home from "./pages/Home";
import Referral from "./pages/Refferal";
import Layout from "./components/Layout";
import { AuthProvider } from "./components/auth/AuthContext";
import ProfileUpdate from "./pages/ProfileUpdate";
import SocialProfile from "./pages/SocialProfile";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PageWrapper from "./components/wrapper/PageWrapper";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  useEffect(() => {
    const pageTitles = {
      "/": "Home | Inner Circle",
      "/signin": "SignIn | Inner Circle",
      "/sbt-mint": "SBT Mint | Inner Circle",
      "/referral": "Referral | Inner Circle",
      "/dashboard": "Dashboard | Inner Circle",
      "/profile": "Profile | Inner Circle",
      "/leaderboard": "Leaderboard | Inner Circle",
      "/ask-for-help": "Ask For Help | Inner Circle",
      "/points-allocation": "Allocate Points | Inner Circle",
      "/predefined-help-request": "Request Help | Inner Circle",
      "/social-profile/:walletAddress": "Social Profile | Inner Circle",
      "/update-profile": "Profile Update | Inner Circle",
      "/member-requests": "Member Requests | Inner Circle",
      "/request-posted": "Request Posted | Inner Circle",
      "/regular-request-posted": "Request Posted | Inner Circle",
      "*": "Page Not Found | Inner Circle",
    };

    document.title = pageTitles[location.pathname] || "Inner Circle";
  }, [location]);

  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="/"
              element={
                <Home />

              }
            />

            {/* Sign-in page accessible only if not signed in */}
            <Route
              path="/signin"
              element={
 
                  <ProtectedRoute accessType="signin">
                    <Signin />
                  </ProtectedRoute>
                
              }
            />

            {/* Accessible only if Refferal is false */}
            <Route
              path="/referral"
              element={
      
                  <ProtectedRoute accessType="referralOnly">
                    <Referral />
                  </ProtectedRoute>

              }
            />

            {/* Accessible only if Refferal is true and not minted */}
            <Route
              path="/sbt-mint"
              element={
       
                  <ProtectedRoute accessType="protected">
                    <MintSBT />
                  </ProtectedRoute>

              }
            />

            {/* Protected routes, accessible only if Refferal and minted are true */}
            <Route
              path="/dashboard"
              element={
       
                  <ProtectedRoute accessType="protected">
                    <MemberDashboard />
                  </ProtectedRoute>
       
              }
            />
            <Route
              path="/profile"
              element={
           
                  <ProtectedRoute accessType="protected">
                    <Profile />
                  </ProtectedRoute>
            
              }
            />
            <Route
              path="/leaderboard"
              element={
    
                  <ProtectedRoute accessType="protected">
                    <Leaderboard />
                  </ProtectedRoute>
           
              }
            />
            <Route
              path="/ask-for-help"
              element={
             
                  <ProtectedRoute accessType="protected">
                    <AskForHelp />
                  </ProtectedRoute>
          
              }
            />
            <Route
              path="/points-allocation"
              element={
           
                  <ProtectedRoute accessType="protected">
                    <PointsAllocation />
                  </ProtectedRoute>
              
              }
            />
            <Route
              path="/predefined-help-request"
              element={
               
                  <ProtectedRoute accessType="protected">
                    <PredefinedRequest />
                  </ProtectedRoute>
               
              }
            />
            <Route
              path="/social-profile/:walletAddress"
              element={
               
                  <ProtectedRoute accessType="protected">
                    <SocialProfile />
                  </ProtectedRoute>
              
              }
            />
            <Route
              path="/update-profile"
              element={
                
                  <ProtectedRoute accessType="protected">
                    <ProfileUpdate />
                  </ProtectedRoute>
                
              }
            />
            <Route
              path="/member-requests"
              element={
                
                  <ProtectedRoute accessType="protected">
                    <AllRequest />
                  </ProtectedRoute>
             
              }
            />
            <Route
              path="/request-posted"
              element={
                
                  <ProtectedRoute accessType="protected">
                    <RequestPosted />
                  </ProtectedRoute>
                
              }
            />
            <Route
              path="/regular-request-posted"
              element={
             
                  <ProtectedRoute accessType="protected">
                    <RegularRequestPosted />
                  </ProtectedRoute>
               
              }
            />

            {/* Redirect unknown routes to PageNotFound */}
            <Route
              path="*"
              element={
                <PageWrapper  appName="Inner Circle">
                  <PageNotFound />
                </PageWrapper>
              }
            />
          </Route>
        </Routes>
    </AuthProvider>
  );
}

export default App;
