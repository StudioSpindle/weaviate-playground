import { MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import client from 'src/apollo/apolloClient';
import { App } from 'src/components';
import registerServiceWorker from 'src/registerServiceWorker';
import themeSpec from './themes/default';

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={themeSpec.theme}>
      <App logo={themeSpec.logo} />
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
