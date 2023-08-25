import "./Signup.css";

import logo from "../../assets/university_logo.svg";

import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import {Tooltip} from "react-tooltip";

function Signup() {
    const { createUser } = useContext(AuthContext);

    let createNewUser = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        createUser(e);
    }

    let validateForm = () => {
        let x, y, i, valid = true;
        x = document.getElementsByClassName("login-form")[0];
        y = x.querySelectorAll("input, textarea");
        console.log(y.length)
        for (i = 0; i < y.length; i++) {
            if (y[i].value === "" && y[i].disabled === false) {
                y[i].className += " invalid";
                alert("Please fill in all form parts before proceeding.");
                y[i].select();
                valid = false;
                return valid;
            }
            if ((y[i].getAttribute("pattern")) != null && y[i].id === "registrationNumberInput") {
                let regex = /^[0-9_]{9}$/;
                if (!(regex.test(y[i].value))) {
                    alert("Please fill in a valid student number before proceeding.");
                    y[i].select();
                    return false;
                }
            }
            if ((y[i].getAttribute("pattern")) != null && y[i].id === "emailInput") {
                let regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
                if (!(regex.test(y[i].value))) {
                    alert("Please fill in a valid email before proceeding.");
                    y[i].select();
                    return false;
                }
            }
        }
        return valid;
    }

    return(
        <div className="container">
            <div className="signup-background">
                <div className="login-center">
                    <img src={logo} className="university-logo-small" alt="university logo"/>
                    <form onSubmit={createNewUser} className="login-form">
                        <input type="text" name="username" placeholder="Username" className="input-login-form"/>
                        <input type="text" name="email" placeholder="Email" className="input-login-form"
                               data-tooltip-content="Valid Email Address" data-tooltip-id="email-tooltip"
                               pattern="/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/" id="emailInput"
                        />
                        <Tooltip id="email-tooltip" />
                        <input type="text" className="input-login-form" pattern="[0-9]{9}" placeholder="Registration Number"
                               data-tooltip-id="registration-tooltip" data-tooltip-content="9 Digit Registration Number"
                               name="registration_number" id="registrationNumberInput"
                        />
                        <Tooltip id="registration-tooltip" />
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