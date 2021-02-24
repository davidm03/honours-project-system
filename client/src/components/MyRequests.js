import React, { Component } from 'react';
import axios from 'axios';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

class MyRequests extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, userData: [] }
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
            const requests = this.props.requests;
            var displayRequests = [];
            
            if (user.role.includes("STUDENT")) {
                
            }
            else {
                for (let index = 0; index < requests.length; index++) {
                    const req = requests[index];
                    const student = this.state.userData.find(user => user._id === req.studentID)
                    displayRequests.push(
                        <Card style={{ marginBottom: 15 }}>
                            <CardContent>
                            <h3>{req.title}</h3>
                            <h4>Requesting Student: {student.first_name} {student.surname}</h4>
                            <h4>Contact: {student.email}</h4>
                            <p>Description of project: {req.description}</p>
                            </CardContent>
                            <CardActions>
                                <Button 
                                size="small" 
                                color="primary"
                                >
                                    Accept
                                </Button>
                                <Button 
                                size="small" 
                                color="secondary"
                                >
                                    Decline
                                </Button>
                            </CardActions>
                        </Card>
                    );                    
                }
            }

            return user.role.includes("STUDENT") ? (
                <div>
                    <h1>My Requests</h1>
                    <p>View the requests you have submitted to supervisors for supervision of your own project topic idea.</p>
                </div>
            ) : 
            (
                <div>
                    <h1>My Requests</h1>
                    <p>View requests from students who wish to use their own project topic idea and wish for you to be their supervisor. <br/> <br/>
                        View the requests below and decide if you wish to accept or decline the requests. </p>
                    {displayRequests}
                </div>
            );
        }
    }
}
 
export default MyRequests;