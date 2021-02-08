import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class ProtectedRoute extends Component {
    constructor(props){
        super(props);
        this.state = { loading: true, isTokenValidated: false };
        console.log(props);
    }
    verifyToken = () => {
        axios.post(process.env.REACT_APP_SERVER_URL + 'auth/verify', { token: localStorage.getItem('access-token') })
        .then(res => {
            if (res.data.email) {
                var current = new Date();
                var exp = new Date(res.data.exp * 1000);
                //check if JWT has expired
                if (current >= exp) {
                    this.setState({ loading: false });
                }
                //check if user is required to be admin for route
                else if (this.props.admin && !res.data.role.includes("MODULE_LEADER")) {
                    this.setState({ loading: false });
                }
                //grant access
                else {
                    this.setState({ isTokenValidated: true, user: res.data, loading: false });
                }                
            }
            //no token = no access
            else {
                this.setState({ loading: false });
            }
            //removed else here - no need to return any response if unable to verify?
        })
    }
    componentDidMount() {
        this.verifyToken();
    }
    render() { 
        const Component = this.props.component;
        const user = this.state.user;
        return this.state.isTokenValidated ? (
        <Component user={ user } />
        ) : (
            this.state.loading ? 'Loading...' : <Redirect to={{ pathname: '/login' }} />
        )
    }
}
 
export default ProtectedRoute;