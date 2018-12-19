import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

/**
 * Header component: renders header
 */
// TODO: fix styling
class Header extends React.Component {
  public render() {
    return (
      <AppBar position="static" elevation={1}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            Weaviate Playground
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;

{
  /* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
<MenuIcon />
</IconButton> */
}
