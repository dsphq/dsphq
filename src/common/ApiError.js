import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const style = () => ({
    root: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '24px 0'
    },
    firstRow: { 
        margin: '24px 0' 
    },
    secondRow: { 
        marginBottom: 16 
    }
});

function ApiError({ classes }) {
    return (
        <div className={classes.root}>
            <Typography className={classes.firstRow} variant="display2">Oops!</Typography>
            <Typography className={classes.secondRow} align="center" variant="title" color="textSecondary">
                Something went wrong when querying the blockchain
            </Typography>
            <Typography align="center" variant="body2" color="textSecondary">Please refresh the page and try again</Typography>
        </div>
    )
};

ApiError.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(ApiError);