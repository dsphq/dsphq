import { ListItemText, Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';
import NoResultsText from '../common/NoResultsText';
import PropTypes from 'prop-types';

function PackageAccountList({ className, pkg, onAccountSelected }) {
    return (
        <div className={className}>
            <Typography variant="h6" style={{ marginLeft: 16 }}>Accounts</Typography>
            <List>
                <Divider />
                {pkg.selectedPackages.map(account => <ListItem key={account.account} divider>
                    <ListItemText primary={<Link
                        component="button"
                        color="textPrimary"
                        variant="body2"
                        onClick={() => onAccountSelected(account.account)}>{account.account}
                    </Link>}
                        secondary={`${account.balance} Staked`} />
                    <div>
                        <Typography align="center">{account.availableQuota.substring(0, account.availableQuota.indexOf(' '))}</Typography>
                        <Typography variant="caption" align="center">Available Quota</Typography>
                    </div>
                </ListItem>)}
            </List>
            {pkg.selectedPackages.length === 0 && <NoResultsText>No accounts using this package</NoResultsText>}
        </div>
    );
}

PackageAccountList.propTypes = {
    classes: PropTypes.object,
    pkg: PropTypes.object, 
    onAccountSelected: PropTypes.func.isRequired
};

export default PackageAccountList;