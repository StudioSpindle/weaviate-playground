import * as React from 'react';

class ScreenSizer extends React.Component {
  public componentDidMount() {
    this.setScreenZoom();
  }

  public setScreenZoom = () => {
    if (window.innerWidth < 1441) {
      const zoom = 75;
      const viewHeight = `${(100 / zoom) * 100}vh`;
      const rootDiv = document.getElementById('root');
      document.body.style.zoom = `${zoom}%`;
      document.body.style.height = viewHeight;
      // @ts-ignore
      rootDiv.style.height = viewHeight;
    }
  };

  public render() {
    return null;
  }
}

export default ScreenSizer;
