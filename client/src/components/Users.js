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

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            users:[], 
            selectedUsers: [],
            redirect: null
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
    handleUserFilter = (event) => {
        this.setState({ filterText: event.target.value });
    }
    handleViewUserClick = () => {
        this.setState({ redirect: "/view/user/" + this.state.selectedUsers.pop() });
    }
    componentDidMount() {
        this.loadUsers();
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        var users = this.state.users;
        const columns = [
            {field: 'id', headerName: 'ID', width: 250},
            {field: 'first_name', headerName: 'First Name', width: 150},
            {field: 'surname', headerName: 'Surname', width: 150},
            {field: 'email', headerName: 'Email', width: 170},
            {field: 'role', headerName: 'Role', width: 150},
            {field: 'last_login', headerName: 'Last Login', width: 150},
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
                       last_login: lastLogin,
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
                <Grid item xs={3}>
                    <AddUser loadUsers={this.loadUsers} setSuccess={(message)=>this.setState({successMessage: message})} />
                    <IconButton onClick={()=>{
                        this.loadUsers();
                        this.setState({ successMessage: "Users refreshed!" });
                    }}>
                        <RefreshIcon />
                    </IconButton>
                    {this.state.selectedUsers.length > 0 && (
                        <DeleteUsers 
                        loadUsers={this.loadUsers} 
                        selectedUsers={this.state.selectedUsers} 
                        setSuccess={(message)=>this.setState({successMessage: message})}
                        clearSelected={()=>this.setState({selectedUsers: []})}
                        />
                    )}
                </Grid>
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