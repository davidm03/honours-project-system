/* 
    David McDowall - Honours Project
    ProtectedRoute.js Route component which extends a normal React Router Route but protects access to authorised parties only.
*/

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

/* ProtectedRoute Component */
class ProtectedRoute extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, isTokenValidated: false };
    }
    /* Function to communicate with the server and verify a JSON Web Token */
    verifyToken = () => {
        // use axios to send a POST request to the server to verify the JWT found in local storage
        axios.post(process.env.REACT_APP_SERVER_URL + 'auth/verify', { token: localStorage.getItem('access-token') })
            .then(res => {
                // if response contains a user
                if (res.data.email) {
                    // get the current date and expiry date of the token
                    var current = new Date();
                    var exp = new Date(res.data.exp * 1000);
                    //check if JWT has expired
                    if (current >= exp) {
                        // if expired - page has loaded
                        this.setState({ loading: false });
                    }
                    //check if user is required to be admin for route
                    else if (this.props.admin && !res.data.role.includes("MODULE_LEADER")) {
                        // page has loaded
                        this.setState({ loading: false });
                    }
                    //check if user is required to be supervisor for route
                    else if (this.props.supervisor && !res.data.role.includes("SUPERVISOR")) {
                        // page has loaded
                        this.setState({ loading: false });
                    }
                    // else grant access
                    else {
                        // update state as token is valid, set user data and page has loaded
                        this.setState({ isTokenValidated: true, user: res.data, loading: false });
                    }
                }
                //no token = no access
                else {
                    // page has loaded
                    this.setState({ loading: false });
                }
            })
    }
    /* ComponentDidMount method runs when the component has successfully mounted */
    componentDidMount() {
        // call method to verify the JWT
        this.verifyToken();
    }
    /* Render method to process and render the UI */
    render() {
        // get the Component that the user is trying to access
        const Component = this.props.component;
        // get the current user
        const user = this.state.user;
        /* 
            Conditional render
            If token is valid - render component
            Else - either render loading message or redirect back to login (if auth fails)
        */
        return this.state.isTokenValidated ? (
            <Component user={user} id={this.props.computedMatch.params.id ? this.props.computedMatch.params.id : null} />
        ) : (
            this.state.loading ? 'Loading...' : <Redirect to={{ pathname: '/login' }} />
        )
    }
}

export default ProtectedRoute;