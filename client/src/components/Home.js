/* 
    David McDowall - Honours Project
    Home.js component for processing and rendering the Home screen
*/

import React, { Component } from 'react';
import axios from 'axios';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Button, Card, CardContent, Divider, Grid, Typography } from '@material-ui/core';

import { List, ListItem, ListItemText } from '@material-ui/core';

import PostAddIcon from '@material-ui/icons/PostAdd';

import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';

/* Home component */
class Home extends Component {
    constructor(props) {
        super(props);
        // Home state
        this.state = { loading: true, users: [], announcement: null, announcementDialog: false }
    }
    /* Function for loading all users from the server */
    loadUsers = () => {
        // use axios to send GET request to server for users
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/').then(res => {
            // if response contains data
            if (res.data.length > 0) {
                // store users in state
                this.setState({ users: res.data });
            }
            // call function to load latest announcement
            this.loadAnnouncement();
        })
    }
    /* Function to load the latest announcement from the server */
    loadAnnouncement = () => {
        // use axios to send GET request to server for latest announcement
        axios.get(process.env.REACT_APP_SERVER_URL + 'announcement/').then(res => {
            // if response contains data
            if (res.data !== false) {
                // store announcement in state and stop page loading
                this.setState({ announcement: res.data, loading: false });
            }
            else {
                // stop page loading
                this.setState({ loading: false });
            }
        })
    }
    /* Function to handle module leader posting a new announcement */
    postAnnouncement = (e) => {
        // prevent page reload
        e.preventDefault();
        // get message from textbox 
        var message = document.getElementById('txtAnnouncement').value;
        // get current user id
        var id = this.props.data.user.userId;
        // use axios to send POST request to server for creating new announcement
        axios.post(process.env.REACT_APP_SERVER_URL + 'announcement/post', {
            body: message,
            staffID: id
        }).then(res => {
            // if response is success
            if (res.data !== false) {
                // reload announcement and hide dialog 
                this.loadAnnouncement();
                this.setState({ announcementDialog: false });
            }
        })
    }
    /* ComponentDidMount function runs when component successfully mounts */
    componentDidMount() {
        // call to load users
        this.loadUsers();
    }
    /* Render method for rendering elements for display */
    render() {
        // variables to store data
        var users = [], supervisors = [], projects = [], students = [], currentUser = {};
        var availableProjects = 0, projectsOngoing = 0, lastLogin = "";
        var studentProject = "", studentID = "";
        var topicArea = "", supervisorProjectCount = 0, supervisorRequestsCount = 0;
        // if page is still loading from server
        if (this.state.loading) {
            // return loading screen
            return (
                <Backdrop open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        // if page has loaded
        else {
            // retrieve and process data from state/props
            users = this.state.users;
            currentUser = users.find(u => u._id === this.props.data.user.userId);
            supervisors = this.props.data.supervisors;
            projects = this.props.data.projects;
            students = users.filter(s => s.userType === "Student");
            availableProjects = projects.filter(p => p.available).length;
            projectsOngoing = projects.filter(p => !p.available).length;
            lastLogin = new Date(currentUser.last_login * 1000).toLocaleDateString('en-GB');


            // check if current user is a student
            if (currentUser.userType === "Student") {
                // check if the student has selected a project and retrieve it
                studentID = currentUser.studentID;
                if (currentUser.project) {
                    studentProject = projects.find(p => p._id === currentUser.project).title;
                }
                // if no project - set message
                else {
                    studentProject = "You have not selected a project."
                }
            }
            // if user is not student
            else {
                // load staff only attributes
                topicArea = currentUser.topic_area;
                supervisorProjectCount = currentUser.projects.length;
                supervisorRequestsCount = currentUser.supervision_requests.length;
            }
        }
        /* Return method for displaying UI elements.
            Features card display with system statistics, current user information and announcement information
        */
        return (
            <div>
                <h1>Home</h1>
                {/* System statistic card display */}
                <Grid container spacing={4}>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>{supervisors.length}</Typography>
                                <Link to="/supervisors"><Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center' }}>Total Supervisors</Typography></Link>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>{availableProjects}</Typography>
                                <Link to="/projects"><Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center' }}>Available Projects</Typography></Link>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>{students.length}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center' }}>Total Students</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>{projectsOngoing}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center' }}>Projects Ongoing</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Current user profile information display */}
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>Manage Your Profile</Typography>
                                <List component="nav" aria-label="secondary mailbox folders">
                                    <ListItem><ListItemText primary="UserID:" />{currentUser._id}</ListItem>
                                    <ListItem><ListItemText primary="Email:" />{currentUser.email}</ListItem>
                                    <ListItem><ListItemText primary="First Name:" />{currentUser.first_name}</ListItem>
                                    <ListItem><ListItemText primary="Surname:" />{currentUser.surname}</ListItem>
                                    <ListItem><ListItemText primary="Role:" />{currentUser.role[0]}</ListItem>
                                    <ListItem><ListItemText primary="Last Login:" />{lastLogin}</ListItem>
                                    {currentUser.userType === "Student" ?
                                        (
                                            <>
                                                <ListItem><ListItemText primary="Student ID:" />{studentID}</ListItem>
                                                <ListItem><ListItemText primary="Project:" />{studentProject}</ListItem>
                                            </>
                                        ) : (
                                            <>
                                                <ListItem><ListItemText primary="Topic Area:" />{topicArea}</ListItem>
                                                <ListItem><ListItemText primary="Projects Supervising:" />{supervisorProjectCount}</ListItem>
                                                <ListItem><ListItemText primary="Supervision Requests Recieved:" />{supervisorRequestsCount}</ListItem>
                                            </>
                                        )}
                                </List>
                                <center>
                                    <Link to="/profile" style={{ textDecoration: 'none' }}><Button variant="contained" color="primary">View My Profile</Button></Link>
                                </center>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Announcements display */}
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>Latest Announcement</Typography>
                                {this.state.announcement ? (
                                    <>
                                        <Typography style={{ marginTop: 30, marginBottom: 10 }} variant="body1">{this.state.announcement.message_body}</Typography>
                                        <Divider />
                                        <Typography style={{ marginTop: 10 }} variant="subtitle2">{this.state.announcement.date}</Typography>
                                    </>
                                ) : (
                                    <Alert variant="outlined" severity="info">
                                        No Announcements Available - Please Check Back Later.
                                    </Alert>
                                )}

                                {currentUser.role.includes("MODULE_LEADER") && (
                                    <center>
                                        <Button onClick={() => this.setState({ announcementDialog: true })} style={{ marginTop: 30 }} variant="contained" color="primary" endIcon={<PostAddIcon />}>Post New Annoucement</Button>
                                    </center>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Dialog that opens on button click for posting new announcement */}
                <Dialog open={this.state.announcementDialog} onClose={() => this.setState({ announcementDialog: false })}>
                    <DialogTitle id="form-dialog-title">Post New Announcement</DialogTitle>
                    <form onSubmit={this.postAnnouncement}>
                        <DialogContent>
                            <DialogContentText>
                                Enter your message below that you wish to announce to all users on the Home screen.
                        </DialogContentText>
                            <TextField
                                margin="dense"
                                id="txtAnnouncement"
                                label="Message"
                                fullWidth
                                multiline
                                rows={3}
                                required
                                variant="outlined"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.setState({ announcementDialog: false })} color="primary">
                                Cancel
                        </Button>
                            <Button type="submit" color="primary">
                                Post
                        </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    }
}

export default Home;