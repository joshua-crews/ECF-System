import "./Form.css";

import Sidebar from "../common/Sidebar.jsx";
import {useEffect, useRef, useState} from "react";

import { Tooltip } from 'react-tooltip';
import config from "../config.js";
import {useNavigate} from "react-router-dom";

function Profile() {
    const [divData, setDivData] = useState([]);
    const inputRefs = useRef([]);
    let [currentTab, setCurrentTab] = useState(0);

    const initialized = useRef(false)
    const backendURL = config.backendURL;
    const navigator = useNavigate()

    useEffect(()=> {
        if (!initialized.current) {
            initialized.current = true
            handleAddDiv().then(() => null);
            showTab(currentTab);
        }
    }, [])

    let showTab = (n) => {
        const tabElement = document.getElementsByClassName("extenuating-form-tab");
        tabElement[n].style.display = "block";
        for (let i = 0; i < tabElement.length; i++) {
            if (i !== n) {
                tabElement[i].style.display = "none";
            }
        }
        if (n === 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n !== 0 && n !== (tabElement.length - 1)) {
            document.getElementById("moreBtn").style.display = "inline";
        } else {
            document.getElementById("moreBtn").style.display = "none";
        }
        if (n === (tabElement.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Submit";
        } else {
            document.getElementById("nextBtn").innerHTML = "Next";
            document.getElementById("nextBtn").type = "button";
        }
    }

    let nextPrev = (n) => {
        const tabElement = document.getElementsByClassName("extenuating-form-tab");
        if (n === 1 && !validateForm()) {
            return;
        }
        for (let i = 0; i < tabElement.length; i++) {
            tabElement[i].style.display = "none";
        }
        currentTab = currentTab + n;
        if (currentTab >= tabElement.length) {
            document.getElementById("nextBtn").type = "submit";
            currentTab = currentTab - n;
        }
        showTab(currentTab);
        console.log("Current tab: " + currentTab);
    }

    let validateForm = () => {
        let x, y, i, valid = true;
        x = document.getElementsByClassName("extenuating-form-tab");
        y = x[currentTab].getElementsByTagName("input");
        /*
        for (i = 0; i < y.length; i++) {
            if (y[i].value === "") {
                y[i].className += " invalid";
                alert("Please fill in all form parts before proceeding.");
                y[i].select();
                valid = false;
                return valid;
            }
            if ((y[i].getAttribute("pattern")) != null) {
                let regex = /^[0-9_]{9}$/;
                if (!(regex.test(y[i].value))) {
                    alert("Please fill in a valid student number before proceeding.");
                    y[i].select();
                    return false;
                }
            }
        }
        */
        return valid;
    }

    let submitForm = async (e) => {
        e.preventDefault();
        try {
            let response = await fetch(`${backendURL}/form/new/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            if (response.status === 200) {
                alert('Extenuating circumstances form submitted.');
                navigator('../home');
            } else {
                alert('Form service failed! Is it maybe down?');
            }
        } catch (error) {
            alert('Form service failed! Is it maybe down?');
        }
    }

    let addDivClick = async () => {
        await handleAddDiv();
        nextPrev(1);
        setCurrentTab(currentTab);
    }

    let handleAddDiv = async () => {
        await setDivData((prevDivData) => [...prevDivData, {}]);
    };

    return(
        <>
            <div className="profile-page">
                <Sidebar/>
                <div className="user-content form-content">
                    <div className="form-title">
                        <h1>Complete a new Extenuating Circumstances Form</h1>
                    </div>
                    <div className="extenuating">
                        <form id="extenuating-form" className="extenuating-form" onSubmit={submitForm}>
                            <div className="extenuating-form-tab">
                                <label>
                                    Registration Number:
                                    <input className="registration-number submit-efc-text-input submit-efc-generic" pattern="[0-9]{9}"
                                           data-tooltip-id="registration-tooltip" data-tooltip-content="9 Digit Registration Number"
                                           target="_bar"
                                    />
                                    <Tooltip id="registration-tooltip" />
                                </label>
                                <label className="form-custom-checkmark">
                                    Are you a UK citizen or have a lawful visa to be within the UK?
                                    <input type="checkbox" className="in-uk-or-visa submit-efc-text-checkbox" />
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label>
                                    First Name:
                                    <input className="first-name submit-efc-text-input submit-efc-generic" target="_bar" />
                                </label>
                                <label>
                                    Last (Family) Name:
                                    <input className="last-name submit-efc-text-input submit-efc-generic" target="_bar" />
                                </label>
                                <label className="date-input-container">
                                    Date of Birth
                                    <div className="date-input-wrapper">
                                        <input type="date" className="submit-efc-text-date" target="_bar" />
                                        <span className="calendar-icon">&#x1F4C5;</span>
                                    </div>
                                </label>
                            </div>
                            {divData.map((data, index) => (
                                <>
                                    {<div key={index}
                                        className="extenuating-form-tab"
                                        style={{
                                            display: 'none',
                                        }}
                                        ref={(el) => (inputRefs.current[index] = el)
                                    }>
                                        <label>
                                            Affected Module Code:
                                            <input className="last-name submit-efc-text-input submit-efc-generic" target="_bar" />
                                        </label>
                                        <label>
                                            Assignment Type:
                                            <select className="ecf-assignment-type submit-efc-select-input submit-efc-generic">
                                                <option value="option1">Assignment</option>
                                                <option value="option2">Exam</option>
                                                <option value="option3">Quiz</option>
                                                <option value="option3">Lab</option>
                                                <option value="option3">Presentation</option>
                                                <option value="option3">Project</option>
                                                <option value="option3">Other</option>
                                            </select>
                                        </label>
                                        <label className="date-input-container">
                                            Date When Impact Started:
                                            <div className="date-input-wrapper">
                                                <input type="date" className="submit-efc-text-date" target="_bar" />
                                                <span className="calendar-icon">&#x1F4C5;</span>
                                            </div>
                                        </label>
                                        <label className="date-input-container">
                                            Date When Impact Ended:
                                            <div className="date-input-wrapper">
                                                <input type="date" className="submit-efc-text-date" target="_bar" />
                                                <span className="calendar-icon">&#x1F4C5;</span>
                                            </div>
                                        </label>
                                        <label>
                                            Action Requested:
                                            <select className="ecf-action-requested submit-efc-select-input submit-efc-generic">
                                                <option value="option1">Not Assessed</option>
                                                <option value="option1">No penalty for late submission</option>
                                                <option value="option1">Deadline Extension</option>
                                                <option value="option2">Authorized Absence</option>
                                                <option value="option3">Consideration by Exam Board</option>
                                                <option value="option3">For Information Only</option>
                                            </select>
                                        </label>
                                    </div>}
                                </>
                            ))}
                            <div className="extenuating-form-tab">
                                <p>Goodbye</p>
                            </div>
                            <div className="extenuating-form-button-box">
                                <div className="extenuating-form-flow">
                                    <button type="button" id="prevBtn" onClick={() => nextPrev(-1)}>Previous</button>
                                    <button type="button" id="moreBtn" onClick={addDivClick}>Add Another Module</button>
                                    <button type="button" id="nextBtn" onClick={() => nextPrev(1)}>Next</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;