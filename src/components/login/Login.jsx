import "./Login.css";

import logo from "../../assets/university_logo.svg";

import {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../AuthContext';

function Login() {
    const { loginUser } = useContext(AuthContext);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (isMobile) {
        return (
            <div className="container">
                <div className="login-background">
                    <div className="login-center">
                        <img src={logo} className="university-logo" alt="university logo" />
                        <p style={{textAlign:"center"}}>
                            This application is best viewed on a computer browser. Please switch to a computer browser to access all features.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="container">
            <div className="login-background">
                <div className="login-center">
                    <img src={logo} className="university-logo" alt="university logo" />
                    <form onSubmit={loginUser} className="login-form">
                        <input type="text" name="username" placeholder="Username" className="input-login-form"/>
                        <input type="password" name="password" placeholder="Password" className="input-login-form"/>
                        <button name="Submit" type="submit" className="submit-login-form">
                            Sign In
                        </button>
                    </form>
                    <p>Don&apos;t have an account? <a href="signup">Sign up here</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;