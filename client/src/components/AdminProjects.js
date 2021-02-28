import React, { Component } from 'react';
import axios from 'axios';

import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Button, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { DataGrid } from '@material-ui/data-grid';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router-dom';

import { AddProject, DeleteProjects } from "./manageProjects";

class AdminProjects extends Component {
    constructor(props) {
        super(props);
        this.state = { projects: this.props.data.projects, redirect: null, successMessage: null, errorMessage: null, selectedProjects: [], supervisors: this.props.data.supervisors }
    }
    handleViewProjectClick = () => {
        this.setState({ redirect: "/view/project/" + this.state.selectedProjects.pop() });
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const projects = this.state.projects;
        const columns = [
            {field: 'id', headerName: 'ID', width: 230},
            {field: 'title', headerName: 'Title', width: 220},
            {field: 'topic_area', headerName: 'Topic Area', width: 200},
            {field: 'available', headerName: 'Available', width: 150},
            {field: 'supervisorID', headerName: 'Supervisor', width: 220},
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
                      onClick={this.handleViewProjectClick}
                    >
                      View
                    </Button>
                  </strong>
                ),
            }
        ];
        const rows = [];
        if (projects.length>0) {
            for (let index = 0; index < projects.length; index++) {
                const project = projects[index];

                if (this.state.filterText) {
                    var matchFound = false;
                    if (project.title.toLowerCase().indexOf(this.state.filterText.toLowerCase()) > -1) {
                        matchFound = true;
                    }
                    else if (project.topic_area.toLowerCase().indexOf(this.state.filterText.toLowerCase()) > -1) {
                        matchFound = true;
                    }

                    if (matchFound) {
                        rows.push({ 
                            id: project._id, 
                            title: project.title,
                            topic_area: project.topic_area,
                            available: project.available,
                            supervisorID: project.supervisorID
                        }); 
                    }
                }
                else {
                    rows.push({ 
                        id: project._id, 
                        title: project.title,
                        topic_area: project.topic_area,
                        available: project.available,
                        supervisorID: project.supervisorID
                    }); 
                }                              
            }
        } 
        return ( 
        <div>
            <h1>Manage Projects</h1>
            <p>View or manage all of the pre-defined projects that students can browse and select from and ongoing student projects. Add, view, update and delete projects from here. </p>
            <div style={{ paddingBottom: 15 }}>
            <Grid container direction="row">
                <Grid item xs={3}>
                    <AddProject 
                    loadProjects={this.loadProjects} 
                    setSuccess={(message)=>this.setState({successMessage: message})} 
                    setError={(message)=>this.setState({errorMessage: message})} 
                    supervisors={this.state.supervisors} />
                    <IconButton onClick={()=>{
                        this.loadProjects();
                        this.setState({ successMessage: "Projects refreshed!" });
                    }}>
                        <RefreshIcon />
                    </IconButton>
                    {this.state.selectedProjects.length > 0 && (
                        <DeleteProjects 
                        loadProjects={this.loadProjects} 
                        selectedProjects={this.state.selectedProjects} 
                        setSuccess={(message)=>this.setState({successMessage: message})}
                        clearSelected={()=>this.setState({selectedProjects: []})}
                        />
                    )}
                </Grid>
                <Grid item xs={7}></Grid>
                <Grid item xs>
                    <TextField
                    id="input-with-icon-textfield"
                    label="Search by title, desc or topic"
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
                    this.setState({ selectedProjects: newSelection.rowIds });
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
        </div> 
        );
    }
}
 
export default AdminProjects;