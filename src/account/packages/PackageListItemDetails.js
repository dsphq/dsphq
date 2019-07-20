import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { default as React } from 'react';
import { withRouter } from 'react-router-dom';
import PackageActions from './PackageActions';
import humanizeDuration from 'humanize-duration';
import PropTypes from 'prop-types';

const styles = () => ({
   gridItem: {
       marginBottom: 16
   }
});

function PackageListItemDetails({ classes, pkg, packageDefinition, status, account }) {
    return (
        <div>
            <Grid container>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Package</Typography>
                    <Typography>{pkg.packageId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Service</Typography>
                    <Typography>{pkg.serviceName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Provider Account</Typography>
                    <Typography>{pkg.provider}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Started</Typography>
                    {status !== 'Pending' && pkg.packageStarted !== 0 && <Typography>{moment(pkg.packageStarted).format('MMM D, YYYY h:mm A')}</Typography>}
                    {(status === 'Pending' || pkg.packageStarted === 0) && <Typography>N/A</Typography>}
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">End</Typography>
                    {status !== 'Pending' && pkg.packageEnd !== 0 && <Typography>{moment(pkg.packageEnd).format('MMM D, YYYY h:mm A')}</Typography>}
                    {(status === 'Pending' || pkg.packageEnd === 0)  && <Typography>N/A</Typography>}
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Last Usage</Typography>
                    {status !== 'Pending' && pkg.lastUsage !== 0 && <Typography>{moment(pkg.lastUsage).format('MMM D, YYYY h:mm A')}</Typography>}
                    {(status === 'Pending' || pkg.lastUsage === 0) &&  <Typography>N/A</Typography>}
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Min Stake</Typography>
                    <Typography>{packageDefinition.minStakeQuantity}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Balance</Typography>
                    <Typography>{pkg.balance}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Air Hodl Staked</Typography>
                    <Typography>{pkg.stakedAirHodl}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Package Period</Typography>
                    <Typography>{humanizeDuration(packageDefinition.packagePeriod * 1000)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                    <Typography variant="caption" color="textSecondary">Min Unstake Period</Typography>
                    <Typography>{humanizeDuration(packageDefinition.minUnstakePeriod * 1000)}</Typography>
                </Grid>
            </Grid>
            <PackageActions
                account={account}
                pkg={pkg}
            />
        </div>
    );
}

PackageListItemDetails.propTypes = {
    pkg: PropTypes.object.isRequired, 
    packageDefinition: PropTypes.object.isRequired, 
    status: PropTypes.string.isRequired, 
    account: PropTypes.object.isRequired,
    classes: PropTypes.object
};

export default withStyles(styles)(withRouter(PackageListItemDetails));
