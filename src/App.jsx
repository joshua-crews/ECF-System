import "./components/meyerwebCSSreset.css";

import {AuthProvider} from "./components/AuthContext.jsx";
import Layout from "./components/Layout.jsx";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/login/Login.jsx";

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
                        <Route index element={<Login />} />
                        {'// Redirects to other pages if they try to access non-existent pages'}
                        <Route path="*" element={<Navigate to='/' replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
