import { Typography, Hidden } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import AccountAvatar from '../account/AccountAvatar';
import AssetType from '../chain/AssetType';
import ExpandableListItem from '../common/ExpandableListItem';
import Avatar from '@material-ui/core/Avatar';
import DspDetails from './DspDetails';
import DappClientContext from '../dsp/DappClientContext';
import LoadingIndicator from '../common/LoadingIndicator';
import Tooltip from '@material-ui/core/Tooltip';
import numeral from 'numeral';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    primaryRow: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        background: theme.palette.common.white
    },
    textSecondary: {
        display: 'flex',
        alignItems: 'center'
    },
    numberOfAccountsIcon: {
        fontSize: 16,
        margin: '0 4px 0 16px'
    },
    numberOfAccountsContainer: {
        display: 'flex',
        alignItems: 'center'
    }
});

function DspListItem({ classes, provider, history }) {
    const [additionalInfo, setAdditionalInfo] = useState(null);
    const dappClient = useContext(DappClientContext);

    const onExpanded = async () => {
        if (!additionalInfo) {

            Promise.all([
                provider.packages.length ? dappClient.getProviderDetailsFromPackage(provider.packages[0]) : {},
                dappClient.getReward(provider.id)
            ]).then(([details, reward]) => {
                setAdditionalInfo({
                    details,
                    reward
                });
            });
        }
    };

    const onShowPackages = () => {
        history.push(`/packages?provider[]=${provider.id}`);
    };

    const onViewAccount = () => {
        history.push(`/accounts/${provider.id}`);
    };

    return (
        <ExpandableListItem onExpanded={onExpanded} details={
            <div>
                {additionalInfo && <DspDetails
                    providerId={provider.id}
                    totalStaked={additionalInfo.reward.total_staked}
                    availableReward={additionalInfo.reward.balance}
                    rewardLastClaimed={additionalInfo.reward.last_usage}
                    services={provider.services}
                    providerDetails={additionalInfo.details}
                />}
                {!additionalInfo && <LoadingIndicator />}
            </div>
        }>
            {provider.logo && <ListItemAvatar>
                <Avatar className={classes.avatar} alt="" src={provider.logo} />
            </ListItemAvatar>}
            {!provider.logo && <ListItemAvatar>
                <AccountAvatar account={provider.id} />
            </ListItemAvatar>}
            <ListItemText
                primary={<div className={classes.primaryRow}>
                    <Link color="textPrimary" component="button" variant="subheading" onClick={onViewAccount}>
                        {provider.name || provider.id}
                    </Link>
                </div>}
                primaryTypographyProps={{ noWrap: false }}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={
                    <div className={classes.textSecondary}>
                        <Tooltip title={`${AssetType.fromNumber(provider.staked.total, 'DAPP').toString()} staked to this DSP`}>
                            <Typography inline>{numeral(provider.staked.percentage).format('0.0000%')} of total staked</Typography>
                        </Tooltip>
                        <Tooltip title="Number of accounts using this DSP">
                            <div className={classes.numberOfAccountsContainer}>
                                <PersonIcon color="action" className={classes.numberOfAccountsIcon} />
                                <Typography inline> {provider.staked.numberOfAccounts}</Typography>
                            </div>
                        </Tooltip>
                    </div>
                }
            />
            <Hidden xsDown>
                <Link color="textPrimary" component="button" variant="body2" onClick={onShowPackages}>
                    {provider.packages.length} Package{provider.packages.length !== 1 ? 's' : ''}
                </Link>
            </Hidden>
        </ExpandableListItem>
    );
}

DspListItem.propTypes = {
    classes: PropTypes.object,
    provider: PropTypes.object,
    history: PropTypes.object
};

export default withStyles(styles)(withRouter(DspListItem));
