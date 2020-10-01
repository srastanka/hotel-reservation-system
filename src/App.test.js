import React from 'react';
import App from './App';
import { render } from "./utils/test-utils"

it('renders without crashing', () => {
  render(<App classes={{}} />)
});
