import React, { Component } from 'react';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import { Button, Grid } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import RestoreIcon from '@material-ui/icons/Restore';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            addProjectDialog: false,
            selectedAvailability: "Yes"
         }
    }
    handleAddNewProject = (event) => {
        event.preventDefault();
        var title = document.getElementById('addProjectTitle').value;
        var description = document.getElementById('addProjectDescription').value;
        var topic_area = document.getElementById('addProjectTopicArea').value;
        var available = true;
        var status;
        var studentID;
        var supervisorID = this.state.selectedSupervisor;

        if (this.state.selectedAvailability==="No") available = false;
        if (document.getElementById('addProjectStatus').value!==null) status = document.getElementById('addProjectStatus').value;
        if (document.getElementById('addProjectStudentID').value!==null) studentID = document.getElementById('addProjectStudentID').value;
        
        axios.post(process.env.REACT_APP_SERVER_URL + "project/add", {
            title: title,
            description: description,
            topic_area: topic_area,
            available: available,
            status: status,
            studentID: studentID,
            supervisorID: supervisorID
        })
        .then(res => {
            if (res.data===true) {
                this.props.loadProjects();
                this.toggleAddProjectDialog();
                this.props.setSuccess("Project successfully added.");
            }
            else {
                this.props.setError("Error: Project could not be added.");
            }
        }) 
    }
    toggleAddProjectDialog = () => {
        var dialog = this.state.addProjectDialog;
        this.setState({ addProjectDialog: !dialog }); 
    }
    render() {
            const menuItems = this.props.supervisors.map(s => (
                <MenuItem value={s._id}>{s.first_name} {s.surname}</MenuItem>
            ));
        return ( 
            <>
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CreateNewFolderIcon />}
                    onClick={this.toggleAddProjectDialog}
                    >
                    Add Project
                    </Button>
                    <Dialog open={this.state.addProjectDialog} onClose={this.toggleAddProjectDialog}>
                        <DialogTitle id="form-dialog-title">Add Project</DialogTitle>
                        <form onSubmit={this.handleAddNewProject}>
                        <DialogContent>
                        <DialogContentText>
                            Enter the details of the new project you wish to add to the system
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="addProjectTitle"
                            label="Title"
                            fullWidth
                            required
                        /> 
                        <TextField
                            margin="dense"
                            id="addProjectDescription"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            required
                        /> 
                        <TextField
                            margin="dense"
                            id="addProjectTopicArea"
                            label="Topic Area"
                            fullWidth
                            required
                        />
                        <div style={{ marginTop: 8 }}>
                            <InputLabel shrink>Available (for selection)</InputLabel>
                            <Select
                            id="selectAvailability"
                            value={this.state.selectedAvailability}
                            onChange={(e)=>{this.setState({ selectedAvailability: e.target.value })}}
                            >
                            <MenuItem value={"Yes"}>Yes</MenuItem>
                            <MenuItem value={"No"}>No</MenuItem>
                            </Select>
                        </div>
                        <TextField
                            margin="dense"
                            id="addProjectStatus"
                            label="Status (leave blank if new project)"
                            fullWidth
                        />
                        <div style={{ marginTop: 8 }}>
                            <InputLabel shrink>Supervisor</InputLabel>
                            <Select
                            id="selectSupervisor"
                            onChange={(e)=>{this.setState({ selectedSupervisor: e.target.value })}}
                            fullWidth
                            >
                            {menuItems}
                            </Select>
                        </div> 
                        <TextField
                            margin="dense"
                            id="addProjectStudentID"
                            label="Student ID (Leave blank if new project)"
                            fullWidth
                        />       
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={this.toggleAddProjectDialog} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Add
                        </Button> 
                        </DialogActions>
                        </form>
                    </Dialog>
                    </>
        );
    }
}

