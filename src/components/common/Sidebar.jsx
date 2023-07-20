import "./Sidebar.css";
import {useContext} from "react";
import {AuthContext} from "../AuthContext";

function Sidebar() {
    let {logoutUser} = useContext(AuthContext)

    return(
        <div className="container justify-left">
            <div className="main-sidebar">
                <h3 className="sidebar_item sidebar_center">ECF System</h3>
                <a href="/home" className="sidebar_item sidebar_item_button">HOME</a>
                <a href="/form" className="sidebar_item sidebar_item_button">FILE FORM</a>
                <a onClick={logoutUser} href={'../'} className="sidebar_item sidebar_item_button">LOG OUT</a>
            </div>
        </div>
    );
}

export default Sidebar;