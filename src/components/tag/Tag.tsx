import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

/**
 * Types
 */
// tslint:disable-next-line:no-empty-interface
interface ITagProps extends WithStyles<typeof styles> {}

/**
 * Styled components
 */
const styles = (theme: Theme) =>
  createStyles({
    container: {
      background: '#f2f4f5',
      border: '1px solid #eee',
      borderRadius: '3px',
      display: 'inline-flex',
      margin: '0 1px',
      padding: '0.1em 0.2em'
    }
  });

/**
 * Tag component
 */
const Tag: React.SFC<ITagProps> = ({ classes, children }) => (
  <code className={classes.container}>
    <Typography variant="caption">{children}</Typography>
  </code>
);

export default withStyles(styles)(Tag);
