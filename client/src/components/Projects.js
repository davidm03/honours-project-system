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
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = { supervisors: this.props.supervisors, searchText: "", redirect: null, sortBySupervisor: "", selectedProject: {}, selectedSupervisor: {}, expandProjectDialog: false }
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.setState({ searchText: document.getElementById('txtSearch').value });
    }
    handleSelectProject = () => {
        const user = this.props.user;
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
            _id: this.state.selectedProject._id,
            studentID: user.userId,
            available: false
        }).then(res => {
            if (res.data===true) {
                this.props.reloadProjects();
                this.setState({ redirect: 'my-project'});
            }
        })
    }
    render() { 
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        const projects = this.props.projects;
        const supervisors = this.state.supervisors;
        var projectDisplay = [];
        var supervisorMenuItems = [];

        if (supervisors.length > 0 && projects.length > 0) {
            var pushProject = false;    
            for (let index = 0; index < projects.length; index++) {
                const p = projects[index];
                var supervisor = this.state.supervisors.find(s => s._id === p.supervisorID);

                if (p.available) {
                    if (this.state.searchText) {
                        var match = false;
                        if (p.title.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1) {
                            match++;
                        }
                        else if (p.description.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1) {
                            match++;
                        }
                        else if (p.topic_area.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1) {
                            match++;
                        }
                        
                        if (match && !this.state.sortBySupervisor) {
                            pushProject++; 
                        }
                        else if (match && this.state.sortBySupervisor) {
                            if (supervisor._id === this.state.sortBySupervisor) {
                                pushProject++;
                            }
                        }
                    }
                    else if (this.state.sortBySupervisor) {
                        if (supervisor._id === this.state.sortBySupervisor) {
                        pushProject++; 
                        }                    
                    }
                    else {
                        pushProject++;
                    }
                
                    if (pushProject) {
                        projectDisplay.push(
                            <Card style={{ marginBottom: 15 }}>
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
                            <CardActions style={{ justifyContent: 'center' }}>
                                <Button 
                                variant="contained"
                                size="small" 
                                color="primary"
                                endIcon={<CheckCircleIcon/>}
                                onClick={()=>this.setState({ selectedProject: p, selectedSupervisor: supervisor, expandProjectDialog: true })}
                                >
                                    Select This Project
                                </Button>
                            </CardActions>
                            </Card>
                        ); 
                    }
                }
            }
            var len = supervisors.length, i=0;
            while (i < len) {
                const supervisor = supervisors[i];
                supervisorMenuItems.push(
                    <MenuItem value={supervisor._id}>{supervisor.first_name} {supervisor.surname}</MenuItem>
                );
                i++;
            }
        }
        return ( 
        <div>
            <h1>Honours Projects</h1>
            <p>Browse a selection of Honours Project topic ideas that have been put forward by supervisors and select a topic that you feel you would be able to successfully carry out and enjoy.</p>
            <Link to="/supervisors">
            <p>Want to select your own topic? Instead you can view all project supervisors and submit a supervision request.</p>
            </Link>
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
                <IconButton onClick={(e)=> {
                    e.preventDefault();
                    this.setState({ searchText: "" });
                    document.getElementById('txtSearch').value="";
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
            <Grid container style={{ marginBottom: 20 }}>
            <FormControl style={{ minWidth: 220 }}>
                <InputLabel>Sort By Supervisor</InputLabel>
                <Select
                id="selectSupervisor"
                value={this.state.sortBySupervisor}
                onChange={(e)=>this.setState({ sortBySupervisor: e.target.value })}
                >
                {supervisorMenuItems}
                </Select>
            </FormControl>
            {this.state.sortBySupervisor && (
                <IconButton style={{ marginTop: 10 }} onClick={()=> {
                    this.setState({ sortBySupervisor: "" });
                    document.getElementById('selectSupervisor').value="";
                }}>
                    <ClearIcon />
                </IconButton>
            )}
            </Grid>
            {projectDisplay}
            {projectDisplay.length === 0 && (
                <Alert variant="outlined" severity="info">
                    No Pre-Defined Projects Available Right Now - Check Back Later or Contact the Module Leader.
                </Alert>
            )}

                    <Dialog open={this.state.expandProjectDialog} onClose={()=>this.setState({ expandProjectDialog: false })}>
                        <DialogTitle id="form-dialog-title">Select Project</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Are you sure you want to select this project? 
                        </DialogContentText>
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
                        <Button onClick={()=>this.setState({ expandProjectDialog: false })} color="primary">
                            Cancel
                        </Button>
                        <Button color="primary" onClick={this.handleSelectProject}>
                            Select
                        </Button> 
                        </DialogActions>
                    </Dialog>
        </div>
        );
    }
}
 
export default Projects;