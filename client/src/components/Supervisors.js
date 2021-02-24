import axios from 'axios';
import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect } from 'react-router-dom';

class Supervisors extends Component {
    constructor(props) {
        super(props);
        this.state = { supervisors: [], loading: true, showDialog: false, selectedSupervisor: {} }
    }
    loadSupervisors = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/supervisors')
        .then(res => {
            if (res.data.length > 0) {
                this.setState({ supervisors: res.data, loading: false });
            }
        })
    }
    handleSupervisionRequest = (e) => {
        e.preventDefault();
        axios.post(process.env.REACT_APP_SERVER_URL + 'requests/create', {
            studentID: this.props.user.userId,
            supervisorID: this.state.selectedSupervisor._id,
            title: document.getElementById('txtTitle').value,
            description: document.getElementById('txtDescription').value
        }).then(res => {
            if (res.data===true) {
                this.setState({ showDialog: false, redirect: '/requests' });
            }
        })
    }
    componentDidMount() {
        this.loadSupervisors();
    }
    render() {
        if (this.state.loading) {
            return (
                <div>
                    loading
                </div>
            );
        }
        else {
            if (this.state.redirect) {
                <Redirect to={this.state.redirect} />
            }
            const displaySupervisors = this.state.supervisors.map(s => (
                <Card style={{ marginBottom: 15 }}>
                            <CardContent>
                            <h3>{s.first_name} {s.surname}</h3>
                            </CardContent>
                            <CardActions>
                                <Button 
                                size="small" 
                                color="primary"
                                onClick={()=>{this.setState({ showDialog: true, selectedSupervisor: s })}}
                                >
                                    Request Supervision
                                </Button>
                            </CardActions>
                            </Card>
            ));
            return (
                <div>
                    <h1>Supervisors</h1>
                    <p>
                        You can view all of the Honours Project supervisors below and choose one to submit a supervision request if you are deciding to select your own project topic. <br/>
                        Supervisors will be able to view your request and accept/decline if they feel it is suitable or not. 
                    </p>
                    {displaySupervisors}

                    <Dialog open={this.state.showDialog} onClose={()=>this.setState({ showDialog: false })}>
                        <DialogTitle id="form-dialog-title">Request Project Supervision</DialogTitle>
                        <form onSubmit={this.handleSupervisionRequest}>
                        <DialogContent>
                        <DialogContentText>
                            Fill out the form below with your proposed project information and press submit to request supervision. 
                        </DialogContentText>
                        <h5>Request to: {this.state.selectedSupervisor.first_name} {this.state.selectedSupervisor.surname}</h5>
                        <TextField
                            margin="dense"
                            id="txtTitle"
                            label="Proposed Project Title"
                            fullWidth
                            required
                        /> 
                        <TextField
                            margin="dense"
                            id="txtDescription"
                            label="Description of Project"
                            fullWidth
                            required
                            multiline
                            rows={3}
                        />       
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={()=>{this.setState({ showDialog: false })}} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Submit
                        </Button> 
                        </DialogActions>
                        </form>
                    </Dialog>
                </div>
            );
        }
    }
}
 
export default Supervisors;