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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import UpdateIcon from '@material-ui/icons/Update';
import MessageIcon from '@material-ui/icons/Message';
import CommentIcon from '@material-ui/icons/Comment';

class MyProject extends Component {
    constructor(props) {
        super(props);
        this.state = { updateStatusDialog: false };
    }
    handleStatusUpdate = (e) => {
        e.preventDefault();
        var project = this.props.data.project;
        const user = this.props.data.user;
        const status = document.getElementById('txtUpdateStatus').value;
        project.activity.push({ action: "update", activity: status });
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
            _id: project._id,
            status: status,
            activity: project.activity,
            studentID: user.userId
        }).then(res => {
            if (res.data === true) {
                this.props.reloadProject();
            }
        })
    }
    render() {
        var project;
        var supervisor;
        var activityItems = [];

        if (this.props.data) {
            project = this.props.data.project;
            supervisor = this.props.data.supervisor;

            for (let index = 0; index < project.activity.length; index++) {
                const activity = project.activity[index];
                var listItem; 
                switch (activity.action) {
                    case "update":
                        var text = "Project status has been updated to: " + activity.activity;
                        listItem = (
                        <ListItem>
                        <ListItemIcon>
                            <UpdateIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Status Update"
                            secondary={text}
                        />
                        </ListItem>
                        );
                        break;
                    case "create":
                        var text = "Project has been initiated.";
                        listItem = (
                        <ListItem>
                        <ListItemIcon>
                            <CreateNewFolderIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Project Created"
                            secondary={text}
                        />
                        </ListItem>
                        );
                        break;
                    case "comment":
                        listItem = (
                        <ListItem>
                        <ListItemIcon>
                            <Avatar style={{ color: 'primary' }}>{supervisor.first_name.charAt(0).toUppercase()}{supervisor.surname.charAt(0).toUppercase()}</Avatar>
                        </ListItemIcon>
                        <ListItemText
                            primary="Supervisor Comment"
                            secondary={activity.activity}
                        />
                        </ListItem>
                        );
                        break;
                    case "note":
                        listItem = (
                            <ListItem>
                            <ListItemIcon>
                                <Avatar style={{ color: 'primary' }}>{supervisor.first_name.charAt(0).toUppercase()}{supervisor.surname.charAt(0).toUppercase()}</Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary="Note Added By Student"
                                secondary={activity.activity}
                            />
                            </ListItem>
                            );
                        break;
                    default:
                        break;
                }
                activityItems.push(listItem);
            }
        }

        return ( 
            <div>
                <h1>My Project</h1>
                <p>View all information about your selected honours project. From here you can update the status of your project for your supervisor to see or add activity notes.</p>
                {!project && (
                    <Alert severity="warning" style={{ width: "100%" }}>You have not selected an Honours Project! - <Link to="/projects">You can either select a project from the system or request your own.</Link></Alert>
                )}

                {project && (
                <>
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

                <Card style={{ marginTop: 20 }}>
                    <CardContent>
                    <Typography
                            color="textPrimary"
                            gutterBottom
                            variant="h5"
                            align="center"
                            >
                            Recent Activity{" "}
                        </Typography>
                        <List>
                            {activityItems.reverse()}
                        </List>
                    </CardContent>
                </Card>

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
                </>
                )}
            </div> 
        );
    }
}
 
export default MyProject;