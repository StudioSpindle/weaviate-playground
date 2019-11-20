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
  maxHeight?: string;
  title: string;
  shortTitle: string;
}

export interface ISectionState {
  isOpen: boolean;
}

/**
 * Styles
 */
const styles = (theme: Theme) =>
  createStyles({
    details: {
      flexDirection: 'column'
    },
    expanded: { width: '521px !important' },
    heading: {
      color: theme.palette.primary.contrastText,
      fontSize: '1rem',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    icon: {
      color: theme.palette.common.white
    },
    root: {
      width: '50px'
    },
    summary: {
      backgroundColor: theme.palette.grey[800],
      maxHeight: '48px !important',
      minHeight: '48px !important',
      padding: '0 0 0 30px'
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
    const { children, classes, maxHeight, title, shortTitle } = this.props;
    const { isOpen } = this.state;
    return (
      <ExpansionPanel
        expanded={isOpen}
        elevation={1}
        onChange={this.toggleSection}
        classes={{ expanded: classes.expanded, root: classes.root }}
      >
        <ExpansionPanelSummary
          expandIcon={
            isOpen && <ExpandMoreIcon classes={{ root: classes.icon }} />
          }
          classes={{ root: classes.summary }}
        >
          <Typography className={classes.heading}>
            {isOpen ? title : shortTitle}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          classes={{ root: classes.details }}
          style={{ maxHeight: maxHeight || '100vh' }}
        >
          {children}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(Section);
