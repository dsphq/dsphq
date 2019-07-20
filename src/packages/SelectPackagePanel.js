import { Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useEffect, useState } from 'react';
import AssetType from '../chain/AssetType';
import DappClientContext from '../dsp/DappClientContext';
import MobxContext from '../mobx/MobxContext';
import SubmitActionsButton from '../tx/SubmitActionsButton';
import PropTypes from 'prop-types';
import NetworkContext from '../chain/NetworkContext';

const style = () => ({
    root: { 
        paddingTop: 16 
    },
    actionContainer: {
        padding: '24px 0 8px 0'
    },
    input: {
        paddingTop: 12,
        paddingBottom: 12
    },
    title: {
        marginBottom: 16
    },
    helperText: { 
        marginBottom: 16 
    },
    availableTokensContainer: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end' 
    }
});

function SelectPackagePanel({ classes, pkg, account }) {
    const [amount, setAmount] = useState(0);
    const [useAirHodl, setUseAirHodl] = useState(false);
    const [availableTokens, setAvailableTokens] = useState(null);
    const { accountStore } = useContext(MobxContext);
    const dappClient = useContext(DappClientContext);
    const network = useContext(NetworkContext);

    useEffect(() => {
        if (account) {
            Promise.all([dappClient.getBalance(account), dappClient.getAirHodlBalance(account)]).then(([dappBalance, airHodlBalance]) => {
                setAvailableTokens({
                    dapp: dappBalance,
                    airHodl: airHodlBalance ? airHodlBalance.balance : '0.0000 DAPPHDL'
                });
            });
        } else {
            setAvailableTokens(null);
        }
    }, [account, dappClient]);

    const getActions = () => {
        const accountName = accountStore.loggedInAccount.accountName;

        const actions = [
            {
                account: network.contracts.dappservices,
                name: 'selectpkg',
                data: {
                    owner: accountName,
                    provider: pkg.provider,
                    service: pkg.service,
                    package: pkg.packageId
                }
            }
        ];

        if (amount > 0) {
            const stakeAction = useAirHodl ? {
                account: network.contracts.dappairhodl,
                name: 'stake',
                data: {
                    owner: accountName,
                    provider: pkg.provider,
                    service: pkg.service,
                    quantity: AssetType.fromNumber(amount, useAirHodl ? 'DAPPHDL' : 'DAPP').toString()
                }
            } : {
                    account: network.contracts.dappservices,
                    name: 'stake',
                    data: {
                        from: accountName,
                        provider: pkg.provider,
                        service: pkg.service,
                        quantity: AssetType.fromNumber(amount, useAirHodl ? 'DAPPHDL' : 'DAPP').toString()
                    }
                };
            actions.push(stakeAction);
        }
        return actions;
    };

    return (
        <div className={classes.root}>
            <Typography variant="title" color="primary" className={classes.title}>Select Package</Typography>
            <Typography className={classes.helperText} variant="caption" color="textSecondary">
                Select a package and optionally stake to it
            </Typography>
            <div>
                <Typography>Amount to Stake (optional)</Typography>
                <FormControl variant="outlined" fullWidth>
                    <TextField
                        variant="outlined"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        InputProps={{
                            inputProps: { autoCapitalize: 'none' },
                            endAdornment: <InputAdornment position="end">{useAirHodl ? 'DAPPHDL' : 'DAPP'}</InputAdornment>,
                            classes: {
                                input: classes.input
                            }
                        }}
                    />
                </FormControl>
            </div>
            {availableTokens !== null && <div className={classes.availableTokensContainer}>
                <Typography variant="caption">{useAirHodl ? availableTokens.airHodl : availableTokens.dapp} available</Typography>
            </div>}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={useAirHodl}
                        onChange={() => setUseAirHodl(!useAirHodl)}
                        value="true"
                    />
                }
                label="Use Air Hodl Tokens"
            />
            <div className={classes.actionContainer}>
                <SubmitActionsButton variant="contained" color="primary" fullWidth getActions={getActions}>Submit</SubmitActionsButton>
            </div>
        </div>
    );
}

SelectPackagePanel.propTypes = {
    classes: PropTypes.object,
    pkg: PropTypes.object,
    account: PropTypes.string
};

export default withStyles(style)((SelectPackagePanel));
