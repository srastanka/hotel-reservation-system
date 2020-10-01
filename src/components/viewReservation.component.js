import React, { Component } from 'react';
import axios from 'axios';
import TableRow from './TableRow';
import * as Constants from "../constants";


class ViewReservation extends Component {

  constructor(props) {
    super(props);
    this.state = {bookings: []};
  }
  componentDidMount(){
    const obj = {
      username: this.props.user.username
    };
    axios.get(`${Constants.LOCAL_URL}/booking`, { params: obj })
      .then(response => {
        this.setState({ bookings: response.data });
      })
      .catch(function (error) {
        console.error(error);
      })
  }
  tabRow(){
    return this.state.bookings.map(function(booking, i){
      return <TableRow obj={booking} key={i} />;
    });
  }
  render() {
    return (
      <div>
        <h3 align="center">Your reservations</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
          <tr>
            <th>Room</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th colSpan="2">Action</th>
          </tr>
          </thead>
          <tbody>
          { this.tabRow() }
          </tbody>
        </table>
        <span><b>Total number of your reservations</b> : {this.state.bookings.length}</span>
      </div>
    );
  }
}

export default ViewReservation;