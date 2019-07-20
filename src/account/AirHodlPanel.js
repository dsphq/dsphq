import { Chip, Paper } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import SubmitActionsButton from '../tx/SubmitActionsButton';
import PropTypes from 'prop-types';

const styles = () => ({
    panel: {
        padding: 16,
        marginBottom: 24
    },
    header: { 
        display: 'flex' 
    },
    statusChip: { 
        marginLeft: 16 
    },
    buttonContainer: { 
        display: 'flex', 
        marginTop: 16 
    }
});

const AIR_HODL_CONTRACT = 'dappairhodl1'

function AirHodlPanel({ classes, balance, accountName }) {
    const onGetRefreshAction = () => {
        return [
            {
                account: AIR_HODL_CONTRACT,
                name: 'refresh',
                data: {
                    owner: accountName
                }
            }
        ];
    };

    const onGetClaimAction = () => {
        return [
            {
                account: AIR_HODL_CONTRACT,
                name: 'grab',
                data: {
                    owner: accountName,
                    ram_payer: accountName
                }
            }
        ];
    };

    return (
        <Paper className={classes.panel}>
            <div className={classes.header}>
                <Typography variant="h6" gutterBottom>
                    Air Hodled Tokens
                </Typography>
                {balance && balance.claimed === 1 && <Chip color="secondary" variant="outlined" label="Claimed" className={classes.statusChip} />}
                {balance && balance.claimed === 0 && <Chip variant="outlined" label="Not Claimed" className={classes.statusChip} />}
                {!balance && <Chip variant="outlined" label="No Allocation" className={classes.statusChip} />}
                <span style={{ flex: 1 }} />
                {balance && <SubmitActionsButton color="primary" getActions={onGetRefreshAction}>Refresh</SubmitActionsButton>}
            </div>
            <Typography variant="caption">
                Air hodled tokens are vested over a period of two years. You can claim them at anytime within the two year period.
            </Typography>
            <div>
                <List dense>
                    <ListItem disableGutters>
                        <div>
                            <Typography variant="body2" color="textSecondary">Allocation</Typography>
                            <Typography variant="subheading">{balance ? balance.allocation : '0 DAPPHDL'}</Typography>
                        </div>
                    </ListItem>
                    <ListItem disableGutters>
                        <div>
                            <Typography variant="body2" color="textSecondary">Available</Typography>
                            <Typography variant="subheading">{balance ? balance.balance : '0 DAPPHDL'}</Typography>
                        </div>
                    </ListItem>
                    <ListItem disableGutters>
                        <div>
                            <Typography variant="body2" color="textSecondary">Staked</Typography>
                            <Typography variant="subheading">{balance ? balance.staked : '0 DAPPHDL'}</Typography>
                        </div>
                    </ListItem>

                </List>
            </div>
            {balance && balance.claimed !== 1 && <div className={classes.buttonContainer}>
                <SubmitActionsButton variant="contained" color="primary" getActions={onGetClaimAction}>Claim</SubmitActionsButton>
            </div>}
        </Paper>
    );
}

AirHodlPanel.propTypes = {
    classes: PropTypes.object,
    balance: PropTypes.object,
    accountName: PropTypes.string
};

export default withStyles(styles)(AirHodlPanel);
