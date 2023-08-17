import 'react-date-picker/dist/DatePicker.css';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import "./Form.css";

import Sidebar from "../common/Sidebar.jsx";
import {useContext, useEffect, useRef, useState} from "react";

import { Tooltip } from 'react-tooltip';
import DatePicker from 'react-date-picker';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import config from "../config.js";
import {useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";
import {AuthContext} from "../AuthContext.jsx";

function Profile() {
    const [divData, setDivData] = useState([]);
    const inputRefs = useRef([]);
    let [currentTab, setCurrentTab] = useState(0);

    const initialized = useRef(false);
    const backendURL = config.backendURL;
    const navigator = useNavigate();

    const {updateNewToken} = useContext(AuthContext);

    const [DOB, changeDOB] = useState(new Date());
    const [dateImpacted, changeDateImpacted] = useState(new Date(), new Date());

    useEffect(()=> {
        if (!initialized.current) {
            initialized.current = true
            handleAddDiv().then(() => null);
            showTab(currentTab);
            setupLanding();
        }
    }, [])

    let setupLanding = () => {
        let healthcareInput = document.getElementById("healthcareProfessional");
        healthcareInput.style.backgroundColor = "#56585f";
        const jwt = jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access);
        if (jwt.date_of_birth !== null && jwt.date_of_birth !== "None") {
            changeDOB(new Date(jwt.date_of_birth));
        }
        document.getElementById("firstNameField").value = jwt.first_name;
        document.getElementById("lastNameField").value = jwt.last_name;
        document.getElementById("registrationNumberInput").value = jwt.registration_number;
    }

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
        if (n !== 0 && n !== (tabElement.length - 1) && n !== (tabElement.length - 2) && n !== (tabElement.length - 3)) {
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
    }

    let validateForm = () => {
        let x, y, i, valid = true;
        x = document.getElementsByClassName("extenuating-form-tab");
        y = x[currentTab].querySelectorAll("input, textarea");
        for (i = 0; i < y.length; i++) {
            if (y[i].value === "" && y[i].disabled === false) {
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
        return valid;
    }

    let submitForm = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log("fill in forms please")
            return;
        }
        try {
            const elementsWithKey = inputRefs.current.filter(ref => ref.key !== null);
            let dataList = []
            for (let i = 0; i < elementsWithKey.length; i++) {
                dataList.push([])
                dataList[i].push(elementsWithKey[i].querySelector('#affectedModuleCode').value);
                const assignmentType = elementsWithKey[i].querySelector('#assignmentType');
                dataList[i].push(assignmentType.options[assignmentType.selectedIndex].textContent);
                dataList[i].push(dateImpacted[0].toISOString());
                dataList[i].push(dateImpacted[1].toISOString());
                const actionRequested = elementsWithKey[i].querySelector('#actionRequested');
                dataList[i].push(actionRequested.options[actionRequested.selectedIndex].textContent);
            }
            let modulesList = []
            for (let i = 0; i < dataList.length; i++) {
                modulesList.push(JSON.stringify({
                    'module_code': dataList[i][0],
                    'assignment_type': dataList[i][1],
                    'date_impacted_start': dataList[i][2],
                    'date_impacted_end': dataList[i][3],
                    'action_requested': dataList[i][4],
                }))
            }
            let response = await fetch(`${backendURL}/form/new/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'jwt_token': JSON.parse(localStorage.getItem('authTokens')).access,
                    'registration_number': e.target.registrationNumberInput.value,
                    'uk_citizen': e.target.ukCitizenCheck.checked,
                    'first_name': e.target.firstNameField.value,
                    'last_name': e.target.lastNameField.value,
                    'date_of_birth': DOB,
                    'keep_medical_private': e.target.privateMedical.checked,
                    'registered_UHS': e.target.registeredUHS.checked,
                    'healthcare_professional': e.target.healthcareProfessional.value,
                    'date_seen': dateImpacted,
                    'serious_illness': e.target.seriousIllness.checked,
                    'deterioration': e.target.deterioration.checked,
                    'bereavement': e.target.bereavement.checked,
                    'family_circumstances': e.target.familyCircumstances.checked,
                    'other_factors': e.target.otherFactors.checked,
                    'frequent_absence': e.target.frequentAbsence.checked,
                    'details': e.target.detailsInput.value,
                    'modules': modulesList
                })
            });
            if (response.status === 200 || response.status === 201) {
                alert('Extenuating circumstances form submitted.');
                await updateNewToken(JSON.parse(localStorage.getItem('authTokens')).access);
                navigator('../home');
            } else {
                alert('Form service failed! Is it maybe down?');
            }
        } catch (error) {
            alert('Form service failed! Is it maybe down?');
        }
    }

    let addDivClick = async () => {
        if (validateForm()) {
            await handleAddDiv();
            nextPrev(1);
            setCurrentTab(currentTab);
        }
    }

    let handleAddDiv = async () => {
        await setDivData((prevDivData) => [...prevDivData, {}]);
    };

    const enableHealthcare = (e) => {
        let healthcareInput = document.getElementById("healthcareProfessional");
        if (e.target.checked) {
            healthcareInput.disabled = false;
            healthcareInput.style.backgroundColor = "#eee";
        } else {
            healthcareInput.disabled = true;
            healthcareInput.style.backgroundColor = "#56585f";
            healthcareInput.value = "";
        }
    }

    const handleDOBChange = (date) => {
        changeDOB(date);
    };

    const handleDateImpactedChange = (date) => {
        changeDateImpacted(date);
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
                                           target="_bar" name="registrationNumberInput" id="registrationNumberInput"
                                    />
                                    <Tooltip id="registration-tooltip" />
                                </label>
                                <label className="form-custom-checkmark">
                                    Are you a UK citizen or have a lawful visa to be within the UK?
                                    <input type="checkbox" className="in-uk-or-visa submit-efc-text-checkbox"
                                            name="ukCitizenCheck" id="ukCitizenCheck" />
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label>
                                    First Name:
                                    <input className="first-name submit-efc-text-input submit-efc-generic" target="_bar"
                                           id="firstNameField" name="firstNameField" />
                                </label>
                                <label>
                                    Last (Family) Name:
                                    <input className="last-name submit-efc-text-input submit-efc-generic" target="_bar"
                                           id="lastNameField" name="lastNameField" />
                                </label>
                                <label className="date-input-container">
                                    Date of Birth:
                                    <div className="date-input-wrapper">
                                        <DatePicker className="submit-efc-text-date" target="_bar"
                                                    onChange={handleDOBChange} value={DOB}
                                                    id="dateOfBirth" name="dateOfBirth"
                                        />
                                        <span className="calendar-icon">&#x1F4C5;</span>
                                    </div>
                                </label>
                            </div>
                            {divData.map((data, index) => (
                                <>
                                    {<div key={index}
                                        className="extenuating-form-tab" name="extenuatingModule"
                                        style={{
                                            display: 'none',
                                        }}
                                        ref={(el) => (inputRefs.current[index] = el)
                                    }>
                                        <label>
                                            Affected Module Code:
                                            <input className="last-name submit-efc-text-input submit-efc-generic"
                                                   id="affectedModuleCode" name="affectedModuleCode" target="_bar"/>
                                        </label>
                                        <label>
                                            Assignment Type:
                                            <select className="ecf-assignment-type submit-efc-select-input submit-efc-generic"
                                                    id="assignmentType" name="assignmentType">
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
                                            Date When Impacted:
                                            <div className="date-input-wrapper">
                                                <DateRangePicker className="submit-efc-text-date" target="_bar"
                                                            id="datesModuleAffected" name="datesModuleAffected"
                                                            onChange={handleDateImpactedChange} value={dateImpacted} />
                                                <span className="calendar-icon">&#x1F4C5;</span>
                                            </div>
                                        </label>
                                        <label>
                                            Action Requested:
                                            <select className="ecf-action-requested submit-efc-select-input submit-efc-generic"
                                                    id="actionRequested" name="actionRequested">
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
                                <label className="form-custom-checkmark">
                                    Would you like your submitted medical information to be kept private?
                                    All confidential medical information will only be reviewed by your personal tutor if checked.
                                    <input type="checkbox" className="submit-efc-text-checkbox" id="privateMedical"
                                           name="privateMedical" />
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label className="form-custom-checkmark">
                                    Are you registered with the University Healthcare Service (UHS)?
                                    <input type="checkbox" className="submit-efc-text-checkbox" id="registeredUHS"
                                           name="registeredUHS" onClick={enableHealthcare} />
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label>
                                    Healthcare Professional
                                    <input className="submit-efc-text-input submit-efc-generic" target="_bar"
                                           id="healthcareProfessional" name="healthcareProfessional" disabled />
                                </label>
                            </div>
                            <div className="extenuating-form-tab">
                                <label>Please check all of the following affecting your situation:</label>
                                <label className="form-custom-checkmark">
                                    Serious short term illness/accident/hospitalization resulting in absence for more than 7 calendar days/affecting assessment
                                    <input type="checkbox" className="submit-efc-text-checkbox" name="seriousIllness" id="seriousIllness"/>
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label className="form-custom-checkmark">
                                    A deterioration or fluctuation of a disability/long term health condition, resulting in absence of more than 7 calendar days and/or affecting assessment
                                    <input type="checkbox" className="submit-efc-text-checkbox"
                                           name="deterioration" id="deterioration"/>
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label className="form-custom-checkmark">
                                    Bereavement
                                    <input type="checkbox" className="submit-efc-text-checkbox"
                                           name="bereavement" id="bereavement"/>
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label className="form-custom-checkmark">
                                    Significant adverse personal/family circumstances
                                    <input type="checkbox" className="submit-efc-text-checkbox"
                                           name="familyCircumstances" id="familyCircumstances"/>
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label className="form-custom-checkmark">
                                    Other significant exceptional factors (including non-medical circumstances)
                                    <input type="checkbox" className="submit-efc-text-checkbox"
                                           name="otherFactors" id="otherFactors"/>
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label className="form-custom-checkmark">
                                    Frequent absence of less than 7 calendar days where no assessment is involved
                                    <input type="checkbox" className="submit-efc-text-checkbox"
                                           name="frequentAbsence" id="frequentAbsence"/>
                                    <span className="form-custom-checkmark-span" />
                                </label>
                            </div>
                            <div className="extenuating-form-tab">
                                <label>
                                    Please provide the details about your situation:
                                </label>
                                <label>
                                    <textarea className="form-details-input" id="detailsInput" name="detailsInput" />
                                </label>
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