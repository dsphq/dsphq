import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    root: {
        border: `1px solid ${theme.palette.divider}`,
        padding: 16,
        marginBottom: 16
    },
    serviceName: {
        marginBottom: 16
    },
    serviceDescription: {
        marginBottom: 16
    }
});

function PackageServiceDetailsPanel({classes, pkg}) {
    return (
        <div className={classes.root}>
            <Typography variant="subheading">Service</Typography>
            <Typography variant="title" className={classes.serviceName}>{pkg.serviceName}</Typography>
            <Typography variant="body1" className={classes.serviceDescription}>{pkg.serviceDescription}</Typography>
            <Typography variant="subheading">Cost per action:</Typography>
            {pkg.serviceModel && Object.keys(pkg.serviceModel).map(key =>
                <Typography key={key} variant="body1">
                    {key.split('_')[0]}: {pkg.serviceModel[key].cost_per_action / 10000} QUOTA
                 </Typography>
            )}
        </div>
    );
}

PackageServiceDetailsPanel.propTypes = {
    classes: PropTypes.object,
    pkg: PropTypes.object
};

export default withStyles(styles)(PackageServiceDetailsPanel);