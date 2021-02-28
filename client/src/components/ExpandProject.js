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
        const id = this.props.id;
        const project = this.props.data.projects.find(p=>p._id === id);
        const supervisor = this.props.data.supervisors.find(s=>s._id === project.supervisorID);
        this.setState({ loading: false, project: project, supervisor: supervisor });
    }
    handleSelectProject = () => {
        const user = this.props.user;
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