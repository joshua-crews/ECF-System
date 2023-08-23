import "./Profile.css";

import Sidebar from "../common/Sidebar.jsx";
import {useEffect, useRef, useState} from "react";
import config from "../config.js";
import {useNavigate} from "react-router-dom";

function Profile() {

    const initialized = useRef(false);
    const backendURL = config.backendURL;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState([]);

    useEffect(()=> {
        if (!initialized.current) {
            initialized.current = true;
            fetchForms().then(() => null);
        }
    }, [])

    let fetchForms = async () => {
        setLoading(true);
        const jwt = JSON.parse(localStorage.getItem('authTokens')).access;
        try {
            const response = await fetch(`${backendURL}/form/?jwt=${jwt}`, {
                method: 'GET'
            });
            const data = await response.json();
            if (response.status === 200) {
                setLoading(false);
                setForms(forms => [...forms, ...data]);
            } else {
                alert('Browse service failed! Is it maybe down?');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return(
        <>
            <div className="profile-page">
                <Sidebar/>
                <div className="user-content profile-content">
                    {forms.length === 0 &&
                        <div className="no-forms">
                            <p>You have no record of any extenuating circumstance forms completed.</p>
                        </div>
                    }
                    {forms.length >= 1 &&
                        <div className="extenuating profile-home-forms">
                            <table className="extenuating-forms">
                                <thead>
                                    <tr className="extenuating-forms-header">
                                        <td>Module(s)</td>
                                        <td>Affected Coursework</td>
                                        <td>Form Review Progress</td>
                                        <td>Form Details</td>
                                    </tr>
                                </thead>
                                <tbody className="extenuating-forms-body">
                                {forms.map(form => (
                                    <tr key={form.id} onClick={() => navigate(`../form-info`, { state: { selectedForm: form } })}>
                                        <td>{form.modules.length > 0 ? form.modules.map(module => module.module_code).join(', ') : ''}</td>
                                        <td>{form.modules.length > 0 ? form.modules.map(module => module.assignment_type).join(', ') : ''}</td>
                                        <td>
                                            <div className="progress-container">
                                                <div className="progress-bar" style={{
                                                    width: (form.review_progress * 2) + 'px',
                                                    'backgroundColor': form.review_progress > 50 ? '#dfad28' : '#3498db',
                                                }}>
                                                    <div className="sliding-line" style={{
                                                        animation: 'slide ' + (form.review_progress / 10) + 's linear infinite',
                                                    }} />
                                                </div>
                                            </div>
                                            <div className="review-stage">
                                                {form.review_stage}
                                            </div>
                                        </td>
                                        <td>{form.details}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Profile;