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

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, users: [], announcement: null, announcementDialog: false }
    }
    loadUsers = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/').then(res => {
            if (res.data.length > 0) {
                this.setState({ users: res.data  });
            }
            this.loadAnnouncement();
        })
    }
    loadAnnouncement = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'announcement/').then(res => {
            if (res.data !== false) {
                this.setState({ announcement: res.data, loading: false });
            }
            else {
                this.setState({ loading: false });
            }
        })
    }
    postAnnouncement = (e) => {
        e.preventDefault();
        var message = document.getElementById('txtAnnouncement').value;
        var id = this.props.data.user.userId; 
        axios.post(process.env.REACT_APP_SERVER_URL + 'announcement/post', {
            body: message,
            staffID: id
        }).then(res => {
            if (res.data !== false) {
                this.loadAnnouncement();
                this.setState({ announcementDialog: false });
            }
        })
    }
    componentDidMount() {
        this.loadUsers();
        //this.loadAnnouncement();
    }
    render() {
        var users = [], supervisors = [], projects = [], students = [], currentUser = {};
        var availableProjects = 0, projectsOngoing = 0, lastLogin = "";
        var studentProject = "", studentID = "";
        var topicArea = "", supervisorProjectCount = 0, supervisorRequestsCount = 0;
        if (this.state.loading) {
            return (
                <Backdrop open={true}>
                        <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        else {
            console.log("propsHOME", this.props);
            users = this.state.users;
            currentUser = users.find(u => u._id === this.props.data.user.userId);
            supervisors = this.props.data.supervisors;
            projects = this.props.data.projects;
            students = users.filter(s => s.userType === "Student");
            availableProjects = projects.filter(p => p.available).length;
            projectsOngoing = projects.filter(p => !p.available).length; 
            lastLogin = new Date(currentUser.last_login * 1000).toLocaleDateString('en-GB');


            if (currentUser.userType === "Student") {
                studentID = currentUser.studentID; 
                if (currentUser.project) {
                    studentProject = projects.find(p => p._id === currentUser.project).title;
                }
                else {
                    studentProject = "You have not selected a project."
                }
            }
            else {
                topicArea = currentUser.topic_area; 
                supervisorProjectCount = currentUser.projects.length; 
                supervisorRequestsCount = currentUser.supervision_requests.length; 
            }
        } 
        return ( 
            <div>
                <h1>Home</h1>
                <Grid container spacing={4}>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>{supervisors.length}</Typography>
                                <Link to="/supervisors"><Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center'}}>Total Supervisors</Typography></Link>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>{availableProjects}</Typography>
                                <Link to="/projects"><Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center'}}>Available Projects</Typography></Link>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>{students.length}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center'}}>Total Students</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>{projectsOngoing}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center'}}>Projects Ongoing</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>Manage Your Profile</Typography>
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
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>Latest Announcement</Typography>
                                {this.state.announcement ? (
                                    <>
                                    <Typography style={{ marginTop: 30, marginBottom: 10 }} variant="body1">{this.state.announcement.message_body}</Typography>
                                    <Divider/>
                                    <Typography style={{ marginTop: 10 }}variant="subtitle2">{this.state.announcement.date}</Typography>
                                    </>
                                ) : (
                                    <Alert variant="outlined" severity="info">
                                        No Announcements Available - Please Check Back Later.
                                    </Alert>
                                )}
                                
                                {currentUser.role.includes("MODULE_LEADER") && (
                                <center>
                                    <Button onClick={()=>this.setState({announcementDialog: true })} style={{ marginTop: 30 }} variant="contained" color="primary" endIcon={<PostAddIcon/>}>Post New Annoucement</Button>
                                </center>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Dialog open={this.state.announcementDialog} onClose={()=>this.setState({ announcementDialog: false })}>
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
                        <Button onClick={()=>this.setState({ announcementDialog: false })} color="primary">
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