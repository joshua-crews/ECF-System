import {createContext, useEffect, useState} from "react";
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';

import {useNavigate} from "react-router-dom";
import config from "./config.js";

export const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const backendURL = config.backendURL;
    const navigator = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault()
        if (!e.target.username.value) {
            alert("Don't forget to enter your username or email.")
        } else if (!e.target.password.value) {
            alert("Don't forget to enter your password.")
        } else {
            try {
                let response = await fetch(`${backendURL}/token/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
                });
                if (response.status === 200) {
                    let data = await response.json();
                    setAuthTokens(data);
                    setUser(jwtDecode(data.access));
                    localStorage.setItem('authTokens', JSON.stringify(data));
                    navigator('../home');
                } else if (response.status === 401) {
                    alert('Invalid username/email or password.');
                } else {
                    alert('Auth service failed! Is it maybe down?');
                }
            } catch (error) {
                alert('Auth service failed! Is it maybe down?');
            }
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigator('../')
    }

    let updateToken = async () => {
        if (localStorage.getItem('authTokens') != null) {
            try {
                let response = await fetch(`${backendURL}/token/refresh/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'refresh': authTokens?.refresh})
                })
                await handleResponse(response);
            } catch (e) {
                setAuthTokens(null);
                localStorage.removeItem('authTokens');
                setLoading(false);
                console.log("Auth service failed, is it maybe down?");
            }
        } else {
            setAuthTokens(null);
            setLoading(false);
        }
    }

    let updateNewToken = async (oldToken) => {
        try {
            let response = await fetch(`${backendURL}/token/new/?jwt=${oldToken}`, {
                method:'GET'
            })
            await handleResponse(response);
        } catch (e) {
            setAuthTokens(null);
            localStorage.removeItem('authTokens');
            setLoading(false);
            console.log("Auth service failed, is it maybe down?");
        }
    }

    let createUser = async (e) => {
        e.preventDefault()
        if (!e.target.username.value) {
            alert("Please enter a username.")
        } else if (!e.target.email.value) {
            alert("Don't forget to enter your email.")
        } else if (!e.target.registration_number.value) {
            alert("Don't forget to enter your registration number.")
        } else if (!e.target.password.value) {
            alert("Don't forget to enter your password.")
        } else {
            let response = await fetch(`${backendURL}/register/`, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    'username':e.target.username.value,
                    'email':e.target.email.value,
                    'registration_number':e.target.registration_number.value,
                    'password':e.target.password.value
                })
            })
            const errors = await response.json()
            if (response.status === 200 || response.status === 201) {
                navigator('/')
                alert('Account created!')
            } else if (response.status === 401) {
                alert('Invalid username, email, or password.')
            } else if (response.status === 400) {
                for (const field in errors) {
                    const errorMessages = errors[field];

                    if (errorMessages.length > 0) {
                        const firstErrorMessage = errorMessages[0];
                        alert(firstErrorMessage);
                        break;
                    }
                }
            } else {
                alert('Auth service failed! Is it maybe down?')
            }
        }
    }

    let handleResponse = async (response) => {
        let data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            setAuthTokens(null)
            setUser(null)
            localStorage.removeItem('authTokens')
            if (response.status !== 400) {
                navigator('../')
            }
        }
        if (loading) {
            setLoading(false);
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
        createUser:createUser,
        updateNewToken:updateNewToken
    }

    useEffect(()=> {
        if (loading) {
            updateToken()
        }

        let refreshIntervalTime = 1000 * 60 * 9
        let interval = setInterval(()=> {
            if (authTokens) {
                updateToken()
            }
        }, refreshIntervalTime)
        return ()=> clearInterval(interval)
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
