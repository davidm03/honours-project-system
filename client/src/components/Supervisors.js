/* 
    David McDowall - Honours Project
    Supervisors.js component which displays the supervisors screen where students can view all supervisors within the system and submit a supervison request
*/

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

/* Supervisors component */
class Supervisors extends Component {
    constructor(props) {
        super(props);
        this.state = { supervisors: this.props.supervisors, showDialog: false, selectedSupervisor: {}, redirect: "" }
    }
    /* Function to handle users submitting a new supervision request */
    handleSupervisionRequest = (e) => {
        // prevent page reload
        e.preventDefault();
        // get the current user
        const user = this.props.user;
        // use axios to send a POST request to the server to create a new request
        axios.post(process.env.REACT_APP_SERVER_URL + 'requests/create', {
            studentID: user.userId,
            supervisorID: this.state.selectedSupervisor._id,
            title: document.getElementById('txtTitle').value,
            description: document.getElementById('txtDescription').value,
            topic_area: document.getElementById('txtTopicArea').value
        }).then(res => {
            // if response success
            if (res.data === true) {
                // reload requests and redirect the user to their requests screen
                this.props.reloadRequests();
                this.setState({ showDialog: false, redirect: '/requests' });
            }
        })
    }
    // render method for processing and displaying the UI
    render() {
        // check if the page is loading
        if (this.state.loading) {
            // display loading message
            return (
                <div>
                    loading
                </div>
            );
        }
        // else if the page had loaded
        else {
            // check if the page needs to redirect
            if (this.state.redirect) {
                // perform redirect
                return <Redirect to={this.state.redirect} />
            }
            // create a card display for each supervisor within the system
            const displaySupervisors = this.state.supervisors.map(s => (
                /* Card style that will be created for each supervisor */
                <Card style={{ marginBottom: 15 }}>
                    <CardContent>
                        <h3>{s.first_name} {s.surname}</h3>
                    </CardContent>
                    { this.props.user.role.includes('STUDENT') && !this.props.projects.find(p => p.studentID === this.props.user.userId) &&
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => {
                                    this.setState({ showDialog: true, selectedSupervisor: s });
                                }}
                            >
                                Request Supervision
                                </Button>
                        </CardActions>
                    }
                </Card>
            ));
            // return the user interface
            return (
                <div>
                    <h1>Supervisors</h1>
                    <p>
                        You can view all of the Honours Project supervisors below and choose one to submit a supervision request if you are deciding to select your own project topic. <br />
                        Supervisors will be able to view your request and accept/decline if they feel it is suitable or not.
                    </p>
                    {/* Display the cards of supervisors */}
                    {displaySupervisors}

                    {/* Dialog for selecting a supervisor and sending them a supervision request */}
                    <Dialog open={this.state.showDialog} onClose={() => this.setState({ showDialog: false })}>
                        <DialogTitle id="form-dialog-title">Request Project Supervision</DialogTitle>
                        {/* HTML form for submitting a supervision request */}
                        <form onSubmit={this.handleSupervisionRequest}>
                            <DialogContent>
                                <DialogContentText>
                                    Fill out the form below with your proposed project information and press submit to request supervision.
                        </DialogContentText>
                                <h5>Request to: {this.state.selectedSupervisor.first_name} {this.state.selectedSupervisor.surname}</h5>
                                {/* Text fields for request info */}
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
                                <TextField
                                    margin="dense"
                                    id="txtTopicArea"
                                    label="Topic Area (e.g. Web Application Development, A.I, Machine Learning)"
                                    fullWidth
                                    required
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => { this.setState({ showDialog: false }) }} color="primary">
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