# ECFSystem
![Node Version](https://img.shields.io/badge/Node.js-18.14.1LTS_|_19.6.1-informational?style=flat&logo=node.js&logoColor=white&color=11BB11)
![React Version](https://img.shields.io/github/package-json/dependency-version/joshua-crews/ECF-System/react?logo=react)
![Python Version](https://img.shields.io/badge/Python_Version-3.10_|_3.11-informational?style=flat&logo=python&logoColor=white&color=11BB11)
[![LintJS](https://github.com/joshua-crews/ECF-System/actions/workflows/lintJS.yml/badge.svg)](https://github.com/joshua-crews/ECF-System/actions/workflows/lintJS.yml)
[![LintPy](https://github.com/joshua-crews/ECF-System/actions/workflows/lintPy.yml/badge.svg)](https://github.com/joshua-crews/ECF-System/actions/workflows/lintPy.yml)

# About
Here is the code for the demo of my MSc dissertation on the ECF System. The project specifications can be found below for the Extenuating Circumstances Form System (ECFSystem). In order to run the project, you will need the necessary node packages as well as a configured python environment from [requirements.txt](requirements.txt).

# Specifications
The University had a complicated system to deal with extenuating circumstances issues. It was originally based on paper and the current, partially on-line, system is not very usable by either staff or students.

This project consist in designing and building a prototype system that would overcome the current difficulties.

Students should be able to submit forms electronically, explaining the issues that have affected them (including the time frame), identify the modules affected and the outcome they request e.g. an extension on an assessment, no penalty for late submission, not assessed if they are never going to ba able to submit or will not attend an examination. They should also be able to describe general problems affecting their overall performance without identifying a problem with a particular module.

The system should allow students to attach evidence both when they submit the form initially or add it later.

Once the form has been submitted it should be passed (securely) to whoever needs to know and therefore is in a position to make a decision with some indication of the time-frame required for a decision. Extension requests have to be dealt with very quickly whereas a general problem may not need to be considered until the student's full set of marks are available at an examination board months later and the same form could contain both. Furthermore the same form may need to be directed to multiple departmental scrutiny committees.

The system will need to allow students to see the progress of their ECF through the approval system and staff to see what is awaiting decision. That means they need to be able to see what they need to deal with immediately under chairs action, at the next scrutiny committee, at the next examination board or at a final examination board.

The system should provide staff with all the relevant information about a student when making a decision because a student with chronic health issues or a learning support plan as result of a disability may not mention them in every ECF even though it can be helpful for the members of staff making the decision to know about.

Staff should be able to refer the form back to the student if it is unclear or the student needs to provide evidence by both email and by updating the system.

Finally any decision should be reported to the student both by email and by updating the status of the ECF on the system.

# Installation
For installing all the required libraries for this project, you will need to download and install:
- The current LTS version of [Node.js](https://nodejs.org/)
- A supported version of [Python](https://www.python.org/downloads/) (3.10+)
- [Postgresql](https://www.postgresql.org/)

Next, you can simply clone this repository to your local machine. From there, `npm install` will install all necessary node modules for the project.
It is also important to `pip install -r requirements_dev.txt` to install all python libraries including django.
Alternatively, you can choose to install each module by hand and all versioning can be found in [requirements_dev.txt](requirements_dev.txt) and [package.json](package.json).

# Running
## Local Machine Instructions
In order to run the project on your local machine, you will need to compile and run the project. If you are running it on a local machine and not a server or docker container, you will need to switch to debug mode in settings or else static files cannot be served.
### Front End
##### Execution
To run a live copy of the front end, it can be started with `npm run start`.
NOTE: This will only run the front end code and much of the functionality will be missing.
This is more of for development purposes.
### Back End
##### Database Setup
To run the complete web application, start your postgres database.
This will likely be done with [pgAdmin](https://www.pgadmin.org/docs/pgadmin4/6.18/getting_started.html).
Once you have a database, if necessary you can use django to migrate by running `python manage.py makemigrations` and then `python manage.py migrate`.
##### Environment Variables
From there, to run the webservice you will need a file named `.env`.
In the environment file, you will need to specify your database configuration as well as the django secret key to start the app.
The email app token will be needed for email sending as well as there needs to be specified allowed hosts for django to boot.
Once that is done, simply run `python manage.py runserver` and the web app will be hosted at a given port by django! :tada:
