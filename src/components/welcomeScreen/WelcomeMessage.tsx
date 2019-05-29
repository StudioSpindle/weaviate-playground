import { Theme, withStyles, WithStyles } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import Typography from '@material-ui/core/Typography';
import React, { Fragment } from 'react';

/**
 * Types
 */
export interface IWelcomeMessageProps extends WithStyles<typeof styles> {}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    paragraph: {
      // TODO: add paragraph="true" to Typography element in React Material UI > v4.0.0
      marginBottom: '1.5rem'
    },
    title: {
      marginBottom: '1.5rem'
    }
  });

const messageHTML = (
  <Fragment>
    This is the GUI on top of the decentralised knowledge graph{' '}
    <a href="https://github.com/semi-technologies/weaviate" target="_blank">
      Weaviate
    </a>
    . For more information <br /> or documentation visit the{' '}
    <a
      href="https://github.com/semi-technologies/weaviate/blob/master/docs/en/use/weaviate-playground.md"
      target="_blank"
    >
      Weaviate Playground documentation
    </a>{' '}
    on Github.
  </Fragment>
);

/**
 * Component
 */
const WelcomeMessage: React.SFC<IWelcomeMessageProps> = ({ classes }) => {
  return (
    <React.Fragment>
      <Typography
        component="h1"
        variant="display4"
        align="center"
        className={classes.title}
      >
        Welcome to the <br />
        Weaviate Playground!
      </Typography>
      <Typography align="center" className={classes.paragraph}>
        {messageHTML}
      </Typography>
    </React.Fragment>
  );
};

export default withStyles(styles)(WelcomeMessage);
