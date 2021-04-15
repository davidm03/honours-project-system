/* 
    David McDowall - Honours Project
    ViewUser.js component for displaying an interface to the module leader for viewing a users details
*/

import React, { Component } from 'react';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { Button, Grid } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import EditIcon from '@material-ui/icons/Edit';
import RestoreIcon from '@material-ui/icons/Restore';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

/* ViewUser component */
class ViewUser extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, user: null, selectedRole: "" }
    }
    /* Function for loading user data */
    loadUserData = () => {
        // get the user id from props
        var id = this.props.id;
        // use axios to send GET request to the server to get the user info
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + id)
            .then(res => {
                // if user response
                if (res.data.email) {
                    // store the user data in the data and stop loading data
                    this.setState({ loading: false, user: res.data, updateButton: false, selectedRole: res.data.role[0] });
                }
            });
    }
    /* Function for handling the updating of user information */
    handleUpdateUser = (e) => {
        // prevent the page from reloading
        e.preventDefault();
        // get the new user information from the UI
        var email = document.getElementById('txtEmail').value;
        var firstName = document.getElementById('txtFirstName').value;
        var surname = document.getElementById('txtSurname').value;
        var role = [this.state.selectedRole];
        var studentID = "";
        var topicArea = "";
        if (this.state.user.role.includes("STUDENT")) {
            studentID = document.getElementById('txtStudentID').value;
        }
        else {
            topicArea = document.getElementById('txtTopicArea').value;
        }

        // use axios to send a POST request to the server to update the user with the new information
        axios.post(process.env.REACT_APP_SERVER_URL + "users/update", {
            _id: this.props.id,
            email: email,
            first_name: firstName,
            surname: surname,
            role: role,
            topic_area: topicArea,
            studentID: studentID
        })
            .then(res => {
                // if success response
                if (res.data === true) {
                    // reload the user data and set success message in the state
                    this.loadUserData();
                    this.setState({ successMessage: "User successfully updated.", updateButton: false });
                }
            })
    }
    /* Function for reverting any changes to the users information */
    revertChanges = () => {
        // set the page to load data and reload user data to restore data
        this.setState({ loading: true });
        this.loadUserData();
    }
    /* ComponentDidMount method runs when the component has successfully mounted */
    componentDidMount() {
        // call to load user data
        this.loadUserData();
    }
    /* Render method to process and display UI */
    render() {
        // check if the page is still loading
        if (this.state.loading) {
            // return loading screen
            return (
                <Backdrop open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        // else if the page has loaded
        else {
            // return the UI
            return (
                <div>
                    <h1>User Profile</h1>
                    <h2>{this.state.user.first_name} {this.state.user.surname}</h2>
                    {/* HTML form for updating the user data */}
                    <form onSubmit={this.handleUpdateUser}>
                        {/* Text fields for user data */}
                        <TextField
                            id="txtEmail"
                            label="Email"
                            style={{ margin: 8 }}
                            defaultValue={this.state.user.email}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={() => { this.setState({ updateButton: true }) }}
                        />
                        <TextField
                            id="txtFirstName"
                            label="First Name"
                            style={{ margin: 8 }}
                            defaultValue={this.state.user.first_name}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={() => { this.setState({ updateButton: true }) }}
                        />
                        <TextField
                            id="txtSurname"
                            label="Surname"
                            style={{ margin: 8 }}
                            defaultValue={this.state.user.surname}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={() => { this.setState({ updateButton: true }) }}
                        />
                        <div style={{ margin: 8 }}>
                            <InputLabel shrink htmlFor="age-native-simple">Role</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="selectRole"
                                value={this.state.selectedRole}
                                onChange={(e) => { this.setState({ selectedRole: e.target.value, updateButton: true }) }}
                            >
                                <MenuItem value={"STUDENT"}>Student</MenuItem>
                                <MenuItem value={"SUPERVISOR"}>Supervisor</MenuItem>
                            </Select>
                        </div>
                        <TextField
                            id="txtLastLogin"
                            label="Last Login"
                            style={{ margin: 8 }}
                            defaultValue={new Date(this.state.user.last_login * 1000)}
                            fullWidth
                            disabled
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {this.state.user.topic_area &&
                            <TextField
                                id="txtTopicArea"
                                label="Topic Area"
                                style={{ margin: 8 }}
                                defaultValue={this.state.user.topic_area}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={() => { this.setState({ updateButton: true }) }}
                            />
                        }
                        {this.state.user.studentID &&
                            <TextField
                                id="txtStudentID"
                                label="Student ID"
                                style={{ margin: 8 }}
                                defaultValue={this.state.user.studentID}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={() => { this.setState({ updateButton: true }) }}
                            />
                        }
                        {this.state.updateButton &&
                            <Grid container direction="row">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<RestoreIcon />}
                                    style={{ margin: 8 }}
                                    onClick={this.revertChanges}
                                >
                                    Revert Changes
                    </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    type="submit"
                                    style={{ margin: 8 }}
                                >
                                    Update
                    </Button>
                            </Grid>
                        }
                    </form>
                    {/* Success/Error messages */}
                    <Snackbar open={this.state.successMessage} autoHideDuration={6000} onClose={() => { this.setState({ successMessage: null }); }}>
                        <Alert onClose={() => { this.setState({ successMessage: null }); }} severity="success">
                            {this.state.successMessage}
                        </Alert>
                    </Snackbar>
                    <Snackbar open={this.state.errorMessage} autoHideDuration={6000} onClose={() => { this.setState({ errorMessage: null }); }}>
                        <Alert onClose={() => { this.setState({ errorMessage: null }); }} severity="error">
                            {this.state.errorMessage}
                        </Alert>
                    </Snackbar>
                </div>
            );
        }
    }
}

export default ViewUser;