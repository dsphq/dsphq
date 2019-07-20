import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/CheckCircle';
import PersonIcon from '@material-ui/icons/Person';
import humanizeDuration from 'humanize-duration';
import numeral from 'numeral';
import React, { useState } from 'react';
import AccountAvatar from '../account/AccountAvatar';
import PropTypes from 'prop-types';

const style = (theme) => ({
    card: {
        margin: 8,
        padding: 16,
        '&:hover': {
            cursor: 'pointer',
            boxShadow: '0 0 4px 1px rgba(0, 0, 0, 0.01), 0 3px 24px rgba(0, 0, 0, 0.6)'
        }
    },
    avatar: {
        background: theme.palette.common.white
    },
    icon: {
        color: theme.palette.text.disabled,
        fontSize: 16,
        margin: '0 4px 0 16px'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    cardHeaderLeftContent: {
        display: 'flex',
        alignItems: 'center'
    },
    packageNameContainer: {
        paddingLeft: 8
    },
    selectedIcon: {
        marginLeft: 16
    },
    cardFooter: {
        paddingTop: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    numberOfAccountsContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    packageAttributeLabel: {
        marginRight: 8
    }
});

function PackageCard({ pkg, classes, selected, onSelect }) {
    const [mouseOver, setMouseOver] = useState(false);

    const onMouseEnter = () => {
        setMouseOver(true);
    };

    const onMouseLeave = () => {
        setMouseOver(false);
    };

    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onSelect}>
            <Paper className={classes.card} elevation={8}>
                <div className={classes.cardHeader}>
                    <div className={classes.cardHeaderLeftContent}>
                        {pkg.providerLogo && <Avatar className={classes.avatar} alt="" src={pkg.providerLogo} />}
                        {!pkg.providerLogo && <AccountAvatar account={pkg.provider} />}
                        <div className={classes.packageNameContainer}>
                            <Typography variant="caption">{pkg.serviceName}</Typography>
                            <Link variant="subheading" color={mouseOver ? 'primary' : 'textPrimary'} onClick={onSelect}>
                                {pkg.packageId}
                            </Link>
                            <Typography color="textSecondary">{pkg.providerName}</Typography>
                        </div>
                    </div>
                    {selected && <CheckIcon color="primary" className={classes.selectedIcon} />}
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Typography inline component="span" color="textSecondary" className={classes.packageAttributeLabel}>
                                    Quota:
                                </Typography>
                            </td>
                            <td>
                                <Typography>
                                    {pkg.quota}
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Typography inline component="span" color="textSecondary" className={classes.packageAttributeLabel}>
                                    Min Stake:
                                </Typography>
                            </td>
                            <td>
                                <Typography>
                                    {pkg.minStakeQuantity}
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Typography inline component="span" color="textSecondary" className={classes.packageAttributeLabel}>
                                    Package Period
                                </Typography>
                            </td>
                            <td>
                                <Typography>
                                    {humanizeDuration(pkg.packagePeriod * 1000)}
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Typography inline component="span" color="textSecondary" className={classes.packageAttributeLabel}>
                                    Unstake Period
                                </Typography>
                            </td>
                            <td>
                                <Typography>
                                    {humanizeDuration(pkg.minUnstakePeriod * 1000)}
                                </Typography>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className={classes.cardFooter}>
                    <Tooltip title={`${numeral(pkg.staked.total).format('0.00', Math.floor)} DAPP staked to this package`}>
                        <Typography inline color="textSecondary">Total Staked: {numeral(pkg.staked.percentage).format('0.0000%')}</Typography>
                    </Tooltip>
                    <Tooltip title="Number of accounts using this package">
                        <div className={classes.numberOfAccountsContainer}>
                            <PersonIcon className={classes.icon} />
                            <Typography inline color="textSecondary"> {pkg.selectedPackages.length}</Typography>
                        </div>
                    </Tooltip>
                </div>
            </Paper>
        </div>
    );
}

PackageCard.propTypes = {
    classes: PropTypes.object,
    pkg: PropTypes.object,
    selected: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
};

export default withStyles(style)(PackageCard);