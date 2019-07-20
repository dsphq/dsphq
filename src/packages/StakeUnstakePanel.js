import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useContext, useEffect, useState } from 'react';
import AssetType from '../chain/AssetType';
import DappClientContext from '../dsp/DappClientContext';
import MobxContext from '../mobx/MobxContext';
import SubmitActionsButton from '../tx/SubmitActionsButton';
import StakeForm from './StakeForm';
import PropTypes from 'prop-types';
import NetworkContext from '../chain/NetworkContext';

const style = () => ({
    actionContainer: {
        padding: '24px 0 8px 0'
    },
    tabs: {
        marginBottom: 24
    },
    tab: {
        minWidth: 0
    }
});

function StakeUnstakePanel({ classes, pkg, account }) {
    const [amountToStake, setAmountToStake] = useState('0');
    const [amountToUnstake, setAmountToUnstake] = useState('0');
    const [useAirHodl, setUseAirHodl] = useState(false);
    const [availableTokens, setAvailableTokens] = useState({});
    const [tab, setTab] = useState('stake');
    const { accountStore } = useContext(MobxContext);
    const dappClient = useContext(DappClientContext);
    const network = useContext(NetworkContext);

    useEffect(() => {
        if (account) {
            Promise.all([
                dappClient.getBalance(account),
                dappClient.getAirHodlBalance(account),
                dappClient.getStakedAirHodl(account, pkg.service, pkg.provider)
            ]).then(([dappBalance, airHodlBalance, stakedAirHodl]) => {
                // Find selected package for account
                const selected = pkg.selectedPackages.find(selectedPackage => selectedPackage.account === account);
                const stakedAirHodlBalance = stakedAirHodl ? stakedAirHodl.balance : '0.0000 DAPPHDL';

                const stakedDapp = AssetType.fromNumber(new AssetType(selected.balance).value - new AssetType(stakedAirHodlBalance).value, 'DAPP').toString()

                setAvailableTokens({
                    dapp: dappBalance,
                    airHodl: airHodlBalance ? airHodlBalance.balance : '0.0000 DAPPHDL',
                    stakedAirHodl: stakedAirHodlBalance,
                    dappBalance: stakedDapp
                });
            });
        } else {
            setAvailableTokens(null);
        }
    }, [account, dappClient, pkg]);

    const getActions = () => {
        const accountName = accountStore.loggedInAccount.accountName;
        const symbol = useAirHodl ? 'DAPPHDL' : 'DAPP';
        const quantity = AssetType.fromNumber(tab === 'stake' ? amountToStake : amountToUnstake, symbol).toString();
        return [
            useAirHodl ? {
                account: network.contracts.dappairhodl,
                name: tab,
                data: {
                    owner: accountName,
                    provider: pkg.provider,
                    service: pkg.service,
                    quantity
                }
            } : {
                    account: network.contracts.dappservices,
                    name: tab,
                    data: {
                        [tab === 'stake' ? 'from' : 'to']: accountName,
                        provider: pkg.provider,
                        service: pkg.service,
                        quantity
                    }
                }
        ];
    };

    const onTabChange = (event, tab) => {
        setTab(tab);
    };

    return (
        <div>
            <Tabs
                value={tab}
                onChange={onTabChange}
                indicatorColor="primary"
                textColor="primary"
                className={classes.tabs}
            >
                <Tab classes={{ root: classes.tab }} label="Stake" value="stake" />
                <Tab classes={{ root: classes.tab }} label="Unstake" value="unstake" />
            </Tabs>
            {tab === 'stake' && <StakeForm
                action={tab}
                dappAvailable={availableTokens.dapp}
                dapphdlAvailable={availableTokens.airHodl}
                amount={amountToStake}
                useAirHodl={useAirHodl}
                onAmountChange={setAmountToStake}
                onUseAirHodlChange={setUseAirHodl} />}
            {tab === 'unstake' && <StakeForm
                action={tab}
                dappAvailable={availableTokens.dappBalance}
                dapphdlAvailable={availableTokens.stakedAirHodl}
                amount={amountToUnstake}
                useAirHodl={useAirHodl}
                onAmountChange={setAmountToUnstake}
                onUseAirHodlChange={setUseAirHodl} />}
            <div className={classes.actionContainer}>
                <SubmitActionsButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    getActions={getActions}
                >
                    Submit {tab}
                </SubmitActionsButton>
            </div>
        </div>
    );
}

StakeUnstakePanel.propTypes = {
    classes: PropTypes.object,
    pkg: PropTypes.object,
    account: PropTypes.string
};

export default withStyles(style)((StakeUnstakePanel));
