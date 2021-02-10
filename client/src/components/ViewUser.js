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

class ViewUser extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, user: null, selectedRole: "" }
    }
    loadUserData = () => {
        var id = this.props.id;
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + id)
        .then(res => {
            if (res.data.email) {
                this.setState({ loading: false, user: res.data, updateButton: false, selectedRole: res.data.role[0] });
            }
        });
    }
    handleUpdateUser = (e) => {
        e.preventDefault();
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
            if (res.data===true) {
                this.loadUserData();
                this.setState({ successMessage: "User successfully updated.", updateButton: false });
            }
        })
    }
    revertChanges = () => {
        document.getElementById('txtEmail').value = this.state.user.email;
        document.getElementById('txtFirstName').value = this.state.user.first_name;
        document.getElementById('txtSurname').value = this.state.user.surname;
        this.state.selectedRole = this.state.user.role[0];
        if (this.state.user.role.includes("STUDENT")) {
           document.getElementById('txtStudentID').value = this.state.user.studentID; 
        }
        else {
           document.getElementById('txtTopicArea').value = this.state.user.topic_area; 
        }
        this.setState({ updateButton: false });      
    }
    componentDidMount() {
        this.loadUserData();
    }
    render() { 
        if (this.state.loading) {
            return 'loading';
        }
        else {
            return (
                <div>
                    <h1>User Profile</h1>
                    <h2>{this.state.user.first_name} {this.state.user.surname}</h2>
                    <form onSubmit={this.handleUpdateUser}>
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
                    onChange={()=>{this.setState({ updateButton: true })}}
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
                    onChange={()=>{this.setState({ updateButton: true })}}
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
                    onChange={()=>{this.setState({ updateButton: true })}}
                    />
                    <div style={{margin: 8}}>
                    <InputLabel shrink htmlFor="age-native-simple">Role</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="selectRole"
                    value={this.state.selectedRole}
                    onChange={(e)=>{this.setState({ selectedRole: e.target.value, updateButton: true })}}
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
                    onChange={()=>{this.setState({ updateButton: true })}}
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
                    onChange={()=>{this.setState({ updateButton: true })}}
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
                    <Snackbar open={this.state.successMessage} autoHideDuration={6000} onClose={()=>{this.setState({ successMessage: null });}}>
                        <Alert onClose={()=>{this.setState({ successMessage: null });}} severity="success">
                        {this.state.successMessage}
                        </Alert>
                    </Snackbar>
                    <Snackbar open={this.state.errorMessage} autoHideDuration={6000} onClose={()=>{this.setState({ errorMessage: null });}}>
                        <Alert onClose={()=>{this.setState({ errorMessage: null });}} severity="error">
                        {this.state.errorMessage}
                        </Alert>
                    </Snackbar>
                </div>
            );
        }
    }
}
 
export default ViewUser;