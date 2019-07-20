import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import EosClientContext from '../../chain/EosClientContext';
import NoResultsText from '../../common/NoResultsText';
import ContractTableData from './ContractTableData';
import TableSchema from './TableSchema';
import ContractVirtualTableData from './ContractVirtualTableData';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        padding: 8,
        maxWidth: 1400,
        margin: 'auto',
        [theme.breakpoints.up('md')]: {
            padding: 24
        }
    },
    textField: {
        backgroundColor: theme.palette.background.paper
    },
    input: {
        padding: 14,
        backgroundColor: theme.palette.background.paper
    },
    chip: {
        marginRight: 6,
        marginTop: 6
    },
    selectedChip: {
        backgroundColor: theme.palette.background.paper
    },
    tableChipsPanel: { 
        marginBottom: 16 
    },
    divider: { 
        marginBottom: 16 
    },
    errorContainer: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: 16 
    }
});

const getQueryParams = (location) => {
    return qs.parse(location.search, { ignoreQueryPrefix: true });
}

const updateQueryParam = (params, location, history) => {
    history.push({ search: qs.stringify({ ...qs.parse(location.search, { ignoreQueryPrefix: true }), ...params }) });
}

const getDefaultScope = (accountName, table, eosClient) => {
    return findTableScope(accountName, table, 'eosio', 'eosio', eosClient).then(res => {
        if (res.rows.length) {
            return res.rows[0].scope;
        } else {
            return findTableScope(accountName, table, '', 'zzzzzzzzzzzz', eosClient).then(res => {
                if (res.rows.length) {
                    return res.rows[0].scope;
                } else {
                    // As a last resort
                    return accountName;
                }
            });
        }
    });
}

const findTableScope = (accountName, table, lower, upper, eosClient) => {
    return eosClient.get_table_by_scope({
        code: accountName,
        table: table,
        lower_bound: lower,
        upper_bound: upper,
        json: true
    });
}

function ContractTablesPage({ classes, accountName, location, history, providers }) {
    const {
        table,
        scope,
        showAdvancedSearch: showAdvancedSearchQueryParam,
        index = 1,
        keyType = 'name',
        lowerBound = '',
        upperBound = ''
    } = getQueryParams(location);

    const showAdvancedSearch = showAdvancedSearchQueryParam === 'true';

    const [abi, setAbi] = useState(null);
    const [selectedTab, setSelectedTab] = useState('data');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const eosClient = useContext(EosClientContext);

    useEffect(() => {
        setLoading(true);
        setError(false);

        eosClient.get_abi(accountName).then(res => res.abi).then(async (abi) => {
            setAbi(abi);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
            setError(true);
        });
    }, [accountName, eosClient]);

    useEffect(() => {
        if (abi && !table) {
            const newTable = !table && abi.tables.length ? abi.tables[0].name : table;
            getDefaultScope(accountName, table, eosClient).then(newScope => {
                updateQueryParam({ table: newTable, scope: newScope }, location, history);
            });
        }
    }, [abi, accountName, table, history, location, eosClient]);

    const onToggleAdvancedSearch = () => {
        updateQueryParam({ showAdvancedSearch: !showAdvancedSearch }, location, history)
    }

    const onScopeChange = scope => {
        updateQueryParam({ scope }, location, history);
    }

    const onAdvancedSearchFieldChange = field => event => {
        const value = event.target.value;
        updateQueryParam({ [field]: value }, location, history);
    }

    const onTabChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    }

    const onTableChange = (table) => () => {
        updateQueryParam({ table, scope: undefined }, location, history);
        getDefaultScope(accountName, table, eosClient).then(newScope => {
            updateQueryParam({ table, scope: newScope }, location, history);
        });
    }

    const isTableVirtual = (tableName) => {
        if (!tableName) {
            return false;
        }
        return tableName.startsWith('.') && abi.tables.find(t => t.name === tableName.substring(1));
    };

    const selectedTable = table;

    return (
        <div className={classes.root}>
            {!loading && abi && !error && <div>
                <div className={classes.tableChipsPanel}>
                    {abi.tables.map(table => (
                        <Chip
                            key={table.name}
                            label={table.name}
                            className={selectedTable === table.name ? classNames(classes.chip, classes.selectedChip) : classes.chip}
                            variant="outlined"
                            onClick={onTableChange(table.name)}
                            clickable
                            color={selectedTable === table.name ? 'primary' : 'default'}
                        />
                    ))}
                </div>
                <Tabs
                    value={selectedTab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={onTabChange}>
                    <Tab label="Data" value="data" />
                    <Tab label="Schema" value="schema" />
                </Tabs>
                <Divider className={classes.divider} light />
                {isTableVirtual(table) && <ContractVirtualTableData
                    show={selectedTab === 'data'}
                    table={table}
                    abi={abi}
                    accountName={accountName}
                    providers={providers}
                />}
                {!isTableVirtual(table) && <ContractTableData
                    show={selectedTab === 'data'}
                    table={table}
                    abi={abi}
                    scope={scope}
                    index={index}
                    keyType={keyType}
                    lowerBound={lowerBound}
                    upperBound={upperBound}
                    showAdvancedSearch={showAdvancedSearch}
                    accountName={accountName}
                    onScopeChange={onScopeChange}
                    onSearchFieldChange={onAdvancedSearchFieldChange}
                    onToggleAdvancedSearch={onToggleAdvancedSearch}
                />}
                {selectedTab === 'schema' && <TableSchema table={table} abi={abi} />}
            </div>}
            {error && <div className={classes.errorContainer}>
                <Typography variant="subheading" gutterBottom>Failed to load table ABI</Typography>
            </div>}
            {!loading && !abi && !error && <NoResultsText>This account doesn't have any tables</NoResultsText>}
        </div>
    );
}

ContractTablesPage.propTypes = {
    classes: PropTypes.object,
    accountName: PropTypes.string, 
    location: PropTypes.object, 
    history: PropTypes.object, 
    providers: PropTypes.array, 
};

export default withStyles(styles)(withRouter(ContractTablesPage));
