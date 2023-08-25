import "./FormDetails.css";

import {Component} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import Sidebar from "../common/Sidebar.jsx";
import PropTypes from "prop-types";

class FormDetailsRender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialized: false,
            form: null
        };
    }

    async componentDidMount() {
        this.setState({ initialized: true }, async () => {
            try {
                const { selectedForm } = this.props.location.state;
                if (selectedForm === null) {
                    this.props.navigate('../home');
                }
                this.setState({ form: selectedForm });
            } catch (e) {
                this.props.navigate('../home');
            }
        });
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    render() {
        const { form } = this.state;

        return (
            <>
                <div className="profile-page">
                    <Sidebar />
                    {form ? (
                        <div className="user-content form-content">
                            <div className="form-title">
                                <h1>Form submitted {this.formatDate(form.date_submitted)}</h1>
                            </div>
                            <div className="user-content profile-content">
                                <div className="extenuating profile-home-forms details-of-form">
                                    <div className="form-details-review">
                                        <div className="form-details-submitted">
                                            <div className="form-details-modules">
                                                <h3>Modules:</h3>
                                                {form.modules.length > 0 ? form.modules.map(module => module.module_code).join(', ') : ''}
                                            </div>
                                            <div className="form-details-assignments">
                                                <h3>Assignments:</h3>
                                                {form.modules.length > 0 ? form.modules.map(module => module.assignment_type).join(', ') : ''}
                                            </div>
                                            <div className="form-details-submission">
                                                <h3>Form Details:</h3>
                                                <div className="form-details-box">
                                                    {form.details}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-details-response">
                                            <div className="form-details-stage">
                                                <h3>Review Stage:</h3>
                                                {form.review_stage}
                                            </div>
                                            <div className="form-details-progress">
                                                <h3>Review Progress:</h3>
                                                <div className="progress-container-large">
                                                    <div className="progress-bar-large" style={{
                                                        width: (form.review_progress * 3.5) + 'px',
                                                        'backgroundColor': form.review_progress > 50 ? '#dfad28' : '#3498db',
                                                    }}>
                                                        <div className="sliding-line-large" style={{
                                                            animation: 'slide-large ' + (form.review_progress / 10) + 's linear infinite',
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="review-stage">
                                                    <h3>{form.review_progress + "%"}</h3>
                                                </div>
                                            </div>
                                            <div className="form-response-details">
                                                <h3>Decision Response:</h3>
                                                <div className="form-details-box">
                                                    N/A
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <p>Loading...</p>
                    )}
                </div>
            </>
        );
    }
}

FormDetailsRender.propTypes = {
    navigate: PropTypes.any.isRequired,
    location: PropTypes.node.isRequired,
};

export default function FormDetails(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return <FormDetailsRender {...props} location={location} navigate={navigate} />;
}