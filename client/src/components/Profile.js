import React, { Component, useReducer } from 'react';
import axios from 'axios';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { user: {}, loading: true }
    }
    loadUserData = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + this.props.user.userId).then(res => {
            if (res.data._id) {
                this.setState({ user: res.data, loading: false });
            }
        })
    }
    componentDidMount() {
        this.loadUserData();
    }
    render() {
        const user = this.state.user;
        var role = "";
        var lastLogin = "";
        var selectedProject = "No";
        var numRequests = 0;
        var numProjects = 0;
        if (this.state.loading) {
            return (
            <Backdrop open={true}>
                    <CircularProgress color="inherit" />
            </Backdrop>
            );
        }
        else {
            lastLogin = new Date(user.last_login * 1000).toLocaleDateString('en-GB');
            if (user.role.includes("STUDENT")) {
                role = "Student";
                if (user.project) selectedProject = "Yes";
            }
            else {
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
        return ( 
            <div>
                <h1>Profile</h1>
                <p>This is the information saved under your user profile. It may be displayed within certain areas of this application. </p>
                <TextField
                id="txtEmail"
                label="Email"
                defaultValue={user.email}
                variant="outlined"
                style={{ minWidth: 500, marginBottom: 20 }}
                InputProps={{ readOnly: true }}
                /> <br/>
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
                /> <br/>
                <TextField
                id="txtLastLogin"
                label="Last Login"
                defaultValue={lastLogin}
                variant="outlined"
                style={{ minWidth: 500, marginBottom: 20 }}
                InputProps={{ readOnly: true }}
                /> <br/>
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
                /> <br/>
                <TextField
                id="txtHasProject"
                label="Project Selected?"
                defaultValue={selectedProject}
                variant="outlined"
                style={{ minWidth: 500, marginBottom: 20 }}
                InputProps={{ readOnly: true }}
                /> <br/>
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
                /> <br/>
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