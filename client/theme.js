import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#4a148c',
    },
    secondary: {
      main: '#fff',
    },
  },
  overrides: {
    MuiInputBase: {
      root: {
        '&$disabled': {
          color: '',
        },
      },
    },
    MuiFormLabel: {
      root: {
        '&$disabled': {
          color: '',
        },
      },
    },
    MuiFormControlLabel: {
      label: {
        '&$disabled': {
          color: '',
        },
      },
    },
  },
});
