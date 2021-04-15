/* 
    David McDowall - Honours Project
    MyRequests.js component which processes and displays the MyRequests page displaying all of a users sent or recieved requests
*/

import React, { Component } from 'react';
import axios from 'axios';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Tabs, Tab } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

/* MyRequests component */
class MyRequests extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, userData: [], tabValue: 0 }
    }
    /* Function for handling a request action (accept/decline) 
        Params: request id and accept/decline action
    */
    handleRequestAction = (id, action) => {
        // use axios to send POST request to server to carry out accept or decline action
        axios.post(process.env.REACT_APP_SERVER_URL + 'requests/' + action, {
            requestID: id
        })
            .then(res => {
                // if response success
                if (res.data === true) {
                    //reload requests and projects
                    this.props.loadRequests();
                    this.props.loadProjects();
                }
            })
    }
    /* Function for loading user data 
        Params: user type (students/supervisors)
    */
    loadData = (type) => {
        // use axios to send GET request to server to get the user data
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/' + type)
            .then(res => {
                // if response contains data
                if (res.data.length > 0) {
                    // store data inside state
                    this.setState({ userData: res.data, loading: false });
                }
                else {
                    this.setState({ loading: false });
                }
            })
    }
    /* ComponentDidMount method runs when component has successfully mounted */
    componentDidMount() {
        // check if user is student
        if (this.props.user.role.includes("STUDENT")) {
            // load supervisor data
            this.loadData("supervisors");
        }
        // if user is NOT student
        else {
            // load student data
            this.loadData("students");
        }
    }
    /* Render method processes and renders UI */
    render() {
        // check if page is loading
        if (this.state.loading) {
            // display loading message
            return "loading..."
        }
        // else if page has loaded
        else {
            // get user, requests, and check if user is student
            const user = this.props.user;
            const isStudent = user.role.includes("STUDENT");
            const requests = this.props.requests;
            var pendingRequests = [], acceptedRequests = [], declinedRequests = [];

            // if user is a student
            if (isStudent) {
                // loop through all requests
                for (let index = 0; index < requests.length; index++) {
                    // get current request
                    const req = requests[index];
                    // find associated request supervisor
                    const supervisor = this.state.userData.find(user => user._id === req.supervisorID);
                    // if request is pending
                    if (req.status === "Pending") {
                        // add to pending request collection
                        pendingRequests.push(
                            <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Submitted To: {supervisor.first_name} {supervisor.surname}</h4>
                                    <h4>Contact: {supervisor.email}</h4>
                                    <p>Description of project: {req.description}</p>
                                </CardContent>
                                <CardActions>
                                    {req.status === "Pending" && (
                                        <Alert severity="warning" style={{ width: "100%" }}>Request Pending</Alert>
                                    )}
                                    {req.status === "Accepted" && (
                                        <Alert severity="success" style={{ width: "100%" }}>Request Accepted</Alert>
                                    )}
                                    {req.status === "Declined" && (
                                        <Alert severity="danger" style={{ width: "100%" }}>Request Declined</Alert>
                                    )}
                                </CardActions>
                            </Card>
                        );
                    }
                    // else if request has been accepted
                    else if (req.status === "Accepted") {
                        // add to accepted requests collection
                        acceptedRequests.push(
                            <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Submitted To: {supervisor.first_name} {supervisor.surname}</h4>
                                    <h4>Contact: {supervisor.email}</h4>
                                    <p>Description of project: {req.description}</p>
                                </CardContent>
                                <CardActions>
                                    {req.status === "Pending" && (
                                        <Alert variant="outlined" severity="warning" style={{ width: "100%" }}>Request Pending</Alert>
                                    )}
                                    {req.status === "Accepted" && (
                                        <Alert variant="outlined" severity="success" style={{ width: "100%" }}>Request Accepted</Alert>
                                    )}
                                    {req.status === "Declined" && (
                                        <Alert variant="outlined" severity="danger" style={{ width: "100%" }}>Request Declined</Alert>
                                    )}
                                </CardActions>
                            </Card>
                        );
                    }
                    // else request has been declined
                    else {
                        // add to declined requests collection
                        declinedRequests.push(
                            <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Submitted To: {supervisor.first_name} {supervisor.surname}</h4>
                                    <h4>Contact: {supervisor.email}</h4>
                                    <p>Description of project: {req.description}</p>
                                </CardContent>
                                <CardActions>
                                    {req.status === "Pending" && (
                                        <Alert severity="warning" style={{ width: "100%" }}>Request Pending</Alert>
                                    )}
                                    {req.status === "Accepted" && (
                                        <Alert severity="success" style={{ width: "100%" }}>Request Accepted</Alert>
                                    )}
                                    {req.status === "Declined" && (
                                        <Alert severity="error" style={{ width: "100%" }}>Request Declined</Alert>
                                    )}
                                </CardActions>
                            </Card>
                        );
                    }
                }
            }
            // else if user is not student
            else {
                // loop through requests
                for (let index = 0; index < requests.length; index++) {
                    // get current request
                    const req = requests[index];
                    // find associated student with the request
                    const student = this.state.userData.find(user => user._id === req.studentID)
                    // if request is pending
                    if (req.status === "Pending") {
                        // add request to pending collection
                        pendingRequests.push(
                            <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Requesting Student: {student.first_name} {student.surname}</h4>
                                    <h4>Contact: {student.email}</h4>
                                    <p>
                                        Description of project: {req.description} <br /> <br />
                                        Topic Area: {req.topic_area}
                                    </p>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => this.handleRequestAction(req._id, "accept")}
                                    >
                                        Accept
                                        </Button>
                                    <Button
                                        size="small"
                                        color="secondary"
                                        onClick={() => this.handleRequestAction(req._id, "decline")}
                                    >
                                        Decline
                                        </Button>
                                </CardActions>
                            </Card>
                        );
                    }
                    // else if request has been accepted
                    else if (req.status === "Accepted") {
                        // add request to accepted collection
                        acceptedRequests.push(
                            <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Requesting Student: {student.first_name} {student.surname}</h4>
                                    <h4>Contact: {student.email}</h4>
                                    <p>
                                        Description of project: {req.description} <br /> <br />
                                        Topic Area: {req.topic_area}
                                    </p>
                                </CardContent>
                                <CardActions>
                                    <Alert variant="outlined" severity="success" style={{ width: "100%" }}>Request Accepted</Alert>
                                </CardActions>
                            </Card>
                        );
                    }
                    // else request has been declined 
                    else {
                        // add request to declined collection
                        declinedRequests.push(
                            <Card style={{ marginBottom: 15 }}>
                                <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Requesting Student: {student.first_name} {student.surname}</h4>
                                    <h4>Contact: {student.email}</h4>
                                    <p>
                                        Description of project: {req.description} <br /> <br />
                                        Topic Area: {req.topic_area}
                                    </p>
                                </CardContent>
                                <CardActions>
                                    <Alert variant="outlined" severity="error" style={{ width: "100%" }}>Request Declined</Alert>
                                </CardActions>
                            </Card>
                        );
                    }
                }
            }
            /* Return the UI */
            return (
                <div>
                    <h1>My Requests</h1>
                    <p>View the requests you have submitted to supervisors for supervision of your own project topic idea.</p>
                    {/* Tab navigation for displaying pending, accepted and declined requests */}
                    <Tabs
                        value={this.state.tabValue}
                        onChange={(e, val) => this.setState({ tabValue: val })}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        style={{ marginBottom: 20 }}
                    >
                        <Tab label={"Pending (" + pendingRequests.length + ")"} />
                        <Tab label={"Accepted (" + acceptedRequests.length + ")"} />
                        <Tab label={"Declined (" + declinedRequests.length + ")"} />
                    </Tabs>
                    {/* Display requests depending on selection */}
                    {this.state.tabValue === 0 && (
                        <>
                            {/* No requests found message */}
                            {pendingRequests.length > 0 ? (<>{pendingRequests}</>) :
                                (<Alert severity="warning" style={{ width: "100%" }}>No Pending Requests</Alert>)}
                        </>
                    )}
                    {this.state.tabValue === 1 && (
                        <>
                            {/* No requests found message */}
                            {acceptedRequests.length > 0 ? (<>{acceptedRequests}</>) :
                                (<Alert severity="warning" style={{ width: "100%" }}>No Accepted Requests</Alert>)}
                        </>
                    )}
                    {this.state.tabValue === 2 && (
                        <>
                            {/* No requests found message */}
                            {declinedRequests.length > 0 ? (<>{declinedRequests}</>) :
                                (<Alert severity="warning" style={{ width: "100%" }}>No Declined Requests</Alert>)}
                        </>
                    )}
                </div>
            )
        }
    }
}

export default MyRequests;