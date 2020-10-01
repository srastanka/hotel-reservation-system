import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: '',
      password: ''
    }
  }

  onChangeUsername(username) {
    this.setState({
      ...this.state,
      username: username.target.value
    });
  }

  onChangePassword(password) {
    this.setState({
      ...this.state,
      password: password.target.value
    });
  }

  handleSignIn(e) {
    e.preventDefault()
    this.props.onSignIn(this.state.username, this.state.password);
  }

  render() {
    return (
      <form onSubmit={this.handleSignIn.bind(this)}>
        <h3>Sign in</h3>
        <TextField
          required
          id="standard-required"
          label="Username"
          margin="normal"
          onChange={this.onChangeUsername}
        />
        <br/>
        <TextField
          required
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="normal"
          onChange={this.onChangePassword}
        />
        <br/>
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </form>
    )
  }

}

LoginForm.propTypes = {
  onSignIn: PropTypes.func.isRequired,
};

export default LoginForm;
