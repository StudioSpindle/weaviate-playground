import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import {
  CanvasContainer,
  ClassIntrospector,
  // Filters,
  Footer,
  GraphiQLContainer,
  Header,
  Library,
  // ResultsContainer,
  ScreenSizer
} from 'src/components';
import { IThemeSpec } from 'src/themes';
import getUrlHashParams from '../../utils/getUrlHashParams';

/**
 * Types
 */
interface IAppProps extends WithStyles<typeof styles> {
  logo?: IThemeSpec['logo'];
}

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
      marginLeft: '25px',
      marginTop: '25px',
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
    const urlObject = getUrlHashParams({ url: window.location.href });
    const showGraphiQL = urlObject.graphiql;

    if (showGraphiQL) {
      return <GraphiQLContainer />;
    }
    const { classes, logo } = this.props;
    return (
      <React.Fragment>
        <ScreenSizer />
        <Header logo={logo} />
        <main className={classes.main}>
          <ClassIntrospector>
            <aside className={classes.aside}>
              <Library />
              {/*<Filters />*/}
            </aside>

            <CanvasContainer />

            {/*<aside className={classes.aside} style={{ right: '50px' }}>*/}
            {/*  <ResultsContainer />*/}
            {/*</aside>*/}
          </ClassIntrospector>
        </main>
        <Footer />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
