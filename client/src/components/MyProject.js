import React, { Component } from 'react';
import axios from 'axios';

import Alert from '@material-ui/lab/Alert';
import {Link} from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardHeader, Grid, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class MyProject extends Component {
    constructor(props) {
        super(props);
        this.state = { updateStatusDialog: false };
    }
    handleStatusUpdate = (e) => {
        e.preventDefault();
        const project = this.props.data.project;
        const user = this.props.data.user;
        const status = document.getElementById('txtUpdateStatus').value;
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
            _id: project._id,
            status: status,
            studentID: user.userId
        }).then(res => {
            if (res.data === true) {
                this.props.reloadProject();
            }
        })
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
                    <CardActions style={{justifyContent: 'center'}}>
                        <Button variant="contained" color={'primary'} onClick={()=>this.setState({ updateStatusDialog: true })}>Update Status</Button>
                    </CardActions>
                </Card>
            );
        }
        return ( 
            <div>
                <h1>My Project</h1>
                {noProjectDisplay}
                {projectInformation}
                {projectStatus}

                <Dialog open={this.state.updateStatusDialog} onClose={()=>this.setState({ updateStatusDialog: false })}>
                        <DialogTitle id="form-dialog-title">Update Status</DialogTitle>
                        <form onSubmit={this.handleStatusUpdate}>
                        <DialogContent>
                        <DialogContentText>
                            Enter the updated status of your project (e.g. Development, Testing, Evaluating)
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="txtUpdateStatus"
                            label="Status"
                            fullWidth
                            required
                        />            
                        </DialogContent>
                        <DialogActions>
                        <Button color="primary" onClick={()=>this.setState({ updateStatusDialog: false })}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Update
                        </Button> 
                        </DialogActions>
                        </form>
                    </Dialog>
            </div> 
        );
    }
}
 
export default MyProject;