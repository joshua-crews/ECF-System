import "./Signup.css";

import logo from "../../assets/university_logo.svg";

import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

function Signup() {
    const { loginUser } = useContext(AuthContext);

    return(
        <div className="container">
            <div className="signup-background">
                <div className="login-center">
                    <img src={logo} className="university-logo" alt="university logo"/>
                    <form onSubmit={loginUser} className="login-form">
                        <input type="text" name="username" placeholder="Username" className="input-login-form"/>
                        <input type="text" name="email" placeholder="Email" className="input-login-form"/>
                        <input type="password" name="password" placeholder="Password" className="input-login-form"/>
                        <button name="Submit" type="submit" className="submit-login-form">
                            Sign In
                        </button>
                    </form>
                    <p>Already have an account? <a href="/">Login here</a></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;