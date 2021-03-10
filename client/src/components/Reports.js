import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import axios from 'axios';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Label } from 'recharts';

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [], loading: true }
    }
    loadUsers = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/').then(res => {
            if (res.data.length > 0) {
                this.setState({ users: res.data, loading: false, supervisorChartData: [] });
            }
        })
    }
    calculateSupervisorChartData = () => {
        const supervisors = this.props.data.supervisors;
        var len = supervisors.length, i = 0;
        var data = [];
        while (i<len) {
            const supervisor = supervisors[i];
            data.push({
                name: supervisor.first_name + " " + supervisor.surname,
                numProjects: 1 //change to supervisor.projects.length
            });
            i++;
        }
        return data; 
    }
    calculateProjectChartData = () => {
        const projects = this.props.data.projects;
        var len = projects.length, i = 0;
        var data = [];
        while (i<len) {
            const project = projects[i];
            data.push({
                project_name: project.title,
                activity: project.activity.length
            });
            i++;
        }
        return data; 
    }
    calculateStudentProjectChartData = () => {
        const students = this.state.users.filter(s => s.userType === "Student"); 
        var len = students.length, i = 0; 
        var withProjectCount = 1, withoutProjectCount = 0; 
        while (i < len) {
            const student = students[i];
            if (student.project) {
                withProjectCount++;
            }
            else {
                withoutProjectCount++;
            }
            i++;
        }
        return [{ name: "Students With Projects", value: withProjectCount}, { name: "Students Without Projects", value: withoutProjectCount }]
    }
    componentDidMount() {
        this.loadUsers();
    }
    render() {
        const projects = this.props.data.projects;
        const supervisors = this.props.data.supervisors;
        var users = [], students = [];
        var supervisorData = [], projectActivityData = [], studentProjectData = [];
        var COLORS = [];

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
            supervisorData = this.calculateSupervisorChartData();
            projectActivityData = this.calculateProjectChartData();
            studentProjectData = this.calculateStudentProjectChartData();
            COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
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

                <Grid container style={{ marginTop: 20 }}>
                    <Grid item xs={6} style={{ minHeight: 500 }}> 
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        width={150}
                        height={40}
                        data={supervisorData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickCount={1}/>
                        <Tooltip />
                        <Legend />
                        <Bar name="Projects Supervising" dataKey="numProjects" fill="#0099ff" barSize={40}/>
                        </BarChart>
                    </ResponsiveContainer>
                    </Grid>

                    <Grid item xs={6} style={{ minHeight: 500 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        width={150}
                        height={40}
                        data={projectActivityData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="project_name" />
                        <YAxis tickCount={1}/>
                        <Tooltip />
                        <Legend />
                        <Bar name="Activity Count By Project" dataKey="activity" fill="#9966ff" barSize={40}/>
                        </BarChart>
                    </ResponsiveContainer>
                    </Grid>
                </Grid>

                <Grid container style={{ marginTop: 20, minHeight: 500 }}>
                    <Grid item xs={6} align="center">
                    <PieChart width={400} height={400} margin={{ top: 5, right: 100, left: 100, bottom: 5 }}>
                    <Pie
                        data={studentProjectData}
                        cx={120}
                        cy={200}
                        innerRadius={140}
                        outerRadius={160}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label
                    >
                        {studentProjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    </PieChart>
                    <h2>Students With Project: {studentProjectData[0].value}</h2>
                    <h2>Students Without Project: {studentProjectData[1].value}</h2>
                    </Grid>
                    <Grid item xs={6}>
                            
                    </Grid>
                </Grid>
            </div>
        );
    }
}
 
export default Reports;