import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LoginForm from './components/login.component';
import Home from './components/home.component';
import MakeReservation from './components/makeReservation.component';
import ViewReservation from './components/viewReservation.component';
import * as Constants from './constants';
import MyContext from "./MyContext";

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

class App extends Component {
  constructor(props) {
    super(props)
    // user state
    this.state = {
      user: null,
      bookings: []
    }
  }

  setBookings = (username) => {
    const obj = {
      username: username
    };
    axios.get(`${Constants.LOCAL_URL}/booking`, { params: obj })
        .then(response => {
            this.setState({ bookings: response.data });
        })
        .catch(function (error) {
            console.error(error);
        })
  };

  cancelBooking = (id) => {
    this.setState({ bookings: this.state.bookings.filter(booking => booking._id !== id) });
  };

  signIn(username, password) {
    this.setBookings(username);
    // we can also call an authentication API here
    axios.post(`${Constants.LOCAL_URL}/user/setUser`, { username, password });
    this.setState({
      user: {
        username,
        password,
      }
    });
  }

  signOut() {
    this.setState({
      user: null,
      bookings: []
    })
  }

  render() {
    const { classes } = this.props;
    return (
        <MyContext.Provider
            value={{
              user: this.state.user,
              bookings: this.state.bookings,
              cancelBooking: this.cancelBooking,
              setBookings: this.setBookings
            }}
        >
          <div>
            <h1>Hotel Reservation System</h1>
            {
              (this.state.user) ?

                <Router>
                  <div className="container">
                    <h3>Welcome {this.state.user.username}!</h3>
                    <AppBar position="static" color="default">
                      <Toolbar>
                        <Typography variant="h6" color="inherit">
                          <Link to={'/'} className="nav-link">Home</Link>
                        </Typography>
                        <Typography variant="h6" color="inherit">
                          <Link to={Constants.MAKE_RESERVATION} className="nav-link">Make a reservation</Link>
                        </Typography>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                          <Link to={Constants.VIEW_BOOKINGS} className="nav-link">View reservations ({ this.state.bookings.length })</Link>
                        </Typography>
                        <Button href="/" onClick={this.signOut.bind(this)} color="inherit">Sign Out</Button>
                      </Toolbar>
                    </AppBar>
                    <Switch>
                      <Route exact path='/' component={ Home } />
                      <Route exact path={Constants.MAKE_RESERVATION}
                             render={() => <MakeReservation {...this.state} {...this.props} />}/>
                      <Route exact path={Constants.VIEW_BOOKINGS}
                             render={() => <ViewReservation {...this.state} />}/>
                    </Switch>
                  </div>
                </Router>
                :
                <LoginForm
                  onSignIn={this.signIn.bind(this)}
                />
            }
          </div>
        </MyContext.Provider>
    );
  }
}

export default withStyles(styles)(App);
