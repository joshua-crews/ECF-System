import "./Signup.css";

import logo from "../../assets/university_logo.svg";

import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

function Signup() {
    const { createUser } = useContext(AuthContext);

    return(
        <div className="container">
            <div className="signup-background">
                <div className="login-center">
                    <img src={logo} className="university-logo-small" alt="university logo"/>
                    <form onSubmit={createUser} className="login-form">
                        <input type="text" name="username" placeholder="Username" className="input-login-form"/>
                        <input type="text" name="email" placeholder="Email" className="input-login-form"/>
                        <input type="text" name="registration_number" placeholder="Registration Number" className="input-login-form"/>
                        <input type="password" name="password" placeholder="Password" className="input-login-form"/>
                        <button name="Submit" type="submit" className="submit-login-form">
                            Create Account
                        </button>
                    </form>
                    <p>Already have an account? <a href="/">Login here</a></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;