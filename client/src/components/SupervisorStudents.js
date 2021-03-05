import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';

class SupervisorStudents extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedStudents: [] }
    }
    render() {
        const students = this.props.data.students;
        const projects = this.props.data.projects;
        const columns = [
            {field: 'id', headerName: 'ID', width: 250, hide: true},
            {field: 'first_name', headerName: 'First Name', width: 150},
            {field: 'surname', headerName: 'Surname', width: 150},
            {field: 'email', headerName: 'Email', width: 200},
            {field: 'project', headerName: 'Project', width: 550},
            {field: 'last_login', headerName: 'Last Login', width: '100%'}
        ]; 
        const rows = [];
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
        return ( 
            <div>
                <h1>My Students</h1>
                <p>View all of the students currently under your supervisor.</p>
                <div style={{ height: 700, width: '100%' }}>
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