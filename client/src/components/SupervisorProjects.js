/* 
    David McDowall - Honours Project
    SupervisorProjects.js component that displays the My Projects screen for all projects a supervisor is supervising. 
*/

import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { Backdrop, CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect } from 'react-router';

import { CSVLink } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';

/* SupervisorProjects component */
class SupervisorProjects extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedProjects: [], newProjectDialog: false, redirect: null, loading: true, projects: [], students: [] }
    }
    /* Function to handle adding a supervisor new pre-defined project */
    handleAddNewProject = (e) => {
        // prevent page reload
        e.preventDefault();
        // get the current user
        const user = this.props.data.user;
        // get pre-defined project info from text fields
        var title = document.getElementById('txtProjectTitle').value;
        var description = document.getElementById('txtProjectDescription').value;
        var topic_area = document.getElementById('txtTopicArea').value;
        // use axios to send POST request to the server to create a new pre-defined project
        axios.post(process.env.REACT_APP_SERVER_URL + "project/add", {
            title: title,
            description: description,
            topic_area: topic_area,
            available: true,
            supervisorID: user.userId,
            noStudent: true
        }).then(res => {
            // if response contains data
            if (res.data) {
                // reload projects
                this.props.reloadProjects();
            }
        })
    }
    /* Function for handling the deletion of projects */
    handleDeleteProjects = () => {
        // use axios to send POST request to the server to delete the selected projects
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/delete', { projectIDs: this.state.selectedProjects })
            .then(res => {
                // if success response
                if (res.data === true) {
                    // reload projects and clear the selected projects from state
                    this.props.reloadProjects();
                    this.setState({ selectedProjects: [] });
                }
            });
    }
    /* ComponentDidMount method runs when the component has successfully mounted */
    componentDidMount() {
        // if component props contain projects and students
        if (this.props.data.projects && this.props.data.students) {
            // store props in state and set loading to false
            this.setState({ projects: this.props.data.projects, students: this.props.data.students, loading: false });
        }
        else {
            // else just set loading false
            this.setState({ loading: false });
        }
    }
    /* Render method for processing and rendering the user interface */
    render() {
        // initialise arrays for storing data
        var projects = [], students = [];
        var columns1 = [], columns2 = [];
        var rows1 = [], rows2 = [];
        var headers = [];
        // check if page is redirecting
        if (this.state.redirect) {
            // perform redirect
            return <Redirect to={this.state.redirect} />
        }
        // check if the page is still loading
        if (this.state.loading) {
            // display loading screen
            return (
                <Backdrop open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        // else if the page has loaded
        else {
            // get the projects and students from state
            projects = this.state.projects;
            students = this.state.students;
            // set datagrid columns
            columns1 = [
                { field: 'id', headerName: 'ID', width: 250, hide: true },
                { field: 'title', headerName: 'Project Title', width: 300 },
                { field: 'description', headerName: 'Description', width: 650 },
                { field: 'topic_area', headerName: 'Topic Area', width: 230 }
            ];
            columns2 = [
                { field: 'id', headerName: 'ID', width: 250, hide: true },
                { field: 'title', headerName: 'Project Title', width: 500 },
                { field: 'status', headerName: 'Status', width: 300 },
                { field: 'student_name', headerName: 'Student', width: 300 },
                // final column uses render cell to render a view button inside datagrid
                {
                    field: "actions",
                    headerName: 'Actions',
                    width: 130,
                    renderCell: () => (
                        <strong>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => {
                                    var selectedID = this.state.selectedProjects.pop();
                                    this.setState({ redirect: "/supervisor/project/" + selectedID });
                                }}
                            >
                                View
                        </Button>
                        </strong>
                    ),
                }
            ];
            // if projects
            if (projects.length > 0) {
                // loop through projects
                var len = projects.length, i = 0;
                while (i < len) {
                    // get current project
                    const project = projects[i];
                    // check if project is available
                    if (project.available) {
                        // add the project to the pre-defined projects datagrid
                        rows1.push({
                            id: project._id,
                            title: project.title,
                            description: project.description,
                            topic_area: project.topic_area
                        });
                    }
                    // else project is not available - and is on-going project under supervision
                    else {
                        // find associated student and add project to projects under supervision datagrid
                        const student = students.find(s => s._id === project.studentID);
                        rows2.push({
                            id: project._id,
                            title: project.title,
                            status: project.status,
                            student_name: student.first_name + " " + student.surname,

                        });
                    }
                    i++;
                }
            }
            // set CSV download headers
            headers = [
                { label: "ProjectID", key: "id" },
                { label: "Project Title", key: "project" },
                { label: "Status", key: "status" },
                { label: "Student", key: "student_name" }
            ];
        }
        // return the user interface display
        return (
            <div>
                <h1>My Projects</h1>
                <p>View your available pre-defined projects that can be selected by students and all current on going projects you are supervising.</p>
                <h2>Available Pre-Defined Projects</h2>
                <p>Available projects that you have suggested for students to select for their honours project.</p>
                {/* Buttons for adding new pre-define project, refreshing projects and deleting projects */}
                <Grid container direction="row">
                    <Grid item>
                        <Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={() => this.setState({ newProjectDialog: true })}>New Project</Button>
                        <IconButton onClick={() => {
                            this.props.reloadProjects();
                        }}>
                            <RefreshIcon />
                        </IconButton>
                        {this.state.selectedProjects.length > 0 && (
                            <IconButton onClick={() => {
                                this.handleDeleteProjects();
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
                {/* Pre-defined project datagrid */}
                <div style={{ height: 300, width: '100%', marginTop: 15 }}>
                    <DataGrid
                        rows={rows1}
                        columns={columns1}
                        pageSize={5}
                        checkboxSelection
                        onSelectionChange={(newSelection) => {
                            this.setState({ selectedProjects: newSelection.rowIds });
                        }}
                    />

                    <h2>Projects Under Supervision</h2>
                    {/* Download data link for projects under supervision */}
                    {rows2.length > 0 && (
                        <Grid container justify="flex-end" style={{ marginBottom: 20 }}>
                            <CSVLink style={{ textDecoration: 'none' }} data={rows2} headers={headers} filename="honours_projects_export.csv">
                                <Button variant="contained" color="primary" endIcon={<GetAppIcon />}>Export Projects</Button>
                            </CSVLink>
                        </Grid>
                    )}
                    {/* On-going projects under supervision datagrid */}
                    <DataGrid
                        rows={rows2}
                        columns={columns2}
                        pageSize={5}
                        onSelectionChange={(newSelection) => {
                            this.setState({ selectedProjects: newSelection.rowIds });
                        }}
                    />

                    {/* Dialog for adding a new pre-defined project */}
                    <Dialog open={this.state.newProjectDialog} onClose={() => this.setState({ newProjectDialog: false })}>
                        <DialogTitle id="form-dialog-title">Add New Project</DialogTitle>
                        <form onSubmit={this.handleAddNewProject}>
                            <DialogContent>
                                <DialogContentText>
                                    Enter the details of the new pre-defined project you would like to add. <br /> <br />
                                    <b>Note: </b> This project/information will be visible to all students and available for selection under your supervison.
                        </DialogContentText>
                                {/* Text fields for project information */}
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="txtProjectTitle"
                                    label="Project Title"
                                    fullWidth
                                    required
                                />
                                <TextField
                                    id="txtProjectDescription"
                                    label="Description"
                                    required
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    style={{ marginTop: 15 }}
                                    fullWidth
                                />
                                <TextField
                                    margin="dense"
                                    id="txtTopicArea"
                                    label="Topic Area"
                                    fullWidth
                                    required
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.setState({ newProjectDialog: false })} color="primary">
                                    Cancel
                        </Button>
                                <Button type="submit" color="primary">
                                    Add
                        </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </div>
            </div>
        );
    }
}

export default SupervisorProjects;