import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import {configure, mount} from 'enzyme';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {BrowserRouter as Router} from "react-router-dom";
import UserEvent from '@testing-library/user-event';
import App from './App';
import MakeReservation from './components/makeReservation.component';
import ViewReservation from './components/viewReservation.component';
import MyContext from './MyContext';

configure({adapter: new Adapter()});

it('renders without crashing', () => {
  render(<App classes={{}} />)
});

describe("Hotel Reservation System", () => {
  const testUser = {
    "username": "testuser",
    "password": "testpwd"
  };

  const contextData = {
    user: testUser,
    bookings: [],
    setBookings: jest.fn(),
    cancelBooking: jest.fn()
  };

  const wrapper = mount(<App/>);
  expect(wrapper.children()).toHaveLength(1);
  // since there is a withStyles wrapped around App, the first child inside the wrapper is the actual App component
  const app = wrapper.children().first();

  // matcher function to match elements whose text is broken up by multiple elements
  const hasTextFunction = (node, text) => node.textContent === text;

  afterEach(() => {
    cleanup();
  });

  it("it makes reservation", async () => {
    /*Set the actual functions from App for the context API.
    Here we are using the actual state and functions of App and not mocking anything just to demonstrate the actual behavior.
    But the right way to test is to use mock data and functions*/
    contextData.bookings = app.instance().state.bookings;
    contextData.setBookings = app.instance().setBookings;
    contextData.cancelBooking = app.instance().cancelBooking;

    let {
      container
    } = render(
        <MyContext.Provider value={contextData}>
          <MakeReservation user={testUser}/>
        </MyContext.Provider>
    );
    const selectButton = container.querySelector('#select-room');
    // const selectButton = document.getElementById('select-room');
    expect(selectButton).not.toBeNull();
    UserEvent.click(selectButton);
    await waitFor(() => screen.getByText("Voyager V1 Room (1 king bed)"), {container});
    const itemClickable = screen.getByText("Voyager V1 Room (1 king bed)");
    UserEvent.click(itemClickable);

    const submitButton = screen.getByText("Make it yours!");
    UserEvent.click(submitButton);

    await new Promise(r => setTimeout(r, 1000));

    expect(screen.getByText("Reservation confirmed")).toBeInTheDocument();

    contextData.bookings = app.instance().state.bookings;

  });

  it("it views reservation", async () => {
    render(
        <MyContext.Provider value={contextData}>
          <Router>
            <ViewReservation user={testUser}/>
          </Router>
        </MyContext.Provider>
    );

    // to match an element whose text is broken up by multiple elements, we can write a matcher function
    // matchers accept strings, regular expressions or functions (as shown below)
    expect(screen.getByText((content, node) => {
      const nodeHasText = hasTextFunction(node, "Total number of your reservations : 1");

      // For example, some other element may have the same text.
      // To avoid returning more nodes than needed we can make sure that none of the children has the same text as its parent.
      // In this way we can make sure that the node we're returning is the smallest/closest to the bottom of our DOM tree.
      /*const childrenDontHaveText = Array.from(node.children).every(
          (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;*/

      return nodeHasText;
    })).toBeInTheDocument();

    // uncomment next line to print the screen
    // screen.debug();
  });

  it("it cancels reservation", async () => {
    render(
        <MyContext.Provider value={contextData}>
          <Router>
            <ViewReservation user={testUser}/>
          </Router>
        </MyContext.Provider>
    );
    const cancelReservationButton = screen.getByText("Cancel reservation");
    UserEvent.click(cancelReservationButton);

    await new Promise(r => setTimeout(r, 1000));

    contextData.bookings = app.instance().state.bookings;

    render(
        <MyContext.Provider value={contextData}>
          <Router>
            <ViewReservation user={ testUser } />
          </Router>
        </MyContext.Provider>
    );

    expect(screen.getByText((content, node) => {
      return hasTextFunction(node, "Total number of your reservations : 0");
    })).toBeInTheDocument();

    // screen.debug();
  });
});