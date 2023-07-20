import "./Form.css";

import Sidebar from "../common/Sidebar.jsx";

function Profile() {
    return(
        <>
            <div className="profile-page">
                <Sidebar/>
                <div className="user-content form-content">
                    <p>Hello there</p>
                </div>
            </div>
        </>
    );
}

export default Profile;