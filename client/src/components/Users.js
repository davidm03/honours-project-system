/* 
    David McDowall - Honours Project
    Users.js component for displaying the users screen to the module leader and providing an interface to create, read, update and delete users
*/

import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import { AddUser, DeleteUsers } from "./manageUsers";

import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Button, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router-dom';

import { CSVLink } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';

/* Users component */
class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selectedUsers: [],
            redirect: null
        }
        this.loadData = this.props.reloadData.bind(this);
    }
    /* Function for loading users from the server */
    loadUsers = () => {
        // use axios to send GET request to the server for all users
        axios.get(process.env.REACT_APP_SERVER_URL + 'users')
            .then(res => {
                // if response contains data
                if (res.data) {
                    // store the users data in the state
                    this.setState({ users: res.data });
                }
            });
    }
    /* Function to handle user filter  */
    handleUserFilter = (event) => {
        // get the filter from the event source and update the state
        this.setState({ filterText: event.target.value });
    }
    /* Function for handling the user clicking on view user */
    handleViewUserClick = () => {
        // set the state to redirect user to the view user page
        this.setState({ redirect: "/view/user/" + this.state.selectedUsers.pop() });
    }
    /* ComponentDidMount method runs when the component has successfully mounted */
    componentDidMount() {
        // call load users method
        this.loadUsers();
    }
    /* Render method to process and display UI */
    render() {
        // if the page needs to redirect
        if (this.state.redirect) {
            // perform redirect
            return <Redirect to={this.state.redirect} />
        }

        // get users
        var users = this.state.users;
        // define datagrid columns
        const columns = [
            { field: 'id', headerName: 'ID', width: 250 },
            { field: 'first_name', headerName: 'First Name', width: 150 },
            { field: 'surname', headerName: 'Surname', width: 140 },
            { field: 'email', headerName: 'Email', width: 220 },
            { field: 'role', headerName: 'Role', width: 150 },
            { field: 'last_login', headerName: 'Last Login', width: 120 },
            // render cell used to display a view user button
            {
                field: "actions",
                headerName: 'Actions',
                width: 150,
                renderCell: () => (
                    <strong>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={this.handleViewUserClick}
                        >
                            View
                    </Button>
                    </strong>
                ),
            }
        ];
        // define array to hold datagrid rows
        const rows = [];
        // if users
        if (users.length > 0) {
            // loop through users
            for (let index = 0; index < users.length; index++) {
                // get the current user
                const user = users[index];
                // format the last login date
                var lastLogin = new Date(user.last_login * 1000).toLocaleDateString('en-GB');

                // check if the user has entered filter text
                if (this.state.filterText) {
                    // define variable to determine if a user match has been found
                    var matchFound = false;
                    // format users full name
                    var fullName = user.first_name + " " + user.surname;
                    // get the filter text 
                    const filter = this.state.filterText.toLowerCase();
                    // check if the user email contains the filter text
                    if (user.email.toLowerCase().indexOf(filter) > -1) {
                        matchFound = true;
                    }
                    // else check if the user fullname contains the filter text
                    else if (fullName.toLowerCase().indexOf(filter) > -1) {
                        matchFound = true;
                    }

                    // if a user match has been found 
                    if (matchFound) {
                        // add the user to the datagrid
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
                // else if no filter text has been entered
                else {
                    // add the user to the datagrid for display
                    rows.push({
                        id: user._id,
                        email: user.email,
                        first_name: user.first_name,
                        surname: user.surname,
                        role: user.role[0],
                        last_login: lastLogin,
                    });
                }
            }
        }
        // define CSV headers for download data
        const headers = [
            { label: "UserID", key: "id" },
            { label: "Email", key: "email" },
            { label: "First Name", key: "first_name" },
            { label: "Surname", key: "surname" },
            { label: "Role", key: "role" },
            { label: "Last Login", key: "last_login" }
        ];
        // return the user interface
        return (
            <>
                <h1>Manage Users</h1>
                <p>View all application users below, and perform actions such as updating or deleting user accounts.</p>
                <div style={{ paddingBottom: 15 }}>
                    <Grid container direction="row">
                        <Grid item xs={3}>
                            {/* Display interface for adding new users */}
                            <AddUser loadUsers={this.loadData} setSuccess={(message) => this.setState({ successMessage: message })} />
                            {/* Refresh icon button */}
                            <IconButton onClick={() => {
                                this.loadUsers();
                                this.setState({ successMessage: "Users refreshed!" });
                            }}>
                                <RefreshIcon />
                            </IconButton>
                            {/* CSV download link for exporting data */}
                            <CSVLink data={rows} headers={headers} filename="honours_users_export.csv">
                                <IconButton><GetAppIcon /></IconButton>
                            </CSVLink>
                            {/* If selected users - then display delete button */}
                            {this.state.selectedUsers.length > 0 && (
                                <DeleteUsers
                                    loadUsers={this.loadUsers}
                                    selectedUsers={this.state.selectedUsers}
                                    setSuccess={(message) => this.setState({ successMessage: message })}
                                    clearSelected={() => this.setState({ selectedUsers: [] })}
                                />
                            )}
                        </Grid>
                        {/* Search field */}
                        <Grid item xs={7}></Grid>
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
                                onChange={(e) => { this.setState({ filterText: e.target.value }); }}
                            />
                        </Grid>
                    </Grid>
                </div>
                {/* DataGrid for displaying users */}
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
                {/* Success/Error Messages */}
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
            </>
        );
    }
}

export default Users;