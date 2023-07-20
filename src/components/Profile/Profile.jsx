import "./Profile.css";

import Sidebar from "../common/Sidebar.jsx";

function Profile() {
    return(
        <>
            <div className="profile-page">
                <Sidebar/>
                <div className="user-content profile-content">
                    <div className="no-forms">
                        <p>You have no record of any extenuating circumstance forms completed.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;