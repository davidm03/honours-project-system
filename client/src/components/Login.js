/* 
  David McDowall - Honours Project
  Login.js component that processes and displays the login screen
*/

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import React, { Component } from 'react';

/* Function for setting page styles */
const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

/* Login component */
class Login extends Component {
  constructor(props) {
    super(props);
    // Component state
    this.state = { redirect: null, usernameError: null, passwordError: null };
  }
  /* Function for handling user login */
  handleLogin = (e) => {
    // prevent page reload
    e.preventDefault();
    // get email and password from textboxes
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    // use axios to sent POST request to server to authenticate user
    axios.post(process.env.REACT_APP_SERVER_URL + 'auth/login', {
      email: email,
      password: password
    })
      .then(res => {
        // if response is success
        if (res.data.success) {
          // store the response access token in local storage and redirect to home page
          localStorage.setItem('access-token', res.data.token);
          this.setState({ redirect: "/" });
        }
        // else if response is fail
        else {
          // check for email error
          if (res.data.error === "email") {
            // display email error message
            this.setState({ emailError: res.data.message, passwordError: null });
          }
          // password error
          else {
            // display password error message
            this.setState({ passwordError: res.data.message, emailError: null });
          }
        }
      })
  }
  /* Render method for rendering UI display */
  render() {
    const { classes } = this.props;

    // check for redirects
    if (this.state.redirect) {
      // perform redirect
      return <Redirect to={this.state.redirect} />
    }
    /* Return code to be displayed on screen
      Login form
    */
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
            </Typography>
          {/* Login HTML Form */}
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={this.state.emailError}
              helperText={this.state.emailError}
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={this.state.passwordError}
              helperText={this.state.passwordError}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleLogin}
            >
              Sign In
              </Button>
            <Grid container justify="center">
              <Grid item>
                <Link href="/register/student" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(Login);