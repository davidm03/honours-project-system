import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class ProtectedRoute extends Component {
    /* verifyToken = () => {
        console.log(localStorage.getItem('access-token'));
        axios.post(process.env.REACT_APP_SERVER_URL + 'auth/verify', {token: localStorage.getItem('access-token')})
        .then(res => {
            if (res.data.username) {
                //this.setState({user:{username: res.data.username, id: res.data.userId}}); - CRASHING
                return true;
            }
            //removed else here - no need to return any response if unable to verify?
        })
    } */
    render() { 
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('access-token');
        return  isAuthenticated ? (
            <Component/>
        ) : (
            <Redirect to={{ pathname: '/login' }} />
        );
    }
}
 
export default ProtectedRoute;