import { Chip, Divider } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import EosClientContext from '../chain/EosClientContext';
import ApiError from '../common/ApiError';
import LoadingIndicator from '../common/LoadingIndicator';
import NoResultsText from '../common/NoResultsText';
import DappClientContext from '../dsp/DappClientContext';
import HistoryClientContext from '../history/HistoryClientContext';
import MobxContext from '../mobx/MobxContext';
import AccountOverview from './AccountOverview';
import AccountHistory from './history/AccountHistory';
import PackageList from './packages/PackageList';
import ContractTablesPage from './tables/ContractTablesPage';

const style = () => ({
    root: {
        margin: 'auto',
        maxWidth: 1100,
        padding: 8
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 24
    },
    badge: {
        padding: '0 16px'
    },
    dspChip: {
        marginLeft: 16
    },
    mainContent: {
        paddingTop: 16
    }
});

const filterDupActions = (actions) => {
    const actionIds = new Set();
    return actions.reduce((accumulator, action) => {
        if (!actionIds.has(action.id)) {
            accumulator.push(action);
            actionIds.add(action.id);
        }
        return accumulator;
    }, []);
}

const getQueryParams = (location) => {
    return qs.parse(location.search, { ignoreQueryPrefix: true });
}

const updateQueryParam = (params, location, history) => {
    history.push({ search: qs.stringify({ ...qs.parse(location.search, { ignoreQueryPrefix: true }), ...params }) });
}

function AccountPage({ classes, match, history, location }) {
    const queryParams = getQueryParams(location);
    const [accountDetails, setAccountDetails] = useState(null);
    const [accountExists, setAccountExists] = useState();
    const [abi, setAbi] = useState(null);
    const [apiError, setApiError] = useState(false);
    const [fetchingActionHistory, setFetchingActionHistory] = useState(false);
    const [actionHistory, setActionHistory] = useState({});
    const [filters, setFilters] = useState(queryParams.filters || []);
    const { accountStore, txJobStore } = useContext(MobxContext);
    const dappClient = useContext(DappClientContext);
    const historyClient = useContext(HistoryClientContext);
    const eosClient = useContext(EosClientContext);

    const accountName = match.params.name;

    useEffect(() => {
        const load = () => {
            setApiError(false);
            setAccountDetails(null);
            setAccountExists(null);
            // Verify that account exists
            Promise.all([
                eosClient.get_account(accountName),
                eosClient.get_abi(accountName).then(res => res.abi)
            ]).then(([account, abi]) => {
                setAccountExists(true);
                accountStore.addRecentAccount(accountName);

                setAbi(abi);
                dappClient.getAccountDetails(accountName)
                    .then(accountDetails => setAccountDetails(accountDetails))
                    .catch((error) => {
                        console.warn(error);
                        setApiError(true);
                    });
            }).catch(() => setAccountExists(false));
        };

        load();

        return txJobStore.addJobListener({
            onComplete: load
        });
    }, [accountName, accountStore, dappClient, txJobStore, eosClient]);

    useEffect(() => {
        if (accountExists) {
            setActionHistory({});
            setFetchingActionHistory(true);
            historyClient.getActions(accountName, { limit: 30, filters }).then(res => {
                setActionHistory({
                    actions: filterDupActions(res.actions),
                    cursor: res.cursor,
                    hasMore: res.hasMore
                });
                setFetchingActionHistory(false);
            });
        }
    }, [accountExists, accountName, filters, historyClient]);

    const onLoadMoreHistory = () => {
        if (!fetchingActionHistory && actionHistory.hasMore) {
            setFetchingActionHistory(true);
            historyClient.getActions(accountName, { limit: 30, cursor: actionHistory.cursor, filters }).then(res => {
                setActionHistory({
                    actions: filterDupActions([...actionHistory.actions, ...res.actions]),
                    cursor: res.cursor,
                    hasMore: res.hasMore
                });
                setFetchingActionHistory(false);
            });
        }
    };

    const onTabChange = (event, tab) => {
        history.push(`/accounts/${match.params.name}${tab}`);
        if (filters.length) {
            setFilters([]);
        }
    };

    const onFilterSelected = (val) => {
        let newFilters;
        if (filters.includes(val)) {
            newFilters = filters.slice();
            newFilters.splice(filters.indexOf(val), 1);
        } else {
            newFilters = [...filters, val];
        }
        setFilters(newFilters);
        updateQueryParam({ filters: newFilters }, location, history);
    };

    let tab = '';
    if (location.pathname.includes('/packages')) {
        tab = '/packages';
    } else if (location.pathname.includes('/activity')) {
        tab = '/activity';
    } else if (location.pathname.includes('/tables')) {
        tab = '/tables';
    }

    if (apiError) {
        return <ApiError />;
    } else if (accountExists === false) {
        return <NoResultsText>Account "{accountName}" does not exist</NoResultsText>
    } else if (accountDetails) {
        const ipfsProviders = accountDetails.selected.packages.filter(pkg => pkg.service === 'ipfsservice1').map((pkg) => {
            const pkgDef = accountDetails.selected.packageDefinitions[`${pkg.packageId}:${pkg.provider}:${pkg.service}`];
            return {
                account: pkg.provider,
                name: pkgDef.providerName,
                apiEndpoint: pkgDef.apiEndpoint
            };
        });
        return (
            <div className={classes.root}>
                <div>
                    <div className={classes.header}>
                        <Typography variant="h4">{accountDetails.name}</Typography>
                        {accountDetails.dsp && <Chip className={classes.dspChip} color="primary" variant="outlined" label="DSP" />}
                    </div>
                    <Tabs
                        value={tab}
                        onChange={onTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="off"
                    >
                        <Tab label="Overview" value="" className={classes.tab} />
                        <Tab label={
                            <Badge
                                className={classes.badge}
                                color="primary"
                                badgeContent={accountDetails.selected.packages.length}
                                showZero
                            >
                                Selected Packages
                            </Badge>
                        } value="/packages" className={classes.tab} />
                        <Tab label="Activity" value="/activity" className={classes.tab} />
                        <Tab label="Tables" value="/tables" className={classes.tab} />
                    </Tabs>
                    <Divider />
                    <div className={classes.mainContent}>
                        <Switch>
                            <Route exact path={`/accounts/${match.params.name}`} render={() =>
                                <AccountOverview account={accountDetails} />} />
                            <Route exact path={`/accounts/${match.params.name}/packages`} render={() =>
                                <PackageList packages={accountDetails.selected.packages} account={accountDetails} />} />
                            <Route exact path={`/accounts/${match.params.name}/activity`} render={() =>
                                <AccountHistory
                                    account={accountDetails.name}
                                    abi={abi}
                                    actions={actionHistory.actions}
                                    hasMore={actionHistory.hasMore}
                                    onLoadMore={onLoadMoreHistory}
                                    filters={filters}
                                    onFilterSelected={onFilterSelected}
                                />} />
                            <Route exact path={`/accounts/${match.params.name}/tables`} render={() =>
                                <ContractTablesPage accountName={accountName} providers={ipfsProviders} />} />
                        </Switch>
                    </div>
                </div>
            </div>
        );
    } else {
        return <LoadingIndicator />;
    }
}

AccountPage.propTypes = {
    classes: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
};

export default withStyles(style)(withRouter(AccountPage));