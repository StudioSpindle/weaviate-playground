import * as React from 'react';
import { CanvasLink } from 'src/components';
import { ID3Link } from 'src/types';

class CanvasLinks extends React.Component<{ links: ID3Link[] }, {}> {
  public render() {
    const links = this.props.links.map((link: ID3Link, index: number) => {
      return <CanvasLink key={index} link={link} />;
    });

    return <g className="links">{links}</g>;
  }
}

export default CanvasLinks;
