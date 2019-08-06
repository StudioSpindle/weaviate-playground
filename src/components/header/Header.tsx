import AppBar from '@material-ui/core/AppBar';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';

import { IThemeSpec } from 'src/themes';

import * as React from 'react';

import Toolbar from '@material-ui/core/Toolbar';

import Button from '@material-ui/core/Button';

// import getUrlHashParams from '../../utils/getUrlHashParams';

/**
 * Types
 */
export interface IHeaderProps extends WithStyles<typeof styles> {
  logo?: IThemeSpec['logo'];
}

/**
 * Header component: renders header
 */
const styles = (theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    }
  });

const addGraphiql = (uri: string) => {
  const key = 'graphiql';
  const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';
  let hashAnchor = '';

  if (uri.indexOf('#') >= 0) {
    console.log(uri.substring(uri.indexOf('#') + 1));
    hashAnchor = '#' + uri.substring(uri.indexOf('#') + 1);
    uri = uri.replace(hashAnchor, '');
  }
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '$2');
  } else {
    return uri + separator + key;
  }
};

const openHeaderUrl = (e: any, t: string) => {
  const location = window.location.href;
  const newLocation = location
    .replace(/\&graphiql/g, '')
    .replace(/\?graphiql/g, '');

  if (t === 'schema') {
    window.open(newLocation, '_self');
  } else if (t === 'graphiql') {
    const newGQLlocation = addGraphiql(newLocation);
    window.open(newGQLlocation, '_self');
  }
};

const logoStyle = {
  marginBottom: '1rem',
  marginTop: '1rem'
};

const headerButtonStyle = {
  fontSize: '1.05rem',
  fontWeight: 400,
  marginLeft: '1rem'
};

class Header extends React.Component<IHeaderProps> {
  public render() {
    const { classes, logo } = this.props;
    return (
      <AppBar position="static" elevation={1}>
        <Toolbar variant="dense">
          <img
            style={logoStyle}
            src="https://www.semi.technology/img/logo-weaviate-horizontal-white.svg"
            alt="Logo"
          />
          <div className={classes.grow} />
          <div>{logo && <img src={logo} height="30px" />}</div>
          <Button
            style={headerButtonStyle}
            onClick={e => openHeaderUrl(e, 'schema')}
          >
            Schema Editing
          </Button>
          <Button
            style={headerButtonStyle}
            onClick={e => openHeaderUrl(e, 'graphiql')}
          >
            GraphQL Querying
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
