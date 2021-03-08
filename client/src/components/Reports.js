import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import axios from 'axios';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [], loading: true }
    }
    loadUsers = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/').then(res => {
            if (res.data.length > 0) {
                this.setState({ users: res.data, loading: false });
            }
        })
    }
    componentDidMount() {
        this.loadUsers();
    }
    render() {
        const projects = this.props.data.projects;
        const supervisors = this.props.data.supervisors;
        var users = [], students = [];
        if (this.state.loading) {
            return (
                <Backdrop open={true}>
                        <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        else {
            users = this.state.users;
            students = users.filter(s => s.userType === "Student");
        }
        return ( 
            <div>
                <h1>System Reports</h1>
                <Grid container spacing={4}>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>{users.length}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center'}}>Total Users</Typography>
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
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>{supervisors.length}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center'}}>Total Supervisors</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold'}}>{projects.length}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center'}}>Total Projects</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
 
export default Reports;