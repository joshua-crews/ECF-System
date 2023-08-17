import {useContext} from "react";
import { AuthContext } from "../AuthContext.jsx";
import {Navigate} from "react-router-dom";
import PropTypes from "prop-types";

function PrivateRouteProfile({ children }) {
    let {user} = useContext(AuthContext)
    return user ? <>{children}</> : <Navigate to="/" />;
}

PrivateRouteProfile.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRouteProfile;