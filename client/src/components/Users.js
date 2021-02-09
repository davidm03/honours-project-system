import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';

import SearchIcon from '@material-ui/icons/Search';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            users:[], 
            addUserDialog: false,
            deleteUsersDialog: false, 
            addUserSelectedValue: "Supervisor", 
            addUserConfPasswordError: null,
            selectedUsers: []
        }
    }
    loadUsers = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users')
        .then(res => {
            if (res.data) {
                this.setState({ users: res.data });
            }
        });
    }
    toggleAddUserDialog = () => {
        var dialog = this.state.addUserDialog;
        this.setState({ addUserDialog: !dialog }); 
    }
    toggleDeleteUsersDialog = () => {
        var dialog = this.state.deleteUsersDialog;
        this.setState({ deleteUsersDialog: !dialog });
    }
    addUserChangeSelected = (event) => {
        this.setState({ addUserSelectedValue: event.target.value });
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
                    this.loadUsers();
                    this.toggleAddUserDialog();
                    this.setState({ successMessage: "Users successfully added." });
                }
                else if (res.data.error==="email") {
                    this.setState({ addUserEmailError: "Email address already in use." });
                }
                else {
                    this.toggleDeleteUsersDialog();
                    this.setState({ errorMessage: "Error: Users could not be added." });
                }
            })  
        }        
    }
    handleUserFilter = (event) => {
        this.setState({ filterText: event.target.value });
    }
    handleDeleteUsers = () => {
        axios.post(process.env.REACT_APP_SERVER_URL + 'users/delete', { userIDs: this.state.selectedUsers })
        .then(res => {
            if (res.data===true) {
                this.loadUsers();
                this.toggleDeleteUsersDialog();
                this.setState({ selectedUsers: [], successMessage: "Users successfully deleted." });
            }
            else {
                this.toggleDeleteUsersDialog();
                this.setState({ errorMessage: "Error: Users could not be deleted." });
            }
        });
    }
    componentDidMount() {
        this.loadUsers();
    }
    render() {
        var users = this.state.users;
        const columns = [
            {field: 'id', headerName: 'ID', width: 250},
            {field: 'first_name', headerName: 'First Name', width: 150},
            {field: 'surname', headerName: 'Surname', width: 150},
            {field: 'email', headerName: 'Email', width: 170},
            {field: 'role', headerName: 'Role', width: 150},
            {field: 'last_login', headerName: 'Last Login', width: 150},
            {field: 'actions', headerName: 'Actions', width: 150}
        ];
        const rows = [];
        if (users.length>0) {
            for (let index = 0; index < users.length; index++) {
                const user = users[index];
                var lastLogin = new Date(user.last_login * 1000).toLocaleDateString('en-GB');
                if (this.state.filterText) {
                    var matchFound = false;
                    var fullName = user.first_name + " " + user.surname;
                    if (user.email.indexOf(this.state.filterText) > -1) {
                        matchFound = true;
                    }
                    else if (fullName.indexOf(this.state.filterText) > -1) {
                        matchFound = true;
                    }

                    if (matchFound) {
                        rows.push({ 
                            id: user._id, 
                            email: user.email, 
                            first_name: user.first_name, 
                            surname: user.surname, 
                            role: user.role[0] ,
                            last_login: lastLogin
                        }); 
                    }
                }
                else {
                   rows.push({ 
                       id: user._id, 
                       email: user.email, 
                       first_name: user.first_name, 
                       surname: user.surname, 
                       role: user.role[0], 
                       last_login: lastLogin
                    });   
                }                              
            }
        }
        return ( 
        <>
            <h1>Manage Users</h1>
            <p>View all application users below, and perform actions such as updating or deleting user accounts.</p>
            <div style={{ paddingBottom: 15 }}>
            <Grid container direction="row">
                <Grid item xs>
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={this.toggleAddUserDialog}
                    >
                    Add User
                    </Button>
                    {this.state.selectedUsers.length > 0 && (
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
                            Are you sure you want to delete {this.state.selectedUsers.length} users from this application?
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
                    )}
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
                </Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs>
                    <TextField
                    id="input-with-icon-textfield"
                    label="Search by name, email or ID"
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <SearchIcon />
                        </InputAdornment>
                    ),
                    }}
                    onChange={(e)=>{this.setState({ filterText: e.target.value });}}
                    />
                </Grid>
            </Grid>
            </div>
            <div style={{ height: 700, width: '100%' }}>
                <DataGrid 
                rows={rows} 
                columns={columns} 
                pageSize={10} 
                checkboxSelection 
                onSelectionChange={(newSelection) => { 
                    this.setState({ selectedUsers: newSelection.rowIds });
                }}
                />
            </div>
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
        </> 
        );
    }
}
 
export default Users;