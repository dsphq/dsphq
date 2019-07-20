import React from 'react';
import YAML from 'json2yaml';
import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  row: {
    border: `1px solid ${darken(theme.palette.background.default, 0.05)}`,
    textAlign: 'left',
    borderRadius: '3px',
    margin: '.3rem 0',
    display: 'block',
    width: '100%'
  },
  keyColumn: {
    backgroundColor: darken(theme.palette.background.default, 0.05),
    padding: '1rem',
    display: 'inline-block',
    verticalAlign: 'top',
    height: '100%',
    fontSize: '0.875rem',
    minWidth: 150
  },
  valueColumn: {
    padding: '1rem',
    display: 'inline-block',
    verticalAlign: 'top',
    margin: 0,
    wordWrap: 'break-word',
    fontSize: '0.875rem',
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap'
  },
  container: {
    color: theme.palette.text.primary
  }
});

const getValue = (v, classes) => {
  if (typeof v === 'string') {
    return (
      <span className={classes.valueColumn}>
        {v}
      </span>
    );
  }

  return (
    <pre className={classes.valueColumn}>
      {YAML.stringify(v)
        .replace('---\n', '')
        .replace('---', '')}
    </pre>
  );
};

const JSONTable = ({ source, classes }) => {
  return (
    <div className={classes.container}>
      {Object.keys(source).map(k => {
        return (
          <div className={classes.row} key={k}>
            <span className={classes.keyColumn}>{k}</span>
            {getValue(source[k], classes)}
          </div>
        );
      })}
    </div>
  );
};

JSONTable.propTypes = {
  classes: PropTypes.object,
  source: PropTypes.object
};

export default withStyles(styles)(JSONTable);
