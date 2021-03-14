import React, { Component } from 'react';
import axios from 'axios';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Button, Card, CardContent, Grid, Typography } from '@material-ui/core';

import { List, ListItem, ListItemText } from '@material-ui/core';

import { Link } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, users: [] }
    }
    loadUsers = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/').then(res => {
            if (res.data.length > 0) {
                this.setState({ users: res.data, loading: false  });
            }
        })
    }
    componentDidMount() {
        this.loadUsers();
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
                                <Typography variant="body1">Welcome to the new Honours Project system. Make sure to select your project before 11/03/2021!</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
 
export default Home;