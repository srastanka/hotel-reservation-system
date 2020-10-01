import React, { Component } from 'react';
import TableRow from './TableRow';
import MyContext from '../MyContext';

class ViewReservation extends Component {

  constructor(props) {
    super(props);
  }
  tabRow(bookings){
    return bookings.map(function(booking, i){
      return <TableRow obj={booking} key={i} />;
    });
  }
  render() {
    return (
        <MyContext.Consumer>
          {context => (
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
              { this.tabRow(context.bookings) }
              </tbody>
            </table>
            <span><b>Total number of your reservations</b> : {context.bookings.length}</span>
          </div>
              )}
        </MyContext.Consumer>
    );
  }
}

export default ViewReservation;