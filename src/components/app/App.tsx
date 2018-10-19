import * as React from 'react';
import { Filters, Header, Library, Section } from 'src/components';
import styled, { injectGlobal } from 'styled-components';

/**
 * Types
 */
interface IAsideProps {
  alignRight?: boolean;
}

/**
 * Global styles for app
 */
// tslint:disable-next-line:no-unused-expression
injectGlobal`
  *, *::before, *::after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
  }

  html {
    text-size-adjust: 100%;
  }

  body, #root {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    margin: 0;
  }

  a {
    transition: background .256s ease-out,border-color .256s ease-out,border-radius .256s ease-out,color .256s ease-out,opacity .256s ease-out,outline .256s ease-out,transform .256s ease-out,-webkit-transform .256s ease-out;
    border-bottom: 2px solid #b0a002;
    color: #304a6c;
    outline: none;
    text-decoration: none;
  }

  input {
    font-family: "Alegreya Sans",sans-serif;
    font-kerning: auto;
    font-variant-ligatures: common-ligatures;
    font-size: 1em;
  }
`;

/**
 * Styled components
 */
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

const Aside = styled<IAsideProps, 'aside'>('aside')`
  position: absolute;
  ${props => (props.alignRight ? 'right: 50px;' : 'left: 50px;')};
  margin-top: 50px;
`;

/**
 * App component: renders main UI elements
 */
class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Header />
        <Main>
          <Aside>
            <Library />
            <Filters />
          </Aside>

          <Graph>
            Weaviate Playground
            <Zoom>Zoom</Zoom>
          </Graph>

          <Aside alignRight={true}>
            <Section title="Results">Results</Section>
          </Aside>
        </Main>
        <Footer>Support bar</Footer>
      </React.Fragment>
    );
  }
}

export default App;