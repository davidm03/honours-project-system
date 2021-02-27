import axios from 'axios';
import React, { Component } from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Grid, Paper } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

class ExpandProject extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, project: null, supervisor: null }
    }
    loadProjectData = () => {
        var id = this.props.id; 
        axios.get(process.env.REACT_APP_SERVER_URL + "project/view/" + id)
        .then(res => {
            if (res.data._id) {
                var project = res.data;
                axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + res.data.supervisorID)
                .then(res => {
                    if (res.data._id) {
                        this.setState({ project: project, supervisor: res.data, loading: false });    
                    }
                })   
            }
        })
    }
    handleSelectProject = () => {
        const user = this.props.user;
        console.log(user);
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
            _id: this.state.project._id,
            studentID: user.userId,
            available: false
        }).then(res => {
            if (res.data===true) {
                this.props.reloadProjects();
            }
        })
    }
    componentDidMount() {
        this.loadProjectData();
    }
    render() { 
        if (this.state.loading) {
            return (
                <Backdrop open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            );
        } 
        else {
            return (
                <div>
                    <h1>Project - {this.state.project.title}</h1>
                    <p>
                        Description <br/>
                        {this.state.project.description}
                    </p>
                    <p>
                        Topic Area <br/>
                        {this.state.project.topic_area}
                    </p>
                    <p>
                        Supervisor <br/>
                        {this.state.supervisor.first_name} {this.state.supervisor.surname}
                    </p>
                    <Grid container justify="center">
                    <Button variant="contained" color="primary" onClick={this.handleSelectProject} endIcon={<CheckIcon/>}> 
                        Choose this project
                    </Button>
                    </Grid>
                </div>
            );
        }
    }
}
 
export default ExpandProject;