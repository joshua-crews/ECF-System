import "./Login.css"

import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

function Login() {
    const { loginUser } = useContext(AuthContext);

    return(
        <>
            <form onSubmit={loginUser} >
                <input type="text" name="username"/>
                <input type="password" name="password"/>
                <button name="Submit" type="submit">
                    Submit
                </button>
            </form>
        </>
    );
}

export default Login;