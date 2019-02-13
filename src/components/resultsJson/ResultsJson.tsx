import {
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core/styles';
import prettier from 'prettier/standalone';
import Prism from 'prismjs';
import 'prismjs/components/prism-graphql.min.js';
import 'prismjs/components/prism-json.min.js';
import * as React from 'react';

// tslint:disable-next-line:no-var-requires
const prettierPlugins = [require('prettier/parser-graphql')];

interface IResultsJsonProps extends WithStyles<typeof styles> {
  data: any;
  isGraphQL?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    '@global': {
      '.namespace': {
        opacity: 0.7
      },
      '.token.atrule, .token.attr-value, .token.keyword, .token.class-name': {
        color: '#1990b8'
      },
      '.token.bold': {
        fontWeight: 'bold'
      },
      '.token.comment, .token.block-comment, .token.prolog, .token.doctype, .token.cdata': {
        color: '#7D8B99'
      },
      '.token.entity': {
        cursor: 'help'
      },
      '.token.important': {
        fontWeight: 'normal'
      },
      '.token.italic': {
        fontStyle: 'italic'
      },
      '.token.operator, .token.entity, .token.url, .token.variable, .language-css .token.string, .style .token.string': {
        background: 'rgba(255, 255, 255, 0.5)',
        color: '#a67f59'
      },
      '.token.property, .token.tag, .token.boolean, .token.number, .token.function-name, .token.constant, .token.symbol, .token.deleted': {
        color: '#c92c2c'
      },
      '.token.punctuation': {
        color: '#5F6364'
      },
      '.token.regex, .token.important': {
        color: '#e90'
      },
      '.token.selector, .token.attr-name, .token.string, .token.char, .token.function, .token.builtin, .token.inserted': {
        color: '#2f9c0a'
      }
    },
    code: {
      background: 'none',
      color: theme.palette.common.black,
      fontFamily: theme.typography.fontFamily,
      hyphens: 'none',
      lineHeight: 1.5,
      tabSize: 4,
      textAlign: 'left',
      whiteSpace: 'pre',
      wordBreak: 'normal',
      wordSpacing: 'normal',
      wordWrap: 'normal'
    },
    pre: {
      backgroundAttachment: 'local',
      backgroundColor: theme.palette.common.white,
      backgroundImage: `linear-gradient(transparent 50%, ${
        theme.palette.primary.light
      }20 50%)`,
      backgroundOrigin: 'content-box',
      backgroundSize: '3em 3em',
      margin: '.5em 0',
      overflow: 'visible',
      padding: 0,
      position: 'relative'
    }
  });

class ResultsJson extends React.Component<IResultsJsonProps> {
  public componentDidMount() {
    Prism.highlightAll();
  }

  public componentDidUpdate() {
    Prism.highlightAll();
  }

  public render() {
    const { classes, isGraphQL } = this.props;
    let { data } = this.props;

    if (isGraphQL) {
      data = prettier.format(data, {
        parser: 'graphql',
        plugins: prettierPlugins
      });
    }

    return (
      <pre
        className={`${classes.pre} ${classes.code}`}
        style={{
          margin: 0,
          maxHeight: '400px',
          overflow: 'scroll',
          width: '100%'
        }}
      >
        <code
          className={`${classes.code} language-${
            isGraphQL ? 'graphql' : 'json'
          }`}
        >
          {data}
        </code>
      </pre>
    );
  }
}

export default withStyles(styles)(ResultsJson);
