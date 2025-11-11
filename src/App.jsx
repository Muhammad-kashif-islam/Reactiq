import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoaderFull } from "./components/Loader";
import Leads from "./pages/dashboard/Leads";
import Assistants from "./pages/dashboard/Assistants";
import Settings from "./pages/dashboard/Settings";
import AdminSettings from "./pages/admin/Settings";

import { AuthProvider } from "./context/AuthContext";
import { AdmindminDashboard } from "./layout/AdminDashboard";
import User from "./pages/admin/User";
import AssistantsPage from "./pages/admin/Assistants";
import EmailVerification from "./pages/EmailVarification";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import AssistantPage from "./components/assistant/AssistantPage";
import {BuyPhoneNumbers} from "./pages/dashboard/BuyPhoneNumber"
import PhoneNumbers from "./pages/dashboard/PhoneNumbers"
import Dashboard from "./pages/dashboard/Dashboard"
// import FlowChart from "./pages/dashboard/FlowChart";
import UserAssistan from "./pages/admin/UserAssistan";
import UserLead from "./pages/admin/UserLead";
import UserPhone from "./pages/admin/UserPhone";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Knowledgebase from "./pages/dashboard/Knowledgebase";
import FlowChart from "./pages/dashboard/WorkFlow";
import Messaging from "./pages/dashboard/Messaging";
import WorkFlow from "./pages/dashboard/WorkFlow";
import Campaign from "./pages/dashboard/Campaign";
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const SendEmail = React.lazy(() => import("./pages/forgetpassword/SendEmail"));
const OTPVerification = React.lazy(() => import("./pages/forgetpassword/OTP"));
const NewPassword = React.lazy(() =>
  import("./pages/forgetpassword/SetNewPassword")
);
const NotFoundPage = React.lazy(() => import("./components/NotFound"));
const DashboardLayout = React.lazy(() =>
  import("./layout/DashboadLayout").then((module) => ({
    default: module.DashboardLayout,
  }))
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoaderFull />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/send_email" element={<SendEmail />} />
            <Route path="/otp_verification" element={<OTPVerification />} />
            <Route path="/new_password" element={<NewPassword />} />
            <Route path="/email_verification" element={<EmailVerification />} />

            <Route path="/" element={<DashboardLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <Leads />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/phone-numbers"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <PhoneNumbers />
                  </ProtectedRoute>
                }
              />
                 <Route
                path="/knowledge-base"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <Knowledgebase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buy-numbers"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <BuyPhoneNumbers />
                  </ProtectedRoute>
                }
              />
                <Route
                path="/workFlow"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <WorkFlow />
                  </ProtectedRoute>
                }
              />
                <Route
                path="/campaign"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <Campaign />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assistants"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <Assistants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-assistant"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <AssistantPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/setting"
                element={
                  <ProtectedRoute allowedRoles={["user", "admin"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
                 
            </Route>
        

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdmindminDashboard />
                </ProtectedRoute>
              }
            >
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/user"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <User />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/setting"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/user_assistant/:userId"
                element ={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UserAssistan/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/user_lead/:userId"
                element ={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UserLead/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/user_phone/:userId"
                element ={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UserPhone/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/assistants"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AssistantsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
