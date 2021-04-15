/* 
    David McDowall - Honours Project
    SupervisorStudents.js component for displaying the My Students screen available to supervisors to show the students they have under their supervision
*/

import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Button, Grid } from '@material-ui/core';

/* SupervisionStudents component */
class SupervisorStudents extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedStudents: [], downloadData: [], downloadHeaders: [], filename: "", students: [], loading: true }
    }
    /* ComponentDidMount method which runs when the component has successfully mounted */
    componentDidMount() {
        // check if the props data has students
        if (this.props.data.students) {
            // store students inside state and stop loading
            this.setState({ students: this.props.data.students, loading: false });
        }
        // else no students in props
        else {
            // stop loading data
            this.setState({ loading: false });
        }
    }
    /* Render method for processing and rendering UI display */
    render() {
        // define arrays for storing data
        var students = [], projects = [];
        var rows = [], columns = [], headers = [];
        // check if page is loading
        if (this.state.loading) {
            // display loading screen
            return (
                <Backdrop open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        // else page has loaded
        else {
            // get student and project data from props/state
            students = this.state.students;
            projects = this.props.data.projects;
            // define datagrid columns
            columns = [
                { field: 'id', headerName: 'ID', width: 250, hide: true },
                { field: 'first_name', headerName: 'First Name', width: 150 },
                { field: 'surname', headerName: 'Surname', width: 150 },
                { field: 'email', headerName: 'Email', width: 200 },
                { field: 'project', headerName: 'Project', width: 550 },
                { field: 'last_login', headerName: 'Last Login', width: '100%' }
            ];
            // rows to be displayed in datagrid
            rows = [];
            // if students 
            if (students.length > 0) {
                // loop through students 
                var len = students.length, i = 0;
                while (i < len) {
                    // get current student
                    const student = students[i];
                    // format last login date
                    var lastLogin = new Date(student.last_login * 1000).toLocaleDateString('en-GB');
                    // get students project
                    const project = projects.find(project => project.studentID === student._id);
                    // add student to the datagrid display
                    rows.push({
                        id: student._id,
                        email: student.email,
                        first_name: student.first_name,
                        surname: student.surname,
                        project: project.title,
                        last_login: lastLogin
                    });
                    i++;
                }
            }
            // define headers for CSV download
            headers = [
                { label: "StudentID", key: "id" },
                { label: "First Name", key: "first_name" },
                { label: "Surname", key: "surname" },
                { label: "Email", key: "email" },
                { label: "Project Title", key: "project" },
                { label: "Last Login", key: "last_login" }
            ];
        }
        // return the user interface display
        return (
            <div>
                <h1>My Students</h1>
                <p>View all of the students currently under your supervisor.</p>
                <div style={{ height: 700, width: '100%' }}>
                    {/* Download link for students data  */}
                    {students.length > 0 && (
                        <Grid container justify="flex-end" style={{ marginBottom: 20 }}>
                            <CSVLink style={{ textDecoration: 'none' }} data={rows} headers={headers} filename="honours_students_export.csv">
                                <Button variant="contained" color="primary" endIcon={<GetAppIcon />}>Export Students</Button>
                            </CSVLink>
                        </Grid>
                    )}
                    {/* DataGrid for students being supervised */}
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                    />
                </div>
            </div>
        );
    }
}

export default SupervisorStudents;