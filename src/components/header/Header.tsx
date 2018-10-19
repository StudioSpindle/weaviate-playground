import * as React from 'react';
import styled from 'styled-components';

/**
 * Styled components
 */
const HeaderContainer = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 1em 0 0;
`;

const Navigation = styled.nav`
  margin-bottom: 1em;
`;

const NavigationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin-left: 0.5em;
`;

const NavigationListItem = styled.li`
  margin-bottom: 0.5em;
`;

const NavigationLink = styled.a`
  transition: background 0.256s ease-out, border-color 0.256s ease-out,
    border-radius 0.256s ease-out, color 0.256s ease-out,
    opacity 0.256s ease-out, outline 0.256s ease-out, transform 0.256s ease-out,
    -webkit-transform 0.256s ease-out;
  border-bottom: 0;
  border-radius: 1em 0 1em 0;
  color: #00152b;
  font-family: 'Alegreya Sans', sans-serif;
  font-size: 1rem;
  font-variant-caps: small-caps;
  padding: 0.5em 0.75em;
  text-transform: lowercase;
  white-space: nowrap;

  &:hover {
    transition: background 0.128s ease-out, border-color 0.128s ease-out,
      border-radius 0.128s ease-out, color 0.128s ease-out,
      opacity 0.128s ease-out, outline 0.128s ease-out,
      transform 0.128s ease-out, -webkit-transform 0.128s ease-out;
    background: #fa0171;
    border-radius: 0;
    color: #fff;
    outline: none;
  }
`;

const HeaderImage = styled.img`
  height: 4em;
`;

const ImageLink = styled.a`
  border-bottom-width: 0;
`;

const listItems = [
  {
    href: 'link1.html',
    title: 'Products'
  },
  {
    href: 'link1.html',
    title: 'Knowledge base'
  },
  {
    href: 'link1.html',
    title: 'Team'
  },
  {
    href: 'link1.html',
    title: 'Contact'
  }
];

/**
 * Header component: renders header
 */
// TODO: fix styling
class Header extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <HeaderContainer>
          <ImageLink href="/">
            <picture>
              <source
                media="(max-width: 48em)"
                srcSet="/img/logo.svg"
                type="image/svg+xml"
              />
              <source srcSet="/img/logo-hor.svg" type="image/svg+xml" />
              <HeaderImage src="/img/logo-hor.svg" alt="" />
            </picture>
          </ImageLink>
          <div>
            <NavigationLink
              className="nav-main-contact button--small"
              href="/contact.html"
            >
              Contact us
            </NavigationLink>
          </div>
        </HeaderContainer>
        <Navigation>
          <NavigationList>
            {listItems.map((listItem, i) => (
              <NavigationListItem key={i}>
                <NavigationLink href={listItem.href}>
                  {listItem.title}
                </NavigationLink>
              </NavigationListItem>
            ))}
          </NavigationList>
        </Navigation>
      </React.Fragment>
    );
  }
}

export default Header;
