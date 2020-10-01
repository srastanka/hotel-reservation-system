import React, { ReactElement} from "react"
import { createMuiTheme } from "@material-ui/core/styles"
import { MuiThemeProvider } from "@material-ui/core/styles"

/*
 * This houses the base material ui [theme](https://material-ui.com/customization/themes/)
 * for your application (if choose to use it). Also feel free to use plain css.
 */

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
})

const Theme = ({ children}: { children: ReactElement} ) => (
  <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
)

export default Theme
