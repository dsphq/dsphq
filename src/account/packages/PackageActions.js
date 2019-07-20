import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import React, { useState, useContext } from 'react';
import AssetType from '../../chain/AssetType';
import StakeForm from '../../packages/StakeForm';
import SubmitActionsButton from '../../tx/SubmitActionsButton';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import NetworkContext from '../../chain/NetworkContext';

const styles = () => ({
    collapsePanel: {
        padding: 8,
    },
    buttonRow: {
        display: 'flex',
        marginTop: 16
    },
    divider: { 
        marginBottom: 16 
    },
    form: { 
        maxWidth: 300 
    },
    formTitle: { 
        marginBottom: 16 
    },
    cancelButton: { 
        marginRight: 16 
    }
});

function PackageActions({
    classes,
    account,
    pkg
}) {
    const [showStakePanel, setShowStakePanel] = useState(false);
    const [showUnstakePanel, setShowUnstakePanel] = useState(false);
    const [amountToStake, setAmountToStake] = useState('0');
    const [amountToUnstake, setAmountToUnstake] = useState('0');
    const [useAirHodl, setUseAirHodl] = useState(false);
    const network = useContext(NetworkContext);

    const action = showStakePanel ? 'stake' : 'unstake';

    const getActions = () => {
        const symbol = useAirHodl ? 'DAPPHDL' : 'DAPP';
        const quantity = AssetType.fromNumber(action === 'stake' ? amountToStake : amountToUnstake, symbol).toString();
        return [
            useAirHodl ? {
                account: network.contracts.dappairhodl,
                name: action,
                data: {
                    owner: account.name,
                    provider: pkg.provider,
                    service: pkg.service,
                    quantity
                }
            } : {
                    account: network.contracts.dappservices,
                    name: action,
                    data: {
                        [action === 'stake' ? 'from' : 'to']: account.name,
                        provider: pkg.provider,
                        service: pkg.service,
                        quantity
                    }
                }
        ];
    };

    const getCloseActions = () => {
        return [
            {
                account: network.contracts.dappservices,
                name: 'closeprv',
                data: {
                    owner: account.name,
                    provider: pkg.provider,
                    service: pkg.service
                }
            }
        ];
    };

    const dappStaked = AssetType.fromNumber(new AssetType(pkg.balance).value - new AssetType(pkg.stakedAirHodl).value, 'DAPP').toString()

    return (
        <div>
            {!showStakePanel && !showUnstakePanel && <div className={classes.buttonRow}>
                <Button color="primary" onClick={() => setShowStakePanel(true)}>Stake</Button>
                <Button color="primary" onClick={() => setShowUnstakePanel(true)}>Unstake</Button>
                <SubmitActionsButton color="primary" getActions={getCloseActions}>Deselect Package</SubmitActionsButton>
            </div>}
            <Collapse in={showStakePanel} timeout="auto" unmountOnExit>
                <Divider className={classes.divider} />
                <div className={classes.form}>
                    <Typography variant="title" className={classes.formTitle}>Stake to Package</Typography>
                    <StakeForm
                        action={action}
                        dappAvailable={`${account.balance.available} DAPP`}
                        dapphdlAvailable={account.balance.airHodl ? account.balance.airHodl.balance : '0.0000 DAPPHDL'}
                        amount={amountToStake}
                        useAirHodl={useAirHodl}
                        onAmountChange={setAmountToStake}
                        onUseAirHodlChange={setUseAirHodl} />
                    <div className={classes.buttonRow}>
                        <Button variant="outlined" color="primary" onClick={() => setShowStakePanel(false)} className={classes.cancelButton}>Cancel</Button>
                        <SubmitActionsButton variant="contained" color="primary" getActions={getActions}>Submit Stake</SubmitActionsButton>
                    </div>
                </div>
            </Collapse>
            <Collapse in={showUnstakePanel} timeout="auto" unmountOnExit>
                <Divider className={classes.divider} />
                <div className={classes.form}>
                    <Typography variant="title" className={classes.formTitle}>Unstake from Package</Typography>
                    <StakeForm
                        action={action}
                        dappAvailable={dappStaked}
                        dapphdlAvailable={pkg.stakedAirHodl ? pkg.stakedAirHodl : '0.0000 DAPPHDL'}
                        amount={amountToUnstake}
                        useAirHodl={useAirHodl}
                        onAmountChange={setAmountToUnstake}
                        onUseAirHodlChange={setUseAirHodl} />
                    <div className={classes.buttonRow}>
                        <Button variant="outlined" color="primary" onClick={() => setShowUnstakePanel(false)} className={classes.cancelButton}>Cancel</Button>
                        <SubmitActionsButton variant="contained" color="primary" getActions={getActions}>Submit Unstke</SubmitActionsButton>
                    </div>
                </div>
            </Collapse>
        </div>
    );
}

PackageActions.propTypes = {
    account: PropTypes.object.isRequired,
    pkg: PropTypes.object.isRequired,
    classes: PropTypes.object
};

export default withStyles(styles)(PackageActions);
