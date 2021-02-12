import React, { Component } from 'react';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            addProjectDialog: false
         }
    }
    handleAddNewProject = (event) => {
        event.preventDefault();
        var title = document.getElementById('addProjectTitle').value;
        var description = document.getElementById('addProjectDescription').value;
        var topic_area = document.getElementById('addProjectTopicArea').value;
        
        axios.post(process.env.REACT_APP_SERVER_URL + "project/add", {
            title: title,
            description: description,
            topic_area: topic_area
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
                            Enter the details of the new project you wish to add to the system.
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
                            required
                        /> 
                        <TextField
                            margin="dense"
                            id="addProjectTopicArea"
                            label="Topic Area"
                            fullWidth
                            required
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
 
export { AddProject, DeleteProjects };