class DeleteProjects extends Component {
    constructor(props) {
        super(props);
        this.state = { deleteProjectsDialog: false }
    }
    handleDeleteProjects = () => {
        axios.post(process.env.REACT_APP_SERVER_URL + 'project/delete', { projectIDs: this.props.selectedProjects })
        .then(res => {
            if (res.data===true) {
                this.props.loadProjects();
                this.toggleDeleteProjectsDialog();
                this.props.clearSelected();
                this.props.setSuccess("Projects successfully deleted.");
            }
            else {
                this.toggleDeleteProjectsDialog();
            }
        });
    }
    toggleDeleteProjectsDialog = () => {
        var dialog = this.state.deleteProjectsDialog;
        this.setState({ deleteProjectsDialog: !dialog });
    }
    render() { 
        return ( 
            <>
                <IconButton onClick={this.toggleDeleteProjectsDialog}>
                    <DeleteIcon/>
                </IconButton>
                <Dialog
                 open={this.state.deleteProjectsDialog}
                 onClose={this.toggleDeleteProjectsDialog}
                 aria-labelledby="alert-dialog-title"
                 aria-describedby="alert-dialog-description"
                 > 
                <DialogTitle id="alert-dialog-title">{"Delete projects?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete {this.props.selectedProjects.length} projects from this application? You will not be able to undo this action. 
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.toggleDeleteProjectsDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleDeleteProjects} color="primary" autoFocus>
                        Yes, I'm sure
                    </Button>
                </DialogActions>
                </Dialog>
            </>
        );
    }
}

class ViewProject extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, project: null }
    }
    loadProjectData = () => {
        var id = this.props.id;
        axios.get(process.env.REACT_APP_SERVER_URL + 'project/view/' + id)
        .then(res => {
            if (res.data.title) {
                this.setState({ loading: false, project: res.data, updateButton: false });
            }
        });
    }
    handleUpdateProject = (e) => {
        e.preventDefault();
        var title = document.getElementById('txtTitle').value;
        var description = document.getElementById('txtDescription').value;
        var topicArea = document.getElementById('txtTopicArea').value;
        axios.post(process.env.REACT_APP_SERVER_URL + "project/update", {
            _id: this.props.id,
            title: title,
            description: description,
            topic_area: topicArea
        })
        .then(res => {
            if (res.data===true) {
                this.setState({ successMessage: "Project successfully updated.", updateButton: false });
                this.loadProjectData();
            }
        })
    }
    revertChanges = () => {
        document.getElementById('txtTitle').value = this.state.project.title;
        document.getElementById('txtDescription').value = this.state.project.description;
        document.getElementById('txtTopicArea').value = this.state.project.topic_area;
        this.setState({ updateButton: false });      
    }
    componentDidMount() {
        this.loadProjectData();
    }
    render() { 
        if (this.state.loading) {
            return 'loading';
        }
        else {
            return (
                <div>
                    <h1>Project</h1>
                    <h2>{this.state.project.title}</h2>
                    <form onSubmit={this.handleUpdateProject}>
                    <TextField
                    id="txtTitle"
                    label="Title"
                    style={{ margin: 8 }}
                    defaultValue={this.state.project.title}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={()=>{this.setState({ updateButton: true })}}
                    />
                    <TextField
                    id="txtDescription"
                    label="Description"
                    style={{ margin: 8 }}
                    defaultValue={this.state.project.description}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={()=>{this.setState({ updateButton: true })}}
                    />
                    <TextField
                    id="txtTopicArea"
                    label="Topic Area"
                    style={{ margin: 8 }}
                    defaultValue={this.state.project.topic_area}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={()=>{this.setState({ updateButton: true })}}
                    />
                    {this.state.updateButton &&
                    <Grid container direction="row">
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RestoreIcon />}
                    style={{ margin: 8 }}
                    onClick={this.revertChanges}
                    >
                    Revert Changes
                    </Button> 
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    type="submit"
                    style={{ margin: 8 }}
                    >
                    Update
                    </Button>
                    </Grid>
                    }                  
                    </form>
                    <Snackbar open={this.state.successMessage} autoHideDuration={6000} onClose={()=>{this.setState({ successMessage: null });}}>
                        <Alert onClose={()=>{this.setState({ successMessage: null });}} severity="success">
                        {this.state.successMessage}
                        </Alert>
                    </Snackbar>
                    <Snackbar open={this.state.errorMessage} autoHideDuration={6000} onClose={()=>{this.setState({ errorMessage: null });}}>
                        <Alert onClose={()=>{this.setState({ errorMessage: null });}} severity="error">
                        {this.state.errorMessage}
                        </Alert>
                    </Snackbar>
                </div>
            );
        }
    }
}
 
export { AddProject, DeleteProjects, ViewProject };