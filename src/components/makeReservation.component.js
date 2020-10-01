import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { addDays } from 'date-fns';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import 'react-datepicker/dist/react-datepicker.css';
import * as Constants from "../constants";
import MyContext from "../MyContext";

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  grow: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class MakeReservation extends Component {
  constructor(props) {
    super(props);
    this.onChangeCheckInDate = this.onChangeCheckInDate.bind(this);
    this.onChangeCheckOutDate = this.onChangeCheckOutDate.bind(this);
    this.onChangeRoom = this.onChangeRoom.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getRoomsList = this.getRoomsList.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.validateStayDates = this.validateStayDates.bind(this);
    this.updateAvailableRooms = this.updateAvailableRooms.bind(this);

    this.state = {
      room: '',
      roomid: '',
      roomsList: [],
      checkin: new Date(),
      checkout: addDays(new Date(), 1),
      modalOpen: false,
      modalHeader: 'Error!',
      modalMessage: ''
    }
  }

  componentDidMount() {
    // load the available rooms
    axios.get(`${Constants.LOCAL_URL}/room`)
      .then(res => {
        this.setState({
          ...this.state,
          roomsList: res.data
        });
      });
  }

  onChangeRoom = (h, obj) => {
    this.setState({
      ...this.state,
      roomid: obj.key,
      room: h.target.value
    });
  }

  updateAvailableRooms(obj) {
    axios.post(`${Constants.LOCAL_URL}/room/available`, obj)
      .then(res => {
        this.setState({
          ...this.state,
          checkin: obj.checkin,
          checkout: obj.checkout,
          // update rooms list
          roomsList: res.data
        });
      })
      .catch(e => {
        this.setState({
          ...this.state,
          modalOpen: true,
          modalHeader: 'Sold out',
          modalMessage: 'No rooms available on this date. Please select a different checkin date.'
        });
      });
  }

  onChangeCheckInDate(d) {
    const obj = {
      checkin: d,
      checkout: addDays(d, 1)
    };
    this.updateAvailableRooms(obj);
  }

  onChangeCheckOutDate(d) {
    const obj = {
      checkin: this.state.checkin,
      checkout: d
    };
    // update available rooms only for a valid date range (checkin < checkout)
    if(this.state.checkin<d) {
      this.updateAvailableRooms(obj);
    } else {
      this.setState({
        ...this.state,
        checkout: d
      });
    }
  }

  handleModalClose() {
    this.setState({
      ...this.state,
      modalOpen: false,
      modalMessage: ''
    });
  }

  onSubmit(e) {
    e.preventDefault();
    // validate that a room is selected
    if (!this.state.room) {
      this.setState({
        ...this.state,
        modalOpen: true,
        modalHeader: 'Room is required',
        modalMessage: 'Please select a room before proceeding.'
      });
      return false;
    }
    if(this.validateStayDates()) {
      const obj = {
        room: this.state.room,
        roomid: this.state.roomid,
        checkin: this.state.checkin,
        checkout: this.state.checkout,
        username: this.props.user.username
      };
      axios.post(`${Constants.LOCAL_URL}${Constants.ADD_BOOKING}`, obj)
        .then(res => {
          let { user, setBookings } = this.context;
          setBookings(user.username);
          this.setState({
            ...this.state,
            modalOpen: true,
            modalHeader: 'Reservation confirmed',
            modalMessage: 'Your reservation is complete now'
          });
        })
        .catch(e => {
          this.setState({
            ...this.state,
            modalOpen: true,
            modalHeader: 'Error!',
            modalMessage: e.response.data
          });
        });
    }

    this.setState({
      room: '',
      checkin: new Date(),
      checkout: addDays(new Date(), 1)
    })
  }

  validateStayDates = () => {
    if(this.state.checkin >= this.state.checkout) {
      this.setState({
        ...this.state,
        modalOpen: true,
        modalHeader: 'Error!',
        modalMessage: 'Checkout date must be later than checkin date.',
        room: '',
        checkin: new Date(),
        checkout: addDays(new Date(), 1)
      });
      return false;
    } else {
      return true;
    }
  }

  getRoomsList() {
    return this.state.roomsList.map((room)=>{
      return(
        <MenuItem key={room._id} value={room.name} id={room._id}>{room.name}</MenuItem>
      );
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{marginTop: 10}}>
        <Dialog
          onClose={this.handleModalClose}
          aria-labelledby="customized-dialog-title"
          open={this.state.modalOpen}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleModalClose}>
            {this.state.modalHeader}
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              {this.state.modalMessage}
            </Typography>
            <Typography gutterBottom>
              Click anywhere to continue.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <h3>Make a new reservation</h3>
        <form onSubmit={this.onSubmit}>

          <FormControl required className={classes.formControl}>
            <label>Select your room: </label>
            <Select
              value={this.state.room}
              onChange={this.onChangeRoom}
              inputProps={{
                name: 'room',
                id: 'room',
              }}
            >
              <MenuItem value="" className={classes.disabled}>
                <em>None</em>
              </MenuItem>
              {this.getRoomsList()}
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>

          <div className="form-group">
            <label>Check in: </label>
            <DatePicker
              selected={this.state.checkin}
              onChange={this.onChangeCheckInDate}
              minDate={new Date()}
              placeholderText="Select a checkin date"
            />
          </div>
          <div className="form-group">
            <label>Check out: </label>
            <DatePicker
              selected={this.state.checkout}
              onChange={this.onChangeCheckOutDate}
              minDate={addDays(new Date(), 1)}
              placeholderText="Select a checkout date"
            />
          </div>
          <div>
            <span><b>Note:</b> When you change the checkin/checkout dates, the available rooms list gets automatically updated.</span>
          </div>
          <div className="form-group">
            <input type="submit" value="Make it yours!" className="btn btn-primary"/>
          </div>
        </form>
      </div>
    )
  }
}

MakeReservation.propTypes = {
  classes: PropTypes.object.isRequired,
};

MakeReservation.contextType = MyContext;

export default withStyles(styles)(MakeReservation);
