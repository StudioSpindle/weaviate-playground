import { createStyles, WithStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';

/**
 * Types
 */
export interface ISectionProps extends WithStyles<typeof styles> {
  title: string;
}

export interface ISectionState {
  isOpen: boolean;
}

/**
 * Styles
 */
export const sectionPadding = '0.5em';

const styles = (theme: Theme) =>
  createStyles({
    details: {
      flexDirection: 'column',
      padding: '0px'
    },
    heading: {
      color: theme.palette.primary.contrastText
    },
    root: {
      width: '500px'
    },
    summary: {
      backgroundColor: theme.palette.grey[800],
      maxHeight: '48px !important',
      minHeight: '48px !important'
    }
  });

/**
 * Section component: renders main sections in App
 */
class Section extends React.Component<ISectionProps, ISectionState> {
  constructor(props: ISectionProps) {
    super(props);
    this.state = {
      isOpen: true
    };
  }

  public toggleSection = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  public render() {
    const { children, classes, title } = this.props;
    const { isOpen } = this.state;
    return (
      <ExpansionPanel
        expanded={isOpen}
        elevation={1}
        onChange={this.toggleSection}
        classes={{ root: classes.root }}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          classes={{ root: classes.summary }}
        >
          <Typography className={classes.heading}>{title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: classes.details }}>
          {children}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(Section);
