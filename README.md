This is a hotel room reservation app (client and server).

Functionality
---

## Business Logic

The application will display a list of room reservations for a hotel, allowing users to reserve rooms.

- Users would identify themselves by a "username"
- Once a room is reserved by a user, (with the reservation based on the "Name"), another user should not be able to reserve the room on those dates
- Users should be able to cancel their existing reservations thereby making the rooms available

### Views

- Login
  - Provides users a way to specify a "username" that will identify them (serving as an ID on the backend)
  - This example will only rely on a client side session for storing the name
- Reserve a room
  - "Name" input
  - Dropdown for room selection
  - The list of rooms will only display available rooms
  - Button to submit the reservation.
- Reservations for current user
  - List of currently reserved rooms
  - Each reservation would have a button/action that allows it to be cancelled
- Top level Navigation
  - There would be a top level navigation element that houses links for each view
    -  The link to the view that displays reservations for the current user would include a count of the user's reservations
  - There would be a link to "logout"

## Running

The project would support the following commands:

- Dependencies and initial setup handled by `sh install.sh`
- Server and client started by running `sh start.sh`
- Tests run by `sh test.sh`

The client would be accessible at http://localhost:3000

Architecture
---

#### Structure

- `src`: client side application
  - [`create-react-app`](https://facebook.github.io/create-react-app/) for client build and testing
  - Styling via [`material-ui`](https://material-ui.com/)
  - Routing via [`react-router`](https://github.com/ReactTraining/react-router)
  - [jest](https://jestjs.io/) for testing
- `server`: server side application
  - `express` for API
  - [jest](https://jestjs.io/) for testing
  - [supertest](https://github.com/visionmedia/supertest) for http assertions

#### Usage

```
# install dependencies
npm install

# start the client/server and serve the project
npm start

# run the client/server tests
npm test

# view all commands
npm run
```