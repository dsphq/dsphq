import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const style = () => ({
    root: { 
        display: 'flex', 
        justifyContent: 'center' 
    },
    noResultsText: {
        marginTop: 32,
        width: 350
    }
});

function NoResultsText(props) {
    return (
        <div className={props.classes.root}>
            <Typography align="center" variant="subheading" color="textSecondary" classes={{ root: props.classes.noResultsText }}>
                {props.children}
            </Typography>
        </div>
    )
};

NoResultsText.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.node
};

export default withStyles(style)(NoResultsText);