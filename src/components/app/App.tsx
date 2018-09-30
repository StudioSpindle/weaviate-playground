import * as React from 'react';
import styled, { injectGlobal } from 'styled-components';

interface IAsideProps {
  alignRight: boolean;
}

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  * {
    box-sizing: border-box; 
  }

  body, #root {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    margin: 0;
  }
`;

const Header = styled.header`
  max-height: 50px;
  height: 50px;
  background: #ccc;
  flex: 1 0 0;
`;

const Footer = styled.footer`
  max-height: 50px;
  height: 50px;
  background: #ccc;
  flex: 1 0 0;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
`;

const Graph = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Zoom = styled.div`
  position: absolute;
  left: 50px;
  bottom: 100px;
  height: 100px;
  width: 50px;
  background: #ccc;
`;

const Aside = styled<IAsideProps, any>('aside')`
  position: absolute;
  ${props => (props.alignRight ? 'right: 50px;' : 'left: 50px;')};
  margin-top: 50px;
`;

const Section = styled.section`
  height: 50px;
  width: 50px;
  margin-bottom: 5px;
  background: #ccc;
`;

class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Header>
          Header
          <nav>Navigation</nav>
        </Header>
        <Main>
          <Aside>
            <Section>Library</Section>
            <Section>Filters</Section>
          </Aside>

          <Graph>
            Weaviate Playground
            <Zoom>Zoom</Zoom>
          </Graph>

          <Aside alignRight={true}>
            <Section>Results</Section>
          </Aside>
        </Main>
        <Footer>Support bar</Footer>
      </React.Fragment>
    );
  }
}

export default App;
