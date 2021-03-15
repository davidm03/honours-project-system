import React, { Component } from 'react';
import axios from 'axios';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Tabs, Tab } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';

class MyRequests extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, userData: [], tabValue: 0 }
    }
    handleRequestAction = (id, action) => {
        axios.post(process.env.REACT_APP_SERVER_URL + 'requests/' + action, {
            requestID: id
        })
        .then(res => {
            if (res.data === true) {                
                this.props.loadRequests();
            }            
        })
    }
    loadData = (type) => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/' + type)
        .then(res => {
            if (res.data.length > 0) {
                this.setState({ userData: res.data, loading: false });
            }
        })
    }
    componentDidMount() {
        if (this.props.user.role.includes("STUDENT")) {
            this.loadData("supervisors");
        }
        else {
            this.loadData("students");
        }
    }
    render() {
        if (this.state.loading) {
            return "loading..."
        }
        else {
            const user = this.props.user;
            const isStudent = user.role.includes("STUDENT");
            const requests = this.props.requests;
            var pendingRequests = [], acceptedRequests = [], declinedRequests = [];
            
            if (isStudent) {
                for (let index = 0; index < requests.length; index++) {
                    const req = requests[index];
                    const supervisor = this.state.userData.find(user => user._id === req.supervisorID);
                    if (req.status === "Pending") {
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
                    else if (req.status === "Accepted") {
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
                    else {
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
                                   <Alert severity="danger" style={{ width: "100%" }}>Request Declined</Alert> 
                                )}                            
                                </CardActions>
                            </Card>  
                        );  
                    } 
                }
            }
            else {
                for (let index = 0; index < requests.length; index++) {
                    const req = requests[index];
                        const student = this.state.userData.find(user => user._id === req.studentID)
                        if (req.status === "Pending") {
                            pendingRequests.push(
                                <Card style={{ marginBottom: 15 }}>
                                    <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Requesting Student: {student.first_name} {student.surname}</h4>
                                    <h4>Contact: {student.email}</h4>
                                    <p>
                                        Description of project: {req.description} <br/> <br/>
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
                                        onClick={()=>this.handleRequestAction(req._id, "decline")}
                                        >
                                            Decline
                                        </Button>
                                    </CardActions>
                                </Card>
                                );
                        }
                        else if (req.status === "Accepted") {
                            acceptedRequests.push(
                                <Card style={{ marginBottom: 15 }}>
                                    <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Requesting Student: {student.first_name} {student.surname}</h4>
                                    <h4>Contact: {student.email}</h4>
                                    <p>
                                        Description of project: {req.description} <br/> <br/>
                                        Topic Area: {req.topic_area}
                                    </p>
                                    </CardContent>
                                    <CardActions>
                                        <Alert variant="outlined" severity="success" style={{ width: "100%" }}>Request Accepted</Alert>
                                    </CardActions>
                                </Card>
                                );
                        }
                        else {
                            declinedRequests.push(
                                <Card style={{ marginBottom: 15 }}>
                                    <CardContent>
                                    <h3>{req.title}</h3>
                                    <h4>Requesting Student: {student.first_name} {student.surname}</h4>
                                    <h4>Contact: {student.email}</h4>
                                    <p>
                                        Description of project: {req.description} <br/> <br/>
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

            return (
                <div>
                    <h1>My Requests</h1>
                    <p>View the requests you have submitted to supervisors for supervision of your own project topic idea.</p>
                    <Tabs
                        value={this.state.tabValue}
                        onChange={(e, val)=>this.setState({ tabValue: val })}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        style={{ marginBottom: 20 }}
                    >
                        <Tab label={"Pending (" + pendingRequests.length + ")"} />
                        <Tab label={"Accepted (" + acceptedRequests.length + ")"} />
                        <Tab label={"Declined (" + declinedRequests.length + ")"} />
                    </Tabs>
                    {this.state.tabValue === 0 && (
                        <>
                        {pendingRequests.length > 0 ? (<>{pendingRequests}</>) : 
                        (<Alert severity="warning" style={{ width: "100%" }}>No Pending Requests</Alert>) }
                        </>
                    )}
                    {this.state.tabValue === 1 && (
                        <>
                        {acceptedRequests.length > 0 ? (<>{acceptedRequests}</>) : 
                        (<Alert severity="warning" style={{ width: "100%" }}>No Accepted Requests</Alert>) }
                        </>
                    )}
                    {this.state.tabValue === 2 && (
                        <>
                        {declinedRequests.length > 0 ? (<>{declinedRequests}</>) : 
                        (<Alert severity="warning" style={{ width: "100%" }}>No Declined Requests</Alert>) }
                        </>
                    )}
                </div>
            )
        }
    }
}
 
export default MyRequests;