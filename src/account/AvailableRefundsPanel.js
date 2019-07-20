import { Paper } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import React, { useContext } from 'react';
import AssetType from '../chain/AssetType';
import SubmitActionsButton from '../tx/SubmitActionsButton';
import PropTypes from 'prop-types';
import NetworkContext from '../chain/NetworkContext';

const styles = () => ({
    root: {
        padding: 16,
        marginBottom: 24
    },
    listItem: { 
        justifyContent: 'space-between' 
    }
});

function AvailableRefundsPanel({ classes, account }) {
    const network = useContext(NetworkContext);

    const onGetRefundActions = (refund) => {
        return refund.airHodl ? [
            {
                account: network.contracts.dappairhodl,
                name: 'refund',
                data: {
                    owner: account.name,
                    provider: refund.provider,
                    service: refund.service
                }
            }
        ] : [
                {
                    account: network.contracts.dappservices,
                    name: 'refund',
                    data: {
                        to: account.name,
                        provider: refund.provider,
                        service: refund.service,
                        symcode: 'DAPP'
                    }
                }
            ];
    };

    const currentTime = moment();

    return (
        <Paper className={classes.root}>
            <Typography variant="h6" gutterBottom>Pending Refunds</Typography>
            <List>
                {account.refunds.map(refund => (
                    <ListItem
                        key={`${refund.service}:${refund.provider}:${refund.airHodl}`}
                        disableGutters
                        className={classes.listItem}
                    >
                        <div>
                            <Typography variant="subheading">{refund.airHodl ? `${new AssetType(refund.amount).value} DAPPHDL` : refund.amount}</Typography>
                            <Typography color="textSecondary">{refund.serviceName} &bull; {refund.providerName}</Typography>
                        </div>
                        {moment(refund.unstakeTime).isBefore(currentTime) && <SubmitActionsButton color="primary" getActions={() => onGetRefundActions(refund)}>Refund</SubmitActionsButton>}
                        {!moment(refund.unstakeTime).isBefore(currentTime) && <Tooltip title={moment(refund.unstakeTime).format('MMM D, YYYY h:mm A')}>
                            <Typography>available {moment(refund.unstakeTime).fromNow()}</Typography>
                        </Tooltip>}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

AvailableRefundsPanel.propTypes = {
    classes: PropTypes.object,
    account: PropTypes.object
};

export default withStyles(styles)(AvailableRefundsPanel);
