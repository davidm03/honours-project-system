/* 
    David McDowall - Honours Project
    AdminProjects.js component handles the display and logic behind the Projects page (Admin/Module Leader Access)
*/

import React, { Component } from 'react';

import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Button, IconButton } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { DataGrid } from '@material-ui/data-grid';
import { Redirect } from 'react-router-dom';

import { AddProject, DeleteProjects } from "./manageProjects";

import { CSVLink } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';

/* AdminProjects component */
class AdminProjects extends Component {
    constructor(props) {
        super(props);
        // set the state upon component load - stores global variables used throughout the page
        this.state = { projects: this.props.data.projects, redirect: null, successMessage: null, errorMessage: null, selectedProjects: [], supervisors: this.props.data.supervisors }
    }
    /* Function for handling a user clicking to view a project */
    handleViewProjectClick = () => {
        // set the redirect to the view project page with the selected project ID
        this.setState({ redirect: "/view/project/" + this.state.selectedProjects.pop() });
    }
    /* Render method */
    render() {
        // Check for redirects from this page
        if (this.state.redirect) {
            // return redirect to new page
            return <Redirect to={this.state.redirect} />
        }

        // define projects and DataGrid columns
        const projects = this.state.projects;
        const columns = [
            { field: 'id', headerName: 'ID', width: 230 },
            { field: 'title', headerName: 'Title', width: 220 },
            { field: 'topic_area', headerName: 'Topic Area', width: 200 },
            { field: 'available', headerName: 'Available', width: 150 },
            { field: 'supervisorID', headerName: 'Supervisor', width: 220 },
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
        // define DataGrid rows
        const rows = [];
        // if there are projects
        if (projects.length > 0) {
            // loop through projects
            for (let index = 0; index < projects.length; index++) {
                // get current project
                const project = projects[index];

                // check if the user has entered any filter text
                if (this.state.filterText) {
                    var matchFound = false;
                    // check if the title matches filter text
                    if (project.title.toLowerCase().indexOf(this.state.filterText.toLowerCase()) > -1) {
                        matchFound = true;
                    }
                    // check if topic area matches filter text
                    else if (project.topic_area.toLowerCase().indexOf(this.state.filterText.toLowerCase()) > -1) {
                        matchFound = true;
                    }

                    // if project matches filter text - add to the DataGrid for display
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
                // else - NO FILTER TEXT - add current project to DataGrid for display
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
        // define CSV download headers
        const headers = [
            { label: "ProjectID", key: "id" },
            { label: "Title", key: "title" },
            { label: "Topic Area", key: "topic_area" },
            { label: "Project Available?", key: "available" },
            { label: "SupervisorID", key: "supervisorID" }
        ];
        /* Return method for displaying elements on screen 
            Displays all of the projects within the system inside a DataGrid component that the user can manipulate.
            Page also contains buttons to add, view, search or delete projects
        */
        return (
            <div>
                <h1>Manage Projects</h1>
                <p>View or manage all of the pre-defined projects that students can browse and select from and ongoing student projects. Add, view, update and delete projects from here. </p>
                <div style={{ paddingBottom: 15 }}>
                    <Grid container direction="row">
                        <Grid item xs={3}>
                            <AddProject
                                loadProjects={this.props.loadProjects}
                                supervisors={this.state.supervisors} />
                            <IconButton onClick={() => {
                                this.props.loadProjects();
                                this.setState({ successMessage: "Projects refreshed!" });
                            }}>
                                <RefreshIcon />
                            </IconButton>
                            <CSVLink data={rows} headers={headers} filename="honours_projects_export.csv">
                                <IconButton><GetAppIcon /></IconButton>
                            </CSVLink>
                            {this.state.selectedProjects.length > 0 && (
                                <DeleteProjects
                                    loadProjects={this.props.loadProjects}
                                    selectedProjects={this.state.selectedProjects}
                                    clearSelected={() => this.setState({ selectedProjects: [] })}
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
                                onChange={(e) => { this.setState({ filterText: e.target.value }); }}
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
            </div>
        );
    }
}

export default AdminProjects;