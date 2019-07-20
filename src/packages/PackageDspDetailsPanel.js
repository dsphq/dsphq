import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    root: {
        border: `1px solid ${theme.palette.divider}`,
        padding: 16,
        marginBottom: 16
    }
});

function PackageDspDetailsPanel({ classes, pkg, onAccountSelected }) {
    return (
        <div className={classes.root}>
            <Typography variant="subheading">DSP</Typography>
            <Typography variant="title" gutterBottom>{pkg.providerDetails.name || pkg.provider}</Typography>
            <Typography variant="subheading">Total Staked</Typography>
            <Typography variant="body1" gutterBottom>{pkg.providerTotalStaked}</Typography>
            <Typography variant="subheading">Location</Typography>
            <Typography variant="body1" gutterBottom>{pkg.providerDetails.location ? pkg.providerDetails.location.name : 'Unknown'}</Typography>
            <Typography variant="subheading">Account</Typography>
            <Link color="primary" component="button" variant="body2" onClick={() => onAccountSelected(pkg.provider)}>{pkg.provider}</Link>
        </div>
    );
}

PackageDspDetailsPanel.propTypes = {
    classes: PropTypes.object,
    pkg: PropTypes.object,
    onAccountSelected: PropTypes.func.isRequired
};

export default withStyles(styles)(PackageDspDetailsPanel);