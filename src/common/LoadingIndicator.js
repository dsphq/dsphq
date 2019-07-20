import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const styles = () => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 0'
    }
});

function LoadingIndicator({ classes }) {
    return (
        <div className={classes.root}>
            <CircularProgress color="primary" size={32} />
        </div>
    );
}

LoadingIndicator.propTypes = {
    classes: PropTypes.object
};

export default withStyles(styles)(LoadingIndicator);
