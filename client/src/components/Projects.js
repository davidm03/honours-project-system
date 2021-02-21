import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { Grid } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = { supervisors:[], searchText: "", redirect: null }
    }
    loadSupervisors = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/supervisors')
        .then(res => {
            if (res.data.length>0) {
                this.setState({ supervisors: res.data });
            }
        });
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.setState({ searchText: document.getElementById('txtSearch').value });
    }
    componentDidMount() {
        this.loadSupervisors();
    }
    render() { 
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        const projects = this.props.projects;
        const supervisors = this.state.supervisors;
        var projectDisplay = [];

        if (supervisors.length > 0 && projects.length > 0) {    
            for (let index = 0; index < projects.length; index++) {
                const p = projects[index];
                var supervisor = this.state.supervisors.find(s => s._id === p.supervisorID);

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
                    
                    if (match) {
                        projectDisplay.push(
                            <Card style={{ marginBottom: 15 }}>
                            <CardContent>
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            <p>
                                Topic Area: {p.topic_area} <br/>
                                Supervisor: {supervisor.first_name} {supervisor.surname}
                            </p>
                            </CardContent>
                            <CardActions>
                                <Button 
                                size="small" 
                                color="primary"
                                onClick={() => {this.setState({ redirect: "project/" + p._id })}}
                                >
                                    View Project
                                </Button>
                            </CardActions>
                            </Card>
                        ); 
                    }
                }
                else {
                    projectDisplay.push(
                        <Card style={{ marginBottom: 15 }}>
                        <CardContent>
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>
                        <p>
                            Topic Area: {p.topic_area} <br/>
                            Supervisor: {supervisor.first_name} {supervisor.surname}
                        </p>
                        </CardContent>
                        <CardActions>
                            <Button 
                                size="small" 
                                color="primary"
                                onClick={() => {this.setState({ redirect: "project/" + p._id })}}
                            >
                                View Project
                            </Button>
                        </CardActions>
                        </Card>
                    );
                }
                
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
            <IconButton type="submit" aria-label="search">
                <SearchIcon />
            </IconButton>
            </Paper>
            </Grid>
            {projectDisplay}
        </div>
        );
    }
}
 
export default Projects;