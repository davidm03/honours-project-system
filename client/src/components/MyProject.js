/* 
    David McDowall - Honours Project
    MyProject.js component for displaying the my project screen - which displays a users selected project to a student or supervisor
*/

import React, { Component } from 'react';
import axios from 'axios';

import Alert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, Grid } from '@material-ui/core';
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

/* MyProject component */
class MyProject extends Component {
    constructor(props) {
        super(props);
        this.state = { updateStatusDialog: false, loading: true, superData: {}, noteError: null };
    }
    /* Function for handling a user updating the status of their project */
    handleStatusUpdate = (e) => {
        // prevent page reload
        e.preventDefault();
        // get the current project and user from props
        var project = this.props.data.project;
        const user = this.props.data.user;
        // get the new status from the text field
        const status = document.getElementById('txtUpdateStatus').value;
        // update the project activity log
        project.activity.push({ action: "update", activity: status });
        // if the status is not blank
        if (status !== " ") {
            // use axios to send POST request to the server to update the project with the new status
            axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
                _id: project._id,
                status: status,
                activity: project.activity,
                studentID: user.userId
            }).then(res => {
                // if success response
                if (res.data === true) {
                    // reload projects
                    this.props.reloadProject();
                }
            });
        }
    }
    /* Function for handling a user adding a new note on a project */
    handleAddNote = (e) => {
        // prevent page reload
        e.preventDefault();
        // if the component props contains an ID - then user is a supervisor
        if (this.props.id) {
            // call method to handle supervisor message
            this.handleSupervisorMessage();
        }
        // else user is student
        else {
            // get the project and user from props
            var project = this.props.data.project;
            const user = this.props.data.user;
            // get the message from the text view
            const note = document.getElementById('txtNote').value;
            // check if the message is NOT blank
            if (note !== " ") {
                // update the project activity log
                project.activity.push({ action: "note", activity: note });
                // use axios to send POST request to the server to update project with the message from the student
                axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
                    _id: project._id,
                    activity: project.activity,
                    studentID: user.userId
                }).then(res => {
                    // if success response
                    if (res.data === true) {
                        // reload project and clear the note field
                        this.props.reloadProject();
                        document.getElementById('txtNote').value = "";
                    }
                });
            }
            // else the message is blank
            else {
                // display error message
                this.setState({ noteError: "Note cannot be blank." });
            }
        }
    }
    /* Function to handle a supervisor adding a new message on a students project */
    handleSupervisorMessage = () => {
        // get the project and student from the state
        var project = this.state.superData.project;
        const student = this.state.superData.student;
        // get the message from the UI
        const message = document.getElementById('txtNote').value;
        // check the message is not blank
        if (message !== " ") {
            // update the activity log of the project
            project.activity.push({ action: "comment", activity: message });
            // use axios to send a POST request to the server to update the project with the new message
            axios.post(process.env.REACT_APP_SERVER_URL + 'project/update', {
                _id: project._id,
                activity: project.activity,
                studentID: student._id
            }).then(res => {
                // if success response
                if (res.data === true) {
                    // perform a new unique data load and clear the message field
                    this.uniqueLoadData();
                    document.getElementById('txtNote').value = "";
                }
            });
        }
        // else message is blank
        else {
            // display error message
            this.setState({ noteError: "Note cannot be blank." });
        }
    }
    /* Function to perform a unique data load of project/user data 
        Used when for when the user on the page is a supervisor to load all data
    */
    uniqueLoadData = () => {
        // check if the component props contains a project ID
        if (this.props.id) {
            // use axios to send a GET request to the server to get the project by its ID
            axios.get(process.env.REACT_APP_SERVER_URL + 'project/view/' + this.props.id)
                .then(res => {
                    // if response contains data
                    if (res.data) {
                        // get the project
                        var project = res.data;
                        // use axios to send a GET request to the server to get the student info by student ID
                        axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + project.studentID)
                            .then(res => {
                                // if response contains data
                                if (res.data) {
                                    // get the student
                                    var student = res.data;
                                    // use axios to send a GET request to get the supervisor info from the server by supervisor ID
                                    axios.get(process.env.REACT_APP_SERVER_URL + 'users/view/' + project.supervisorID)
                                        .then(res => {
                                            // if response contains data
                                            if (res.data) {
                                                // get the supervisor
                                                var supervisor = res.data;
                                                // collate the project and user information
                                                var data = this.state.superData;
                                                data.project = project;
                                                data.student = student;
                                                data.supervisor = supervisor;
                                                // store the data in the state and stop loading
                                                this.setState({ loading: false, superData: data });
                                            }
                                        })
                                }
                            })

                    }
                })
        }
        // else no project id found
        else {
            // stop loading
            this.setState({ loading: false });
        }
    }
    /* ComponentDidMount method runs when the component has successfully mounted */
    componentDidMount() {
        // perform unique data load
        this.uniqueLoadData();
    }
    /* Render method to process and display UI*/
    render() {
        // if no project has been found (Student hasnt selected a project)
        if (this.props.project === false) {
            // return no project found display
            return (
                <div>
                    <h1>My Project</h1>
                    <p>View all information about your selected honours project. From here you can update the status of your project for your supervisor to see or add activity notes.</p>
                    <Alert severity="warning" style={{ width: "100%" }}>You have not selected an Honours Project! - <Link to="/projects">You can either select a project from the system or request your own.</Link></Alert>
                </div>
            );
        }
        // declare variables to store project and user data
        var project = {};
        var supervisor = {};
        var student = {};
        var activityItems = [];

        // check if user is a student and requires student POV
        var studentPOV = false;
        if (this.props.data) studentPOV = true;

        // if page has loaded
        if (this.state.loading === false) {
            // if student POV is required
            if (studentPOV) {
                // get the project and supervisor from PROPS
                project = this.props.data.project;
                supervisor = this.props.data.supervisor;
            }
            // else if no STUDENT POV
            else {
                // get student, project and supervisor from the state
                student = this.state.superData.student;
                project = this.state.superData.project;
                supervisor = this.state.superData.supervisor;
            }

            // loop through the activity of the project
            for (let index = 0; index < project.activity.length; index++) {
                // get the current activity item
                const activity = project.activity[index];
                var listItem;
                // switch statement to determine which activity item to display in the activity log
                switch (activity.action) {
                    // update project item
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
                    // create project item
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
                    // comment from supervisor item
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
                    // note to supervisor item
                    case "note":
                        listItem = (
                            <ListItem>
                                <ListItemIcon>
                                    <CommentIcon />
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
                // add activity items to list for display
                activityItems.push(listItem);
            }
        }
        // if page has no loaded
        else {
            // return loading screen
            return <Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        }

        // return the UI for display
        return (
            <div>
                {/* Render this code if current user is a student */}
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

                {/* Error message for no project found */}
                {!project && (
                    <Alert severity="warning" style={{ width: "100%" }}>You have not selected an Honours Project! - <Link to="/projects">You can either select a project from the system or request your own.</Link></Alert>
                )}

                {/* Display the project information */}
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
                                    <b>Project Information</b>{" "}
                                </Typography>
                                {/* Project info */}
                                <Grid container>
                                    <Grid item xs={3}>
                                        <Typography align="center">Title</Typography>
                                        <br /> <center>{project.title}</center>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography align="center">Description</Typography>
                                        <br /> <center>{project.description}</center>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography align="center">Topic Area</Typography>
                                        <br /> <center>{project.topic_area}</center>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography align="center">Supervisor</Typography>
                                        <br /> <center>{supervisor.first_name} {supervisor.surname} - {supervisor.email}</center>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Project status/update interface */}
                        <Card style={{ marginTop: 20 }}>
                            <CardContent>
                                <Typography
                                    color="textPrimary"
                                    gutterBottom
                                    variant="h5"
                                    align="center"
                                >
                                    <b>Current Status:</b> {project.status}{" "}
                                </Typography>
                            </CardContent>
                            {studentPOV &&
                                (<CardActions style={{ justifyContent: 'center' }}>
                                    <Button variant="contained" color={'primary'} onClick={() => this.setState({ updateStatusDialog: true })}>Update Status</Button>
                                </CardActions>
                                )}
                        </Card>

                        {/* Recent activity log */}
                        <Card style={{ marginTop: 20 }}>
                            <CardContent>
                                <Typography
                                    color="textPrimary"
                                    gutterBottom
                                    variant="h5"
                                    align="center"
                                >
                                    <b>Recent Activity</b>{" "}
                                </Typography>
                                <List>
                                    {activityItems.reverse()}
                                </List>
                            </CardContent>
                        </Card>

                        {/* Interface for adding a new message on the project */}
                        <Card style={{ marginTop: 20 }}>
                            <CardContent>
                                <Typography
                                    color="textPrimary"
                                    gutterBottom
                                    variant="h5"
                                    align="center"
                                >
                                    <b>Add Note</b>{" "}
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
                                        style={{ marginBottom: 10 }}
                                        error={this.state.noteError}
                                        helperText={this.state.noteError}
                                    />
                                    <Button color="primary" type="submit" variant="contained" endIcon={<SendIcon />} style={{ float: 'right', marginBottom: 10 }}>Add Note</Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Dialog for updating the status of a project */}
                        <Dialog open={this.state.updateStatusDialog} onClose={() => this.setState({ updateStatusDialog: false })}>
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
                                    <Button color="primary" onClick={() => this.setState({ updateStatusDialog: false })}>
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