import "./Form.css";

import Sidebar from "../common/Sidebar.jsx";
import {useEffect} from "react";

function Profile() {
    let currentTab = 0;

    useEffect(()=>{
        showTab(currentTab);
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
        if (n === (tabElement.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Submit";
        } else {
            document.getElementById("nextBtn").innerHTML = "Next";
        }
    }

    let nextPrev = (n) => {
        const tabElement = document.getElementsByClassName("extenuating-form-tab");
        if (n === 1 && !validateForm()) {
            alert("Please fill in all form parts before proceeding.");
            return;
        }
        tabElement[currentTab].style.display = "none";
        currentTab = currentTab + n;
        if (currentTab >= tabElement.length) {
            document.getElementById("regForm").submit();
            return;
        }
        showTab(currentTab);
    }

    let validateForm = () => {
        let x, y, i, valid = true;
        x = document.getElementsByClassName("extenuating-form-tab");
        y = x[currentTab].getElementsByTagName("input");
        for (i = 0; i < y.length; i++) {
            if (y[i].value === "") {
                y[i].className += " invalid";
                valid = false;
            }
        }
        return valid;
    }

    return(
        <>
            <div className="profile-page">
                <Sidebar/>
                <div className="user-content form-content">
                    <div className="form-title">
                        <h1>Complete a new Extenuating Circumstances Form</h1>
                    </div>
                    <div className="extenuating">
                        <form className="extenuating-form">
                            <div className="extenuating-form-tab">
                                <label>
                                    Registration Number
                                    <input className="registration-number submit-efc-text-input" />
                                </label>
                                <label className="form-custom-checkmark">
                                    Are you a UK citizen or have a lawful visa to be within the UK?
                                    <input type="checkbox" className="in-uk-or-visa submit-efc-text-checkbox" />
                                    <span className="form-custom-checkmark-span" />
                                </label>
                                <label>
                                    First Name
                                    <input className="first-name submit-efc-text-input" />
                                </label>
                                <label>
                                    Last (Family) Name
                                    <input className="last-name submit-efc-text-input" />
                                </label>
                                <label>
                                    Date of Birth
                                    <input type="date" className="date-of-birth"/>
                                </label>
                            </div>
                            <div className="extenuating-form-tab">
                                <p>Hello</p>
                            </div>
                            <div className="extenuating-form-tab">
                                <p>Goodbye</p>
                            </div>
                            <div className="extenuating-form-button-box">
                                <div className="extenuating-form-flow">
                                    <button type="button" id="prevBtn" onClick={() => nextPrev(-1)}>Previous</button>
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