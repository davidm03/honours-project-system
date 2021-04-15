/* 
    David McDowall - Honours Project
    Reports.js component for displaying the reports screen for the module leader to display system information and export data
*/

import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import axios from 'axios';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart } from 'recharts';
import { CSVLink } from 'react-csv';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';

/* Reports component */
class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [], loading: true, downloadData: [], downloadHeaders: [], filename: "", exportSelect: "" }
    }
    /* Function for loading system users from the server */
    loadUsers = () => {
        // use axios to send a GET request to the server to get all users
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/').then(res => {
            // if the response contains data
            if (res.data.length > 0) {
                // store the user data in the state
                this.setState({ users: res.data, loading: false });
            }
        })
    }
    /* Function for calculating the chart data of supervisors */
    calculateSupervisorChartData = () => {
        // get supervisors from props
        const supervisors = this.props.data.supervisors;
        // loop through supervisors
        var len = supervisors.length, i = 0;
        var data = [];
        while (i < len) {
            // get the current supervisor
            const supervisor = supervisors[i];
            // extract information and store it for chart
            data.push({
                id: supervisor._id,
                name: supervisor.first_name + " " + supervisor.surname,
                email: supervisor.email,
                role: supervisor.role[0],
                numProjects: supervisor.projects.length
            });
            i++;
        }
        // return the chart data to be displayed
        return data;
    }
    /* Function for calculating project chart data */
    calculateProjectChartData = () => {
        // get projects and users
        const projects = this.props.data.projects.filter(p => p.studentID);
        const users = this.state.users;
        // loop through projects
        var len = projects.length, i = 0;
        var data = [];
        while (i < len) {
            // get the current project, student and supervisor
            const project = projects[i];
            const student = users.find(s => s._id === project.studentID);
            const supervisor = users.find(s => s._id === project.supervisorID);
            // extract relevant information and store to be displayed in chart
            data.push({
                id: project._id,
                project_name: project.title,
                student_name: student.first_name + " " + student.surname,
                student_email: student.email,
                studentID: student.studentID,
                supervisor: supervisor.first_name + " " + supervisor.surname,
                activity: project.activity.length
            });
            i++;
        }
        // return the chart data for display
        return data;
    }
    /* Function for calculating students project chart data */
    calculateStudentProjectChartData = () => {
        // get students
        const students = this.state.users.filter(s => s.userType === "Student");
        // initialise counters for students with and without projects
        var withProjectCount = 0, withoutProjectCount = 0;
        // loop through students
        var len = students.length, i = 0;
        while (i < len) {
            // get current student
            const student = students[i];
            // if the student has a project - update with project counter
            if (student.project) {
                withProjectCount++;
            }
            // else no project - update without project counter
            else {
                withoutProjectCount++;
            }
            i++;
        }
        // return the chart data
        return [{ name: "Students With Projects", value: withProjectCount }, { name: "Students Without Projects", value: withoutProjectCount }]
    }
    /* Function for exporting data from the charts */
    exportData = (e) => {
        // get the selection of data to be exported
        const select = e.target.value;
        // initialise data
        var data = [], headers = [], filename = "";
        // switch statement to process and get the selected data for download
        switch (select) {
            // download supervisor data
            case "supervisor":
                // retrieve data from function
                data = this.calculateSupervisorChartData();
                // set headers
                headers = [
                    { label: "UserID", key: "id" },
                    { label: "Supervisor Name", key: "name" },
                    { label: "Email", key: "email" },
                    { label: "Role", key: "role" },
                    { label: "No. Projects Supervising", key: "numProjects" }
                ];
                // set filename
                filename = "supervisor_project_count.csv";
                break;
            // download project data
            case "project":
                // retrieve data from function
                data = this.calculateProjectChartData();
                // set headers
                headers = [
                    { label: "ProjectID", key: "id" },
                    { label: "Project Title", key: "project_name" },
                    { label: "Student Name", key: "student_name" },
                    { label: "Student Email", key: "student_email" },
                    { label: "StudentID", key: "studentID" },
                    { label: "Supervisor", key: "supervisor" },
                    { label: "Activity Count", key: "activity" }
                ];
                // set filename
                filename = "project_activity_count.csv";
                break;
            // download student data    
            case "student":
                // get students, students without projects and students with projects
                const students = this.state.users.filter(s => s.userType === "Student");
                const studentsWithoutProjects = students.filter(s => !s.project);
                // set the download data to the students without projects
                data = studentsWithoutProjects.map(s => {
                    return {
                        id: s._id,
                        name: s.first_name + " " + s.surname,
                        email: s.email,
                        role: s.role[0],
                        studentID: s.studentID,
                        last_login: new Date(s.last_login * 1000),
                        project: "No"
                    }
                });
                // set the headers
                headers = [
                    { label: "StudentID", key: "id" },
                    { label: "Student Name", key: "name" },
                    { label: "Student Email", key: "email" },
                    { label: "Role", key: "role" },
                    { label: "StudentID", key: "studentID" },
                    { label: "Last Login", key: "last_login" },
                    { label: "Has Project?", key: "project" }
                ];
                // set the filename
                filename = "students_without_projects.csv";
                break;
            default:
                break;
        }
        // update the state with the download data
        this.setState({ exportSelect: e.target.value, downloadData: data, downloadHeaders: headers, filename: filename });
    }
    /* ComponentDidMount method runs when the component has successfully mounted */
    componentDidMount() {
        // call to load users
        this.loadUsers();
    }
    /* Render method to process and render UI */
    render() {
        // get the projects and supervisors
        const projects = this.props.data.projects;
        const supervisors = this.props.data.supervisors;
        // create arrays to store data
        var users = [], students = [];
        var supervisorData = [], projectActivityData = [], studentProjectData = [];
        var COLORS = [];

        // check if data is still loading
        if (this.state.loading) {
            // return loading screen
            return (
                <Backdrop open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        // else data has loaded
        else {
            // get all of the loaded data
            users = this.state.users;
            students = users.filter(s => s.userType === "Student");
            supervisorData = this.calculateSupervisorChartData();
            projectActivityData = this.calculateProjectChartData();
            studentProjectData = this.calculateStudentProjectChartData();
            COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
        }
        // return the UI
        return (
            <div>
                <h1>System Reports</h1>
                {/* Display cards for system information/statistics */}
                <Grid container spacing={4}>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>{users.length}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center' }}>Total Users</Typography>
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
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>{supervisors.length}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center' }}>Total Supervisors</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold' }}>{projects.length}</Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom style={{ textAlign: 'center' }}>Total Projects</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Display dropdown menu to allow user to select data for download */}
                <Grid container justify="flex-end" style={{ marginTop: 20 }}>
                    <Grid item>
                        <FormControl variant="outlined" style={{ minWidth: 300 }}>
                            <Select
                                value={this.state.exportSelect}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                onChange={this.exportData}
                            >
                                <MenuItem value="" disabled>
                                    Export Chart Data
                        </MenuItem>
                                <MenuItem value={"supervisor"}>Supervisor Project Count</MenuItem>
                                <MenuItem value={"project"}>Project Activity Count</MenuItem>
                                <MenuItem value={"student"}>Students Without Project Count</MenuItem>
                            </Select>
                            <FormHelperText>Select Data for Export</FormHelperText>
                        </FormControl>
                    </Grid>
                    {this.state.downloadData.length > 0 && (
                        <Grid item>
                            {/* If user selects download data in dropdown - display download icon button with download link */}
                            <CSVLink data={this.state.downloadData} headers={this.state.downloadHeaders} filename={this.state.filename}>
                                <IconButton aria-label="download">
                                    <GetAppIcon fontSize="large" />
                                </IconButton>
                            </CSVLink>
                        </Grid>
                    )}
                </Grid>

                {/* Display charts */}
                <Grid container style={{ marginTop: 20 }}>
                    <Grid item xs={6} style={{ minHeight: 500 }}>
                        {/* Display bar chart for supervisor data */}
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
                                <YAxis tickCount={1} />
                                <Tooltip />
                                <Legend />
                                <Bar name="Projects Supervising" dataKey="numProjects" fill="#0099ff" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>

                    {/* Display bar chart for project activity data */}
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
                                <XAxis dataKey="student_name" />
                                <YAxis tickCount={1} />
                                <Tooltip />
                                <Legend />
                                <Bar name="Activity Count By Project" dataKey="activity" fill="#9966ff" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>

                {/* Display pie chart for students with/without project data */}
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