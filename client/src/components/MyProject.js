import React, { Component } from 'react';
import axios from 'axios';

import Alert from '@material-ui/lab/Alert';
import {Link} from 'react-router-dom';
import { Card, CardContent, Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import CircularProgress from '@material-ui/core/CircularProgress';

class MyProject extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    render() {
        const project = this.props.data.project;
        const supervisor = this.props.data.supervisor;
        var noProjectDisplay = [];
        var projectInformation = [];
        var projectStatus = [];
        if (!project) {
            noProjectDisplay.push(
                <Alert severity="warning" style={{ width: "100%" }}>You have not selected an Honours Project! - <Link to="/projects">You can either select a project from the system or request your own.</Link></Alert> 
            );
        }
        else {
            projectInformation.push(
                <Card>
                    <CardContent>
                        <Typography
                            color="textPrimary"
                            gutterBottom
                            variant="h5"
                            align="center"
                            >
                            Project Information{" "}
                        </Typography>
                        <Grid container>
                            <Grid item xs={3}>
                            <Typography align="center">Title</Typography>
                             <br/> <center>{project.title}</center>
                            </Grid>
                            <Grid item xs={3}>
                            <Typography align="center">Description</Typography>
                                <br/> <center>{project.description}</center>
                            </Grid>
                            <Grid item xs={3}>
                            <Typography align="center">Topic Area</Typography>
                                <br/> <center>{project.topic_area}</center>
                            </Grid>
                            <Grid item xs={3}>
                            <Typography align="center">Supervisor</Typography>
                                <br/> <center>{supervisor.first_name} {supervisor.surname} - {supervisor.email}</center>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            );
            projectStatus.push(
                <Card style={{ marginTop: 20 }}>
                    <CardContent>
                    <Typography
                            color="textPrimary"
                            gutterBottom
                            variant="h5"
                            align="center"
                            >
                            Current Status: {project.status}{" "}
                        </Typography>
                    </CardContent>
                </Card>
            );
        }
        return ( 
            <div>
                <h1>My Project</h1>
                {noProjectDisplay}
                {projectInformation}
                {projectStatus}
            </div> 
        );
    }
}
 
export default MyProject;