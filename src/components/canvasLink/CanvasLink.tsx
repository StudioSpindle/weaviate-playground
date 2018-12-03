import { createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import * as d3 from 'd3';
import * as React from 'react';
import { ID3Link } from 'src/types';

export interface ILinkProps extends WithStyles<typeof styles> {
  link: ID3Link;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      stroke: theme.palette.secondary.main
    }
  });

class CanvasLink extends React.Component<ILinkProps> {
  public ref: SVGLineElement;

  public componentDidMount() {
    const { link } = this.props;
    d3.select(this.ref).data([link], () => `${link.source}-${link.target}`);
  }

  public render() {
    const { classes, link } = this.props;
    return (
      <line
        className={`link ${classes.root}`}
        ref={(ref: SVGLineElement) => (this.ref = ref)}
        strokeWidth={Math.sqrt(link.value)}
      />
    );
  }
}

export default withStyles(styles)(CanvasLink);
