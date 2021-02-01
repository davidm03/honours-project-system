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

class Register extends Component {
    constructor(props){
        super(props);
        this.state = { redirect: null, usernameError: null, passwordError: null, confPasswordError: null };
    }
    handleRegister = (e) => {
        e.preventDefault();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var confPassword = document.getElementById('confPassword').value;

        if (password!==confPassword) {
            this.setState({confPasswordError: "Passwords do not match."});
        }
        else{
            axios.post(process.env.REACT_APP_SERVER_URL + 'users/register', {
            username: username,
            password: password
            })
            .then(res => {
                if (res.data===true) {
                    this.setState({redirect: "/"});
                }
                else{
                    if (res.data.error==="username") {
                        this.setState({usernameError: res.data.message});
                    }
                }
            })
        }
    }
    render(){
    const { classes } = this.props;  

    if (this.state.redirect) {
        return <Redirect to={this.state.redirect}/>
    }
    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                error={this.state.usernameError}
                helperText={this.state.usernameError}
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
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
                autoComplete="new-password"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                error={this.state.confPasswordError}
                helperText={this.state.confPasswordError}
                fullWidth
                name="confPassword"
                label="Confirm Password"
                type="confPassword"
                id="confPassword"
                autoComplete="new-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.handleRegister}
              >
                Register
              </Button>
                <Grid container justify="center">          
                <Link href="/login" variant="body2">
                    {"Already have an account? Sign in!"}
                </Link>
                </Grid>
            </form>
          </div>
        </Container>
      );
  }  
}

export default withStyles(useStyles)(Register);