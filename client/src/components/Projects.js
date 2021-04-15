/* 
    David McDowall - Honours Project
    Projects.js component which processes and displays the projects screen where users can browse and select pre-defined projects
*/

import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { Grid, Typography } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import TitleIcon from '@material-ui/icons/Title';
import DescriptionIcon from '@material-ui/icons/Description';
import CategoryIcon from '@material-ui/icons/Category';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core/';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

/* Projects component */
class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supervisors: this.props.supervisors,    // colleciton of supervisors
            searchText: "", // initial search text
            redirect: null, // null redirect
            sortBySupervisor: "",   // initial sort by supervisor
            selectedProject: {},    // selected project
            selectedSupervisor: {}, // selected supervisor
            expandProjectDialog: false  // expand project dialog
        }
    }
    /*  Function to handle a user searching the list of projects */
    handleSearch = (e) => {
        // prevent page reload
        e.preventDefault();
        // store the search text in the state
        this.setState({ searchText: document.getElementById('txtSearch').value });
    }
    /* Function to handle a user selecting a project for their honours project */
    handleSelectProject = () => {
        // get the current user
        const user = this.props.user;
        // use axios to send a POST request to the server to update a project
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
            _id: this.state.selectedProject._id,
            studentID: user.userId, // selected project is updated with the selecting students ID
            available: false,
            status: "Project Initiated"
        }).then(res => {
            // if response success
            if (res.data === true) {
                // reload projects and redirect the user to the my project page
                this.props.reloadProjects();
                this.setState({ redirect: 'my-project' });
            }
        });
    }
    /* Render method for processing and rendering the UI */
    render() {
        // check if the page is redirecting
        if (this.state.redirect) {
            // redirect user
            return <Redirect to={this.state.redirect} />
        }
        // get projects and supervisors
        const projects = this.props.projects;
        const supervisors = this.state.supervisors;
        var projectDisplay = [];
        var supervisorMenuItems = [];

        // if there are supervisors and projects
        if (supervisors.length > 0 && projects.length > 0) {
            // loop through projects
            for (let index = 0; index < projects.length; index++) {
                var pushProject = false;
                // get current project and supervisor
                const p = projects[index];
                var supervisor = this.state.supervisors.find(s => s._id === p.supervisorID);

                // if the project is available
                if (p.available) {
                    // check if the user has entered search text
                    if (this.state.searchText) {
                        // variable to determine if the project matches the search text
                        var match = false;
                        // check if title matches
                        if (p.title.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1) {
                            match++;
                        }
                        // check if description matches
                        else if (p.description.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1) {
                            match++;
                        }
                        // check if topic area matches
                        else if (p.topic_area.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1) {
                            match++;
                        }

                        // if match has been found and the user is not sorting by supervisor
                        if (match && !this.state.sortBySupervisor) {
                            // add project for display
                            pushProject++;
                        }
                        // else if match has been found and user is sorting by supervisor
                        else if (match && this.state.sortBySupervisor) {
                            // check if supervisor matches the sort and add the project for display
                            if (supervisor._id === this.state.sortBySupervisor) {
                                pushProject++;
                            }
                        }
                    }
                    // else if the user is sorting the display by supervisor
                    else if (this.state.sortBySupervisor) {
                        // check if the supervisor matches the sort and add the project for display
                        if (supervisor._id === this.state.sortBySupervisor) {
                            pushProject++;
                        }
                    }
                    // else there is no search text or supervisor sort - add the project for display
                    else {
                        pushProject++;
                    }

                    // if the project should be added to display - create card element and add it to project collection
                    if (pushProject) {
                        projectDisplay.push(
                            <Card style={{ marginBottom: 15 }}>
                                {/* Project information */}
                                <CardContent>
                                    <Typography variant="h6" gutterBottom style={{ textAlign: 'center' }}>{p.title}</Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <DescriptionIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Description"
                                            /> {p.description}
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CategoryIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Topic Area"
                                            /> {p.topic_area}
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <SupervisorAccountIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Supervisor"
                                            /> {supervisor.first_name} {supervisor.surname}
                                        </ListItem>
                                    </List>
                                </CardContent>
                                {/* Select project button
                                    Will only be displayed to students who do not have a project
                                */}
                                {this.props.user.role.includes("STUDENT") && !projects.find(p => p.studentID === this.props.user.userId) &&
                                    <CardActions style={{ justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            endIcon={<CheckCircleIcon />}
                                            onClick={() => {
                                                var s = this.state.supervisors.find(s => s._id === p.supervisorID);
                                                this.setState({ selectedProject: p, selectedSupervisor: s, expandProjectDialog: true });
                                            }
                                            }
                                        >
                                            Select This Project
                                </Button>
                                    </CardActions>
                                }
                            </Card >
                        );
                    }
                }
            }
            // loop through supervisors and add each supervisor to the sort dropdown
            var len = supervisors.length, i = 0;
            while (i < len) {
                const supervisor = supervisors[i];
                supervisorMenuItems.push(
                    <MenuItem value={supervisor._id}>{supervisor.first_name} {supervisor.surname}</MenuItem>
                );
                i++;
            }
        }
        // return the user interface for display
        return (
            <div>
                <h1>Honours Projects</h1>
                <p>Browse a selection of Honours Project topic ideas that have been put forward by supervisors and select a topic that you feel you would be able to successfully carry out and enjoy.</p>
                <Link to="/supervisors">
                    <p>Want to select your own topic? Instead you can view all project supervisors and submit a supervision request.</p>
                </Link>
                {/* Search form */}
                <Grid container justify="center">
                    <Paper component="form" onSubmit={this.handleSearch} style={{ padding: '2px 4px', display: 'flex', alignItems: 'center', width: 600, marginBottom: 15 }}>
                        <InputBase
                            id="txtSearch"
                            style={{ flex: 1 }}
                            placeholder="Search Honours Projects"
                            inputProps={{ 'aria-label': 'search honours projects' }}
                        />
                        {this.state.searchText
                            ? (
                                <IconButton onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ searchText: "" });
                                    document.getElementById('txtSearch').value = "";
                                }}>
                                    <ClearIcon />
                                </IconButton>
                            )
                            : (
                                <IconButton type="submit" aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            )
                        }

                    </Paper>
                </Grid>
                {/* Sort by supervisor dropdown */}
                <Grid container style={{ marginBottom: 20 }}>
                    <FormControl style={{ minWidth: 220 }}>
                        <InputLabel>Sort By Supervisor</InputLabel>
                        <Select
                            id="selectSupervisor"
                            value={this.state.sortBySupervisor}
                            onChange={(e) => this.setState({ sortBySupervisor: e.target.value })}
                        >
                            {supervisorMenuItems}
                        </Select>
                    </FormControl>
                    {this.state.sortBySupervisor && (
                        <IconButton style={{ marginTop: 10 }} onClick={() => {
                            this.setState({ sortBySupervisor: "" });
                            document.getElementById('selectSupervisor').value = "";
                        }}>
                            <ClearIcon />
                        </IconButton>
                    )}
                </Grid>
                {/* Project displays */}
                { projectDisplay}
                {/* Error message for no projects found */}
                {
                    projectDisplay.length === 0 && (
                        <Alert variant="outlined" severity="info">
                            No Pre-Defined Projects Available Right Now - Check Back Later or Contact the Module Leader.
                        </Alert>
                    )
                }

                {/* Dialog for selecting a project */}
                <Dialog open={this.state.expandProjectDialog} onClose={() => this.setState({ expandProjectDialog: false })}>
                    <DialogTitle id="form-dialog-title">Select Project</DialogTitle>
                    {/* Confirmation message */}
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to select this project?
                        </DialogContentText>
                        {/* Project information */}
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <TitleIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Title"
                                    secondary={this.state.selectedProject.title}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <DescriptionIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Description"
                                    secondary={this.state.selectedProject.description}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Topic Area"
                                    secondary={this.state.selectedProject.topic_area}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <SupervisorAccountIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Supervisor"
                                    secondary={this.state.selectedSupervisor.first_name + " " + this.state.selectedSupervisor.surname}
                                />
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ expandProjectDialog: false })} color="primary">
                            Cancel
                        </Button>
                        <Button color="primary" onClick={this.handleSelectProject}>
                            Select
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}

export default Projects;