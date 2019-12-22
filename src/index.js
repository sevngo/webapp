import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-pluralrules/dist/locale-data/fr';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import io from 'socket.io-client';
import socketEvents from './client/socketEvents';
import { locale, messages, theme } from './client/utils';
import store from './client/store';
import App from './client/components/App';

// process.env to be used
export const socket = io(`${window.location.protocol}//${window.location.hostname}:8080`);
socketEvents(socket);

const ROOT = (
  <Provider store={store}>
    <IntlProvider locale={locale} messages={messages}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </MuiThemeProvider>
      </BrowserRouter>
    </IntlProvider>
  </Provider>
);

render(ROOT, document.getElementById('root'));