import { Typography } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import humanizeDuration from 'humanize-duration';
import YAML from 'json2yaml';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const style = () => ({
    helperText: {
        marginTop: 8,
        marginBottom: 16
    },
    detailsListItem: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    showMoreDetailsButton: {
        marginTop: 8
    }
});

const formatJsonValue = (val) => {
    return YAML.stringify(val)
        .replace('---\n', '')
        .replace('---', '')
};

function PackageAttributeList({ classes, pkg, className }) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className={className}>
            <Typography variant="h6">Package Details</Typography>
            <Typography className={classes.helperText}>
                {pkg.details ? pkg.details.description : ''}
            </Typography>
            <List disablePadding>
                <Divider />
                <ListItem divider disableGutters className={classes.detailsListItem}>
                    <Typography variant="body2">Package ID</Typography>
                    <Typography variant="subheading" color="textSecondary">{pkg.packageId}</Typography>
                </ListItem>
                <ListItem divider disableGutters className={classes.detailsListItem}>
                    <Typography variant="body2">Quota</Typography>
                    <Typography variant="subheading" color="textSecondary">{pkg.quota}</Typography>
                </ListItem>
                <ListItem divider disableGutters className={classes.detailsListItem}>
                    <Typography variant="body2">Min Stake</Typography>
                    <Typography variant="subheading" color="textSecondary">{pkg.minStakeQuantity}</Typography>
                </ListItem>
                <ListItem divider disableGutters className={classes.detailsListItem}>
                    <Typography variant="body2">Package Period</Typography>
                    <Typography variant="subheading" color="textSecondary">{humanizeDuration(pkg.packagePeriod * 1000)}</Typography>
                </ListItem>
                <ListItem divider disableGutters className={classes.detailsListItem}>
                    <Typography variant="body2">Min Unstaking Period</Typography>
                    <Typography variant="subheading" color="textSecondary">{humanizeDuration(pkg.minUnstakePeriod * 1000)}</Typography>
                </ListItem>
            </List>
            <Collapse in={showDetails} timeout="auto" unmountOnExit>
                <List disablePadding>
                    <ListItem divider disableGutters className={classes.detailsListItem}>
                        <Typography variant="body2">API Endpoint</Typography>
                        <Typography variant="subheading" color="textSecondary">{pkg.apiEndpoint}</Typography>
                    </ListItem>
                    <ListItem divider disableGutters className={classes.detailsListItem}>
                        <Typography variant="body2">Location</Typography>
                        {pkg.details && pkg.details.locations && <Typography variant="subheading" color="textSecondary">{pkg.details.locations.map(location => `${location.name}, ${location.country}`).join(' ')}</Typography>}
                    </ListItem>
                    <ListItem divider disableGutters className={classes.detailsListItem}>
                        <Typography variant="body2">Availability</Typography>
                        <Typography variant="subheading" color="textSecondary">
                            {pkg.details.service_level_agreement && pkg.details.service_level_agreement.availability
                                && pkg.details.service_level_agreement.availability.uptime_9s ?
                                `${pkg.details.service_level_agreement.availability.uptime_9s} nines` : 'N/A'}
                        </Typography>
                    </ListItem>
                    <ListItem divider disableGutters className={classes.detailsListItem}>
                        <Typography variant="body2">Performance</Typography>
                        <Typography component="pre" variant="subheading" color="textSecondary">
                            {pkg.details.service_level_agreement && pkg.details.service_level_agreement.performance ?
                                formatJsonValue(pkg.details.service_level_agreement.performance) : 'N/A'}
                        </Typography>
                    </ListItem>
                    {pkg.details.pinning && <ListItem divider disableGutters className={classes.detailsListItem}>
                        <Typography variant="body2">Pinning</Typography>
                        <Typography component="pre" variant="subheading" color="textSecondary">
                            {formatJsonValue(pkg.details.pinning)}
                        </Typography>
                    </ListItem>}
                </List>
            </Collapse>
            <Link
                className={classes.showMoreDetailsButton}
                component="button"
                variant="body2"
                onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'Less Details' : 'More Details'}
            </Link>
        </div>
    );
}

PackageAttributeList.propTypes = {
    classes: PropTypes.object,
    pkg: PropTypes.object,
    className: PropTypes.string
};

export default withStyles(style)((PackageAttributeList));
