import { Paper } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import AccountBalanceChart from './AccountBalanceChart';
import AssetType from '../chain/AssetType';
import PropTypes from 'prop-types';

const styles = () => ({
    root: {
        padding: 16,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center'
    },
    chartContainer: {
        padding: '0 24px',
        flex: 1,
        display: 'flex',
        justifyContent: 'center'
    }
});

function AccountBalancePanel({ classes, balance }) {
    return (
        <Paper className={classes.root}>
            <div>
                <Typography variant="h6" gutterBottom>Total Balance</Typography>
                <Typography variant="h5" gutterBottom>{AssetType.fromNumber(balance.total, 'DAPP').toString()}</Typography>
                <List>
                    <ListItem disableGutters>
                        <div>
                            <Typography variant="body1">Available</Typography>
                            <Typography variant="subheading">{AssetType.fromNumber(balance.available, 'DAPP').toString()}</Typography>
                        </div>
                    </ListItem>
                    <ListItem disableGutters>
                        <div>
                            <Typography variant="body1">Staked</Typography>
                            <Typography variant="subheading">{AssetType.fromNumber(balance.staked, 'DAPP').toString()}</Typography>
                        </div>
                    </ListItem>
                    <ListItem disableGutters>
                        <div>
                            <Typography variant="body1">Pending Refund</Typography>
                            <Typography variant="subheading">{AssetType.fromNumber(balance.pendingRefund, 'DAPP').toString()}</Typography>
                        </div>
                    </ListItem>
                </List>
            </div>
            <div className={classes.chartContainer}>
                <AccountBalanceChart balance={balance} />
            </div>
        </Paper>
    );
}

AccountBalancePanel.propTypes = {
    classes: PropTypes.object,
    balance: PropTypes.object
};

export default withStyles(styles)(AccountBalancePanel);
