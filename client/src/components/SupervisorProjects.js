import React, { Component } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Typography } from '@material-ui/core';
import axios from 'axios';
import { Backdrop, CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect } from 'react-router';

import { CSVLink } from 'react-csv';
import GetAppIcon from '@material-ui/icons/GetApp';

class SupervisorProjects extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedProjects: [], newProjectDialog: false, redirect: null, loading: true, projects: [], students: [] }
    }
    handleAddNewProject = (e) => {
        e.preventDefault();
        const user = this.props.data.user;
        var title = document.getElementById('txtProjectTitle').value;
        var description = document.getElementById('txtProjectDescription').value;
        var topic_area = document.getElementById('txtTopicArea').value;
        axios.post(process.env.REACT_APP_SERVER_URL + "project/add", {
            title: title,
            description: description,
            topic_area: topic_area,
            available: true,
            supervisorID: user.userId,
            noStudent: true
        }).then(res => {
            if (res.data) {
                this.props.reloadProjects();
            }
        })
    }
    handleDeleteProjects = () => {
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/delete', { projectIDs: this.state.selectedProjects })
        .then(res => {
            if (res.data===true) {
                this.props.reloadProjects();
                this.setState({ selectedProjects: [] }); 
            }
        });
    }
    componentDidMount() {
        if (this.props.data.projects && this.props.data.students) {
            this.setState({ projects: this.props.data.projects, students: this.props.data.students, loading: false });
        }
        else {
            this.setState({ loading: false });
        }
    }
    render() {
        var projects = [], students = []; 
        var columns1 = [], columns2 = []; 
        var rows1 = [], rows2 = [];
        var headers = [];
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }
        if (this.state.loading) {
            return (
                <Backdrop open={true}>
                        <CircularProgress color="inherit" />
                </Backdrop>
            );
        }
        else {
            projects = this.state.projects;
            students = this.state.students;
            columns1 = [
                {field: 'id', headerName: 'ID', width: 250, hide: true},
                {field: 'title', headerName: 'Project Title', width: 300},
                {field: 'description', headerName: 'Description', width: 650},
                {field: 'topic_area', headerName: 'Topic Area', width: 230}
            ];
            columns2 = [
                {field: 'id', headerName: 'ID', width: 250, hide: true},
                {field: 'title', headerName: 'Project Title', width: 500},
                {field: 'status', headerName: 'Status', width: 300},
                {field: 'student_name', headerName: 'Student', width: 300},
                {
                    field: "actions",
                    headerName: 'Actions',
                    width: 130,
                    renderCell: () => (
                    <strong>
                        <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={()=> {
                            var selectedID = this.state.selectedProjects.pop();
                            this.setState({ redirect: "/supervisor/project/" + selectedID });
                        }}
                        >
                        View
                        </Button>
                    </strong>
                    ),
                }
            ];
            if (projects.length > 0) {
                var len = projects.length, i = 0;
                while (i < len) {
                    const project = projects[i];
                    if (project.available) {
                        rows1.push({
                            id: project._id,
                            title: project.title,
                            description: project.description,
                            topic_area: project.topic_area
                        });
                    }
                    else {
                        const student = students.find(s => s._id === project.studentID);
                        rows2.push({
                            id: project._id,
                            title: project.title,
                            status: project.status,
                            student_name: student.first_name + " " + student.surname, 

                        });
                    }
                    i++;
                }
            } 
            headers = [
                { label: "ProjectID", key: "id" },
                { label: "Project Title", key: "project" },
                { label: "Status", key: "status" },
                { label: "Student", key: "student_name" }
            ];
        }
        return (
            <div>
                <h1>My Projects</h1>
                <p>View your available pre-defined projects that can be selected by students and all current on going projects you are supervising.</p>
                <h2>Available Pre-Defined Projects</h2>
                <p>Available projects that you have suggested for students to select for their honours project.</p>
                <Grid container direction="row">
                    <Grid item>
                    <Button variant="contained" color="primary" endIcon={<AddIcon/>} onClick={()=>this.setState({ newProjectDialog: true })}>New Project</Button>
                    <IconButton onClick={()=>{
                            this.props.reloadProjects();
                    }}>
                        <RefreshIcon />
                    </IconButton>
                    {this.state.selectedProjects.length > 0 && (
                        <IconButton onClick={()=>{
                            this.handleDeleteProjects();
                    }}>
                        <DeleteIcon />
                    </IconButton>
                    )}
                    </Grid>
                </Grid>
                <div style={{ height: 300, width: '100%', marginTop: 15 }}>
                <DataGrid 
                rows={rows1} 
                columns={columns1} 
                pageSize={5}
                checkboxSelection
                onSelectionChange={(newSelection)=>{
                    this.setState({ selectedProjects: newSelection.rowIds });
                }}
                />

                <h2>Projects Under Supervision</h2>
                {rows2.length > 0 && (
                <Grid container justify="flex-end" style={{ marginBottom: 20 }}>
                    <CSVLink style={{ textDecoration: 'none' }} data={rows2} headers={headers} filename="honours_projects_export.csv">
                        <Button variant="contained" color="primary" endIcon={<GetAppIcon/>}>Export Projects</Button>
                    </CSVLink>
                </Grid>
                )}
                <DataGrid 
                rows={rows2} 
                columns={columns2} 
                pageSize={5}
                onSelectionChange={(newSelection)=>{
                    this.setState({ selectedProjects: newSelection.rowIds });
                }}
                />

                <Dialog open={this.state.newProjectDialog} onClose={()=>this.setState({ newProjectDialog: false })}>
                        <DialogTitle id="form-dialog-title">Add New Project</DialogTitle>
                        <form onSubmit={this.handleAddNewProject}>
                        <DialogContent>
                        <DialogContentText>
                            Enter the details of the new pre-defined project you would like to add. <br/> <br/>
                            <b>Note: </b> This project/information will be visible to all students and available for selection under your supervison. 
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="txtProjectTitle"
                            label="Project Title"
                            fullWidth
                            required
                        /> 
                        <TextField
                        id="txtProjectDescription"
                        label="Description"
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        style={{ marginTop: 15 }}
                        fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="txtTopicArea"
                            label="Topic Area"
                            fullWidth
                            required
                        />            
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={()=>this.setState({ newProjectDialog: false })} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Add
                        </Button> 
                        </DialogActions>
                        </form>
                    </Dialog>
                </div>
            </div>
        );
    }
}
 
export default SupervisorProjects;