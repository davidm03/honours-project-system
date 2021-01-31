import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class ProtectedRoute extends Component {
    render() { 
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('access-token');
        return  isAuthenticated ? (
            <Component />
        ) : (
            <Redirect to={{ pathname: '/login' }} />
        );
    }
}
 
export default ProtectedRoute;