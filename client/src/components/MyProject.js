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
import SendIcon from '@material-ui/icons/Send';
import CommentIcon from '@material-ui/icons/Comment';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class MyProject extends Component {
    constructor(props) {
        super(props);
        this.state = { updateStatusDialog: false, loading: true, superData: {} };
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
    handleAddNote = (e) => {
        e.preventDefault();
        if (this.props.id) {
            this.handleSupervisorMessage();
        }
        else {
            var project = this.props.data.project;
            const user = this.props.data.user;
            const note = document.getElementById('txtNote').value;
            project.activity.push({ action: "note", activity: note });
            axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
                _id: project._id,
                activity: project.activity,
                studentID: user.userId
            }).then(res => {
                if (res.data === true) {
                    this.props.reloadProject();
                    document.getElementById('txtNote').value = "";
                }
            })
        }
    }
    handleSupervisorMessage = () => {
        var project = this.state.superData.project;
        const student = this.state.superData.student;
        const message = document.getElementById('txtNote').value;
        project.activity.push({ action: "comment", activity: message });
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
            _id: project._id,
            activity: project.activity,
            studentID: student._id
        }).then(res => {
            if (res.data === true) {
                this.uniqueLoadData();
                document.getElementById('txtNote').value = "";
            }
        })
    }
    uniqueLoadData = () => {
        if (this.props.id) {
            axios.get(process.env.REACT_APP_SERVER_URL + 'project/view/' + this.props.id)
            .then(res => {
                if (res.data) {
                    var project = res.data;  
                    axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + project.studentID)
                    .then(res => {
                        if (res.data) {
                            var student = res.data; 
                            axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + project.supervisorID)
                            .then(res => {
                                if (res.data) {
                                    var supervisor = res.data;
                                    var data = this.state.superData; 
                                    data.project = project;
                                    data.student = student; 
                                    data.supervisor = supervisor;
                                    this.setState({ loading: false, superData: data });
                                }
                            })
                        }
                    })
                    
                }
            })
        }
        else {
            this.setState({ loading: false });
        }
    }
    componentDidMount() {
        this.uniqueLoadData();
    }
    render() {
        var project = {};
        var supervisor = {};
        var student = {}; 
        var activityItems = [];

        var studentPOV = false; 
        if (this.props.data) studentPOV = true;

        if (this.state.loading === false) {
            if (studentPOV) {
                project = this.props.data.project;
                supervisor = this.props.data.supervisor;
            }
            else {
                student = this.state.superData.student;
                project = this.state.superData.project;
                supervisor = this.state.superData.supervisor;
            }
                
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
                                <Avatar style={{ backgroundColor: 'blue' }}>{supervisor.first_name.charAt(0).toUpperCase()}{supervisor.surname.charAt(0).toUpperCase()}</Avatar>
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
                                    <CommentIcon/>
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
        else {
            return <Backdrop open={true}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
        }

        return ( 
            <div>
                {studentPOV
                    ? (
                    <>
                    <h1>My Project</h1>
                    <p>View all information about your selected honours project. From here you can update the status of your project for your supervisor to see or add activity notes.</p>
                    </>
                    )
                    : (
                    <>
                    <h1>{student.first_name} {student.surname}'s Project</h1>
                    <p>View all information about {student.first_name} {student.surname}'s honours project. You can respond to student notes located in the recent activity window below.</p>
                    </>
                    )
                }              
                
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
                    {studentPOV &&
                    (<CardActions style={{justifyContent: 'center'}}>
                        <Button variant="contained" color={'primary'} onClick={()=>this.setState({ updateStatusDialog: true })}>Update Status</Button>
                    </CardActions>
                    )}
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

                <Card style={{ marginTop: 20 }}>
                    <CardContent>
                    <Typography
                            color="textPrimary"
                            gutterBottom
                            variant="h5"
                            align="center"
                            >
                            Add Note{" "}
                    </Typography>
                    <p>Notes can be used to document any information you wish to be stored with this project or for questions/queries your supervisor can respond to.</p>
                    <form onSubmit={this.handleAddNote}>
                    <TextField
                    id="txtNote"
                    multiline
                    rows={6}
                    placeholder="Add your note here"
                    variant="outlined"
                    fullWidth
                    required
                    style={{ marginBottom: 10}}
                    />
                    <Button color="primary" type="submit" variant="contained" endIcon={<SendIcon/>} style={{ float: 'right', marginBottom: 10 }}>Add Note</Button>
                    </form>
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