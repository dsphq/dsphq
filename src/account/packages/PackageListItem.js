import { Tooltip, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { withStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import moment from 'moment';
import numeral from 'numeral';
import { default as React } from 'react';
import { withRouter } from 'react-router-dom';
import AssetType from '../../chain/AssetType';
import ExpandableListItem from '../../common/ExpandableListItem';
import AccountAvatar from '../AccountAvatar';
import PackageListItemDetails from './PackageListItemDetails';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    avatar: {
        background: theme.palette.common.white
    },
    listItemLeftContent: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    packageTitleContainer: {
        marginLeft: 16
    },
    packageBalanceContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    listItemCenterContent: {
        flex: 1,
        display: 'flex'
    },
    balanceWarningIcon: {
        marginLeft: 4
    },
    statusChipContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    packageExpirationWarning: {
        marginTop: 4
    }
});

function PackageListItem({ classes, pkg, packageDefinition, account, history, theme }) {
    const onPackageSelected = () => {
        history.push(`/packages/${pkg.provider}/${pkg.service}/${pkg.packageId}`);
    };

    const availableQuota = new AssetType(pkg.availableQuota).value;
    const quota = new AssetType(packageDefinition.quota).value;

    const currentTime = moment();

    let status;
    if (pkg.waitingOnPackage) {
        // Waiting on another package with the same provider and service to end
        status = 'Pending';
    } else if (pkg.packageStarted && pkg.packageEnd &&
        moment(pkg.packageStarted).isSameOrBefore(currentTime) &&
        moment(pkg.packageEnd).isAfter(currentTime)) {
        // Check if quota is depleted
        status = availableQuota > 0 ? 'Active' : 'Depleted';
    } else if (new AssetType(pkg.balance).value < new AssetType(packageDefinition.minStakeQuantity).value) {
        status = 'Pending';
    } else {
        status = 'Active';
    }

    let statusColor;
    switch (status) {
        case 'Active':
            statusColor = theme.palette.secondary.main;
            break;
        case 'Depleted':
            statusColor = theme.palette.error.main;
            break;
        default:
            statusColor = theme.palette.primary.main;
    }

    const lowQuota = new AssetType(pkg.balance).value < new AssetType(packageDefinition.minStakeQuantity).value;

    return (
        <ExpandableListItem details={
            <PackageListItemDetails
                pkg={pkg}
                packageDefinition={packageDefinition}
                status={status}
                account={account}
            />
        }>
            <div className={classes.listItemLeftContent}>
                {pkg.providerLogo && <ListItemAvatar>
                    <Avatar className={classes.avatar} alt="" src={pkg.providerLogo} />
                </ListItemAvatar>}
                {!pkg.providerLogo && <ListItemAvatar>
                    <AccountAvatar account={pkg.provider} />
                </ListItemAvatar>}
                <div className={classes.packageTitleContainer}>
                    <Typography variant="caption">{pkg.serviceName}</Typography>
                    <Link
                        component="button"
                        color="textPrimary"
                        variant="subheading"
                        onClick={onPackageSelected}>
                        {pkg.packageId}
                    </Link>
                    <Typography color="textSecondary">{pkg.providerName || pkg.provider}</Typography>
                </div>
            </div>
            <Hidden smDown>
                <div className={classes.listItemCenterContent}>
                    <div className={classes.packageBalanceContainer}>
                        <div>
                            <Typography component="div" align="center">
                                {pkg.balance}
                            </Typography>
                            <Typography component="div" color="textSecondary" variant="caption" align="center">Balance</Typography>

                        </div>
                        {lowQuota &&
                            <Tooltip title="Balance is less than min stake"><WarningIcon className={classes.balanceWarningIcon} color="error" /></Tooltip>}
                    </div>
                </div>
                <div className={classes.listItemCenterContent}>
                    <div>
                        <Typography component="div">
                            {numeral(availableQuota).format('0.0000', Math.floor)} ({numeral(availableQuota / quota).format('0.00%', Math.floor)})
                        </Typography>
                        <Typography component="div" color="textSecondary" variant="caption" align="center">Available Quota</Typography>
                    </div>
                </div>
            </Hidden>
            <div>
                <div className={classes.statusChipContainer}>
                    <Chip
                        style={{ color: statusColor, borderColor: statusColor }}
                        label={status}
                        variant="outlined"
                    />
                </div>
                {pkg.expires && <Typography className={classes.packageExpirationWarning} color={'error'}>
                    expires in {moment(pkg.packageEnd).fromNow(true)}
                </Typography>}
                {(!pkg.expires && status === 'Active' && lowQuota) && <Typography className={classes.packageExpirationWarning} color={'error'}>
                    will not auto renew
                </Typography>}
            </div>
        </ExpandableListItem>
    );
}

PackageListItem.propTypes = {
    pkg: PropTypes.object.isRequired, 
    packageDefinition: PropTypes.object.isRequired, 
    account: PropTypes.object.isRequired, 
    history: PropTypes.object.isRequired, 
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object
};

export default withStyles(styles, { withTheme: true })(withRouter(PackageListItem));
