import {AuthProvider} from "./components/AuthContext.jsx";
import Layout from "./components/Layout.jsx";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PrivateRouteProfile from "./components/common/PrivateRouteProfile.jsx";
import PrivateRouteLogin from "./components/common/PrivateRouteLogin.jsx";

import Login from "./components/login/Login.jsx";
import Signup from "./components/login/Signup.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Form from "./components/Form/Form.jsx";
import FormDetails from "./components/Form/FormDetails.jsx";

function App() {
    return (
        <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <AuthProvider>
                            <Layout />
                        </AuthProvider>
                    }>
                        <Route index element={
                            <PrivateRouteLogin>
                                <Login />
                            </PrivateRouteLogin>
                        } />
                        <Route path="signup" element={
                            <PrivateRouteLogin>
                                <Signup />
                            </PrivateRouteLogin>
                        }
                        />
                        {'// Redirects to other pages if they try to access non-existent pages'}
                        <Route path="*" element={<Navigate to='/' replace />} />
                        <Route path="home" element={
                            <PrivateRouteProfile>
                                <Profile />
                            </PrivateRouteProfile>
                        }
                        />
                        <Route path="form" element={
                            <PrivateRouteProfile>
                                <Form />
                            </PrivateRouteProfile>
                        }
                        />
                        <Route path="form-info" element={
                            <PrivateRouteProfile>
                                <FormDetails />
                            </PrivateRouteProfile>
                        }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
