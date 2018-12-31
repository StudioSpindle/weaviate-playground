import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import {
  CanvasContainer,
  ClassIntrospector,
  Filters,
  Footer,
  Header,
  Library,
  ResultsContainer
} from 'src/components';

/**
 * Types
 */
interface IAppProps extends WithStyles<typeof styles> {}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    '@global': {
      '*, *::before, *::after': {
        boxSizing: 'inherit',
        margin: 0,
        padding: 0,
        verticalAlign: 'baseline'
      },
      'body, #root': {
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        minHeight: '100vh'
      },
      html: {
        textSizeAdjust: '100%'
      },
      input: {
        fontFamily: theme.typography.fontFamily,
        fontKerning: 'auto',
        fontSize: '1em',
        fontVariantLigatures: 'common-ligatures'
      }
    },
    aside: {
      marginTop: '50px',
      position: 'absolute'
    },
    main: {
      display: 'flex',
      flex: 1
    }
  });

/**
 * App component: renders main UI elements
 */
class App extends React.Component<IAppProps> {
  public render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Header />
        <main className={classes.main}>
          <ClassIntrospector>
            <aside className={classes.aside} style={{ left: '50px' }}>
              <Library />
              <Filters />
            </aside>

            <CanvasContainer />

            <aside className={classes.aside} style={{ right: '50px' }}>
              <ResultsContainer />
            </aside>
          </ClassIntrospector>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
