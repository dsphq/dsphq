import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import AccountBalancePanel from './AccountBalancePanel';
import AirHodlPanel from './AirHodlPanel';
import AvailableRefundsPanel from './AvailableRefundsPanel';
import DspPanel from './DspPanel';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        paddingTop: 16
    },
    horizPanels: {
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            '&>:first-child': {
                flex: 1,
                marginRight: 6
            },
            '&>:nth-child(2)': {
                flex: 1,
                marginLeft: 6
            }
        }
    }
});

function AccountOverview({ classes, account }) {
    const balance = account.balance;

    return (
        <div className={classes.root}>
            <div className={classes.horizPanels}>
                <AccountBalancePanel balance={account.balance} />
                <AirHodlPanel balance={balance.airHodl} accountName={account.name} />
            </div>
            {account.refunds && account.refunds.length > 0 && <AvailableRefundsPanel account={account} />}
            {account.dsp && <DspPanel provider={account.dsp} />}
        </div>
    );
}

AccountOverview.propTypes = {
    classes: PropTypes.object,
    account: PropTypes.object
};

export default withStyles(styles)(AccountOverview);
