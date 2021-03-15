import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Backdrop, CircularProgress } from '@material-ui/core'; 
import { CSVLink } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Button, Grid } from '@material-ui/core';

class SupervisorStudents extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedStudents: [], downloadData: [], downloadHeaders: [], filename: "", students: [], loading: true }
    }
    componentDidMount() {
        if (this.props.data.students) {
            this.setState({ students: this.props.data.students, loading: false });
        }
        else {
            this.setState({ loading: false });
        }
    }
    render() {
        var students = [], projects = []; 
        var rows = [], columns = [], headers = []; 
        if (this.state.loading) {
            return (
                <Backdrop open={true}>
                        <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        else {
            students = this.state.students;
            projects = this.props.data.projects;
            columns = [
                {field: 'id', headerName: 'ID', width: 250, hide: true},
                {field: 'first_name', headerName: 'First Name', width: 150},
                {field: 'surname', headerName: 'Surname', width: 150},
                {field: 'email', headerName: 'Email', width: 200},
                {field: 'project', headerName: 'Project', width: 550},
                {field: 'last_login', headerName: 'Last Login', width: '100%'}
            ]; 
            rows = [];
            if (students.length > 0) {
                var len = students.length, i = 0;
                while (i < len) {
                    const student = students[i];
                    var lastLogin = new Date(student.last_login * 1000).toLocaleDateString('en-GB');
                    const project = projects.find(project => project.studentID === student._id);
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
            headers = [
                { label: "StudentID", key: "id" },
                { label: "First Name", key: "first_name" },
                { label: "Surname", key: "surname" },
                { label: "Email", key: "email" },
                { label: "Project Title", key: "project" },
                { label: "Last Login", key: "last_login" }
            ];
        }
        return ( 
            <div>
                <h1>My Students</h1>
                <p>View all of the students currently under your supervisor.</p>
                <div style={{ height: 700, width: '100%' }}>
                {students.length > 0 && (
                <Grid container justify="flex-end" style={{ marginBottom: 20 }}>
                    <CSVLink style={{ textDecoration: 'none' }} data={rows} headers={headers} filename="honours_students_export.csv">
                        <Button variant="contained" color="primary" endIcon={<GetAppIcon/>}>Export Students</Button>
                    </CSVLink>
                </Grid>
                )}
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