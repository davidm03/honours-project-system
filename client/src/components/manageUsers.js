import React, { Component } from 'react';
import axios from 'axios';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            addUserDialog: false,
            addUserSelectedValue: "Supervisor", 
            addUserConfPasswordError: null,
        }
    }
    toggleAddUserDialog = () => {
        var dialog = this.state.addUserDialog;
        this.setState({ addUserDialog: !dialog }); 
    }
    handleAddNewUser = (event) => {
        event.preventDefault();
        var email = document.getElementById('addUserEmail').value;
        var firstName = document.getElementById('addUserFirstName').value;
        var surname = document.getElementById('addUserSurname').value;
        var password = document.getElementById('addUserPassword').value;
        var confPassword = document.getElementById('addUserConfPassword').value;
        var role = this.state.addUserSelectedValue.toUpperCase();
        if (role==="SUPERVISOR") var topicArea = document.getElementById('addUserTopicArea').value;
        if (role==="STUDENT") var studentID = document.getElementById('addUserStudentID').value;        

        if (password!==confPassword) {
            this.setState({ addUserConfPasswordError: "Passwords do not match." });
        }
        else {
            axios.post(process.env.REACT_APP_SERVER_URL + "users/register", {
                email: email,
                first_name: firstName,
                surname: surname,
                password: password,
                role: role,
                topic_area: topicArea,
                studentID: studentID
            })
            .then(res => {
                if (res.data===true) {
                    this.props.loadUsers();
                    this.toggleAddUserDialog();
                    this.props.setSuccess("Users successfully added.");
                }
                else if (res.data.error==="email") {
                    this.setState({ addUserEmailError: "Email address already in use." });
                }
                else {
                    this.toggleAddUserDialog();
                }
            })  
        }        
    }
    addUserChangeSelected = (event) => {
        this.setState({ addUserSelectedValue: event.target.value });
    }
    render() { 
        return ( 
                    <>
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={this.toggleAddUserDialog}
                    >
                    Add User
                    </Button>
                    <Dialog open={this.state.addUserDialog} onClose={this.toggleAddUserDialog}>
                        <DialogTitle id="form-dialog-title">Add User</DialogTitle>
                        <form onSubmit={this.handleAddNewUser}>
                        <DialogContent>
                        <DialogContentText>
                            Enter the details of the new user account you wish to add to the system.
                        </DialogContentText>
                        
                        <Radio
                            checked={this.state.addUserSelectedValue === 'Supervisor'}
                            onChange={this.addUserChangeSelected}
                            value="Supervisor"
                            name="radio-button-supervisor"
                            color="primary"
                        /> Supervisor
                        <Radio
                            checked={this.state.addUserSelectedValue === 'Student'}
                            onChange={this.addUserChangeSelected}
                            value="Student"
                            name="radio-button-student"
                            color="primary"
                        /> Student
                        <TextField
                            autoFocus
                            margin="dense"
                            id="addUserEmail"
                            label="Email Address"
                            type="email"
                            fullWidth
                            error={this.state.addUserEmailError}
                            helperText={this.state.addUserEmailError}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="addUserFirstName"
                            label="First Name"
                            style={{ width: "49%", marginRight: 10}}
                        />
                        <TextField
                            margin="dense"
                            id="addUserSurname"
                            label="Surname"
                            style={{width: "49%"}}
                        />
                        <TextField
                            margin="dense"
                            id="addUserPassword"
                            label="Password"
                            type="password"
                            fullWidth
                            error={this.state.addUserConfPasswordError}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="addUserConfPassword"
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            error={this.state.addUserConfPasswordError}
                            helperText={this.state.addUserConfPasswordError}
                            required
                        />
                        {this.state.addUserSelectedValue==="Supervisor" &&
                        <TextField
                            margin="dense"
                            id="addUserTopicArea"
                            label="Topic Area"
                            fullWidth
                        />
                        }                        
                        {this.state.addUserSelectedValue==="Student" &&
                            <TextField
                                margin="dense"
                                id="addUserStudentID"
                                label="Student ID"
                                fullWidth
                                required
                            />
                        }            
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.toggleAddUserDialog} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Add
                        </Button> 
                        </DialogActions>
                        </form>
                    </Dialog>
                    </>
         );
    }
}

class DeleteUsers extends Component {
    constructor(props) {
        super(props);
        this.state = { deleteUsersDialog: false }
    }
    handleDeleteUsers = () => {
        axios.post(process.env.REACT_APP_SERVER_URL + 'users/delete', { userIDs: this.props.selectedUsers })
        .then(res => {
            if (res.data===true) {
                this.props.loadUsers();
                this.toggleDeleteUsersDialog();
                this.props.clearSelected();
                this.props.setSuccess("Users successfully deleted.");
            }
            else {
                this.toggleDeleteUsersDialog();
            }
        });
    }
    toggleDeleteUsersDialog = () => {
        var dialog = this.state.deleteUsersDialog;
        this.setState({ deleteUsersDialog: !dialog });
    }
    render() { 
        return ( 
            <>
                <IconButton onClick={this.toggleDeleteUsersDialog}>
                    <DeleteIcon/>
                </IconButton>
                <Dialog
                 open={this.state.deleteUsersDialog}
                 onClose={this.toggleDeleteUsersDialog}
                 aria-labelledby="alert-dialog-title"
                 aria-describedby="alert-dialog-description"
                 > 
                <DialogTitle id="alert-dialog-title">{"Delete users?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete {this.props.selectedUsers.length} users from this application?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleDeleteUsersDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleDeleteUsers} color="primary" autoFocus>
                        Yes, I'm sure
                    </Button>
                </DialogActions>
                </Dialog>
            </>
        );
    }
}

export { AddUser, DeleteUsers };