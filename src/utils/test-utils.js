import React from "react"
import { render } from 'react-dom';
import { MemoryRouter } from "react-router-dom"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import JssProvider from "react-jss/lib/JssProvider"
import Theme from "../Theme"

// MUI generates distinct classnames to prevent conflicts
// because of that, we need this to ensure snapshots are stable
// https://github.com/mui-org/material-ui/issues/9492#issuecomment-410443974
const generateClassName = (rule: any, styleSheet: any) =>
  `${styleSheet.options.classNamePrefix}-${rule.key}`

const customRender = (node, { routerProps } = {}) => {
  return render(
    <JssProvider generateClassName={generateClassName}>
      <Theme>
        <MemoryRouter {...routerProps}>
          {node}
        </MemoryRouter>
      </Theme>
    </JssProvider>,
    document.createElement('div')
  )
}

export { customRender as render }
