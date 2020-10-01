import React, { Component } from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import * as Constants from '../constants';
const moment = require('moment');

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.cancelReservation = this.cancelReservation.bind(this);
  }
  cancelReservation() {
    axios.delete(`${Constants.LOCAL_URL}${Constants.CANCEL_BOOKING}/${this.props.obj._id}`)
      .then((res) => {
        this.props.history.push(Constants.MAKE_RESERVATION);
      })
      .catch(err => console.error(err));
  }
  render() {
    return (
      <tr>
        <td>
          {this.props.obj.room}
        </td>
        <td>
          {moment(this.props.obj.startDate).format('MM/DD/YYYY')}
        </td>
        <td>
          {moment(this.props.obj.endDate).format('MM/DD/YYYY')}
        </td>
        <td>
          <button onClick={this.cancelReservation} className="btn btn-danger">Cancel reservation</button>
        </td>
      </tr>
    );
  }
}

export default withRouter(TableRow);
