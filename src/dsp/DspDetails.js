import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import React from 'react';
import { withRouter } from 'react-router-dom';
import DspSocialLinks from './DspSocialLinks';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    chip: {
        marginRight: 8,
        marginBottom: 8,
        '&:hover': {
            color: theme.palette.text.primary,
            background: theme.palette.primary.main,
            cursor: 'pointer'
        }
    },
    gridItem: { 
        marginBottom: 16 
    },
    servicesSection: { 
        marginTop: 16 
    },
    serviceChipsContainer: { 
        marginBottom: 16, 
        paddintTop: 8 
    }
});

function DspDetails({ 
    classes, 
    providerId, 
    totalStaked,
    availableReward,
    rewardLastClaimed,
    services,
    providerDetails, 
    history
}) {

    const onShowPackagesForService = (service) => {
        history.push(`/packages?provider[]=${providerId}&service[]=${service}`);
    };

    return (
        <div>
            <Grid container>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Name</Typography>
                    <Typography>{providerDetails.name || providerId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Total Staked</Typography>
                    <Typography>{totalStaked}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Available Reward</Typography>
                    <Typography>{availableReward}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Reward Last Claimed</Typography>
                    <Typography>{rewardLastClaimed ? moment(parseInt(rewardLastClaimed)).fromNow() : 'Never'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Location</Typography>
                    {providerDetails.location && <Typography>{providerDetails.location.name}, {providerDetails.location.country}</Typography>}
                    {!providerDetails.location && <Typography>Unknown</Typography>}
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Website</Typography>
                    {providerDetails.website && <Link color="textPrimary" target="_blank" href={providerDetails.website}>{providerDetails.website}</Link>}
                    {!providerDetails.website && <Typography>N/A</Typography>}
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Code of Conduct</Typography>
                    {providerDetails.code_of_conduct && <Link color="textPrimary" target="_blank" href={providerDetails.code_of_conduct}>View</Link>}
                    {!providerDetails.code_of_conduct && <Typography>N/A</Typography>}
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Ownership Disclosure</Typography>
                    {providerDetails.ownership_disclosure && <Link color="textPrimary" target="_blank" href={providerDetails.ownership_disclosure}>View</Link>}
                    {!providerDetails.ownership_disclosure && <Typography>N/A</Typography>}
                </Grid>
            </Grid>
            <div className={classes.servicesSection}>
                <Typography variant="subheading" gutterBottom>Provided Services</Typography>
                <div className={classes.serviceChipsContainer}>
                    {services.map(service => <Chip
                        key={service.account}
                        label={service.name}
                        className={classes.chip}
                        variant="outlined"
                        onClick={() => onShowPackagesForService(service.account)}
                    />)}
                </div>
            </div>
            <DspSocialLinks providerDetails={providerDetails} />
        </div>
    );
}

DspDetails.propTypes = {
    classes: PropTypes.object,
    providerId: PropTypes.string, 
    totalStaked: PropTypes.string, 
    availableReward: PropTypes.string, 
    rewardLastClaimed: PropTypes.string, 
    services: PropTypes.array, 
    providerDetails: PropTypes.object, 
    history: PropTypes.object, 
};

export default withStyles(styles)(withRouter(DspDetails));
