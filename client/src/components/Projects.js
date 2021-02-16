import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import axios from 'axios';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = { supervisors:[] }
    }
    loadSupervisors = () => {
        axios.get(process.env.REACT_APP_SERVER_URL + 'users/supervisors')
        .then(res => {
            if (res.data.length>0) {
                this.setState({ supervisors: res.data });
            }
        });
    }
    getSupervisorName = (id) => {
        var match = this.state.supervisors.find(s => s._id===id);
        console.log(match);
    }
    componentDidMount() {
        this.loadSupervisors();
    }
    render() { 
        const projects = this.props.projects;
        const supervisors = this.state.supervisors;
        var projectDisplay = [];
        
        if (supervisors.length > 0 && projects.length > 0) {    
            for (let index = 0; index < projects.length; index++) {
                const p = projects[index];
                var supervisor = this.state.supervisors.find(s => s._id===p.supervisorID);

                projectDisplay.push(
                    <Card style={{ marginBottom: 15 }}>
                    <CardContent>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <p>
                        Topic Area: {p.topic_area} <br/>
                        Supervisor: {supervisor.first_name} {supervisor.surname}
                    </p>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary">View Project</Button>
                    </CardActions>
                    </Card>
                );
                
            }
        }
        return ( 
        <div>
            <h1>Honours Projects</h1>
            <p>Browse a selection of Honours Project topic ideas that have been put forward by supervisors and select a topic that you feel you would be able to successfully carry out and enjoy.</p>
            <p>Want to select your own topic? Instead you can view all project supervisors and submit a supervision request.</p>
            {projectDisplay}
        </div>
        );
    }
}
 
export default Projects;