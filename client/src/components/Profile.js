/* 
    David McDowall - Honours Project
    Profile.js component for processing and displaying the user profile page with all profile information
*/

import React, { Component } from 'react';
import axios from 'axios';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

/* Profile component */
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { user: {}, loading: true }
    }
    /* Function for loading user data */
    loadUserData = () => {
        // use axios to send GET request to the server to get the data of the current user
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + this.props.user.userId).then(res => {
            // if response contains data
            if (res.data._id) {
                // store user data in the state
                this.setState({ user: res.data, loading: false });
            }
        })
    }
    /* ComponentDidMount method runs when the component has been successfully mounted */
    componentDidMount() {
        // call to load the user data 
        this.loadUserData();
    }
    /* Render method for processing and displaying the user interface */
    render() {
        // get the current user data and initialise display variables
        const user = this.state.user;
        var role = "";
        var lastLogin = "";
        var selectedProject = "No";
        var numRequests = 0;
        var numProjects = 0;
        // check if the page is loading
        if (this.state.loading) {
            // display loading screen
            return (
                <Backdrop open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        // else page has loaded
        else {
            //format last login data
            lastLogin = new Date(user.last_login * 1000).toLocaleDateString('en-GB');
            // if user is student
            if (user.role.includes("STUDENT")) {
                // set role display and check if student has project
                role = "Student";
                if (user.project) selectedProject = "Yes";
            }
            // else user is not a student
            else {
                // check the staff member role and set the label for display
                if (user.role.includes("MODULE_LEADER")) {
                    role = "Module Leader";
                }
                if (user.role.includes("SUPERVISOR")) {
                    role = "Supervisor";
                }
                if (user.role.includes("MODULE_LEADER") && user.role.includes("SUPERVISOR")) {
                    role = "Module Leader & Supervisor";
                }
            }
        }
        // return the user interface 
        return (
            <div>
                <h1>Profile</h1>
                <p>This is the information saved under your user profile. It may be displayed within certain areas of this application. </p>
                {/* Non-Editable text fields of user information */}
                <TextField
                    id="txtEmail"
                    label="Email"
                    defaultValue={user.email}
                    variant="outlined"
                    style={{ minWidth: 500, marginBottom: 20 }}
                    InputProps={{ readOnly: true }}
                /> <br />
                <TextField
                    id="txtFirstName"
                    label="First Name"
                    defaultValue={user.first_name}
                    variant="outlined"
                    style={{ minWidth: 500, marginBottom: 20, marginRight: 10 }}
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    id="txtSurname"
                    label="Surname"
                    defaultValue={user.surname}
                    variant="outlined"
                    style={{ minWidth: 500, marginBottom: 20 }}
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    id="txtRole"
                    label="Role"
                    defaultValue={role}
                    variant="outlined"
                    style={{ minWidth: 500, marginBottom: 20 }}
                    InputProps={{ readOnly: true }}
                /> <br />
                <TextField
                    id="txtLastLogin"
                    label="Last Login"
                    defaultValue={lastLogin}
                    variant="outlined"
                    style={{ minWidth: 500, marginBottom: 20 }}
                    InputProps={{ readOnly: true }}
                /> <br />
                {user.role.includes("STUDENT") ?
                    (
                        <>
                            <TextField
                                id="txtStudentID"
                                label="Student ID"
                                defaultValue={user.studentID}
                                variant="outlined"
                                style={{ minWidth: 500, marginBottom: 20 }}
                                InputProps={{ readOnly: true }}
                            /> <br />
                            <TextField
                                id="txtHasProject"
                                label="Project Selected?"
                                defaultValue={selectedProject}
                                variant="outlined"
                                style={{ minWidth: 500, marginBottom: 20 }}
                                InputProps={{ readOnly: true }}
                            /> <br />
                        </>
                    ) :
                    (
                        <>
                            <TextField
                                id="txtTopicArea"
                                label="Topic Area"
                                defaultValue={user.topic_area}
                                variant="outlined"
                                style={{ minWidth: 500, marginBottom: 20 }}
                                InputProps={{ readOnly: true }}
                            /> <br />
                            <TextField
                                id="txtRequests"
                                label="No. Supervision Requests"
                                defaultValue={numRequests}
                                variant="outlined"
                                style={{ minWidth: 500, marginRight: 10, marginBottom: 20 }}
                                InputProps={{ readOnly: true }}
                            />
                            <TextField
                                id="txtProjects"
                                label="No. Projects Supervising"
                                defaultValue={numProjects}
                                variant="outlined"
                                style={{ minWidth: 500 }}
                                InputProps={{ readOnly: true }}
                            />
                        </>
                    )}
            </div>
        );
    }
}

export default Profile;