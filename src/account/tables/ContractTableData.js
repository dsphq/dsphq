import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React, { useEffect, useState, useContext } from 'react';
import ContractTable from './ContractTable';
import ContractTableSearchPanel from './ContractTableSearchPanel';
import ScopeAutocomplete from './ScopeAutocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EosClientContext from '../../chain/EosClientContext';
import PropTypes from 'prop-types';

const styles = theme => ({
    toolbar: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 16,
        marginBottom: 16,
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row'
        }
    },
    toolbarItem: {
        marginBottom: 16,
        [theme.breakpoints.up('sm')]: {
            marginBottom: 0
        }
    },
    advancedSearchButton: {
        [theme.breakpoints.up('sm')]: {
            marginRight: 16
        }
    },
    scopeAutocomplete: {
        [theme.breakpoints.up('sm')]: {
            width: 300
        }
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            justifyContent: 'space-between',
            flexDirection: 'row'
        }
    },
    tableFooter: {
        padding: '24px 0 8px 0',
        display: 'flex'
    },
    progressContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 32
    },
    tableContainer: { 
        padding: 8, 
        marginTop: 0 
    },
    errorContainer: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: 16 
    }
});

const ROW_LIMIT = 200;

const getTableRows = (accountName, table, scope, eosClient, { index, keyType, lowerBound, upperBound }) => {
    return eosClient.get_table_rows({
        code: accountName,
        scope: scope,
        table: table,
        limit: ROW_LIMIT,
        lower_bound: lowerBound ? lowerBound : undefined,
        upper_bound: upperBound ? upperBound : undefined,
        key_type: keyType && index !== 1 ? keyType : undefined,
        index_position: index && index !== 1 ? index : undefined,
        json: true
    });
};

function ContractTableData({
    classes,
    table,
    scope,
    abi,
    index,
    keyType,
    lowerBound,
    upperBound,
    accountName,
    showAdvancedSearch,
    show,
    onScopeChange,
    onToggleAdvancedSearch,
    onSearchFieldChange
}) {
    const [fields, setFields] = useState();
    const [rows, setRows] = useState([]);
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const eosClient = useContext(EosClientContext);

    useEffect(() => {
        const loadData = () => {
            return getTableRows(accountName, table, scope, eosClient, { index, keyType, lowerBound, upperBound });
        };

        const load = () => {
            setError(undefined);
            setFields(undefined);
            setRows([]);
            setMore(false);
            setLoading(true);

            const tableDef = abi.tables.find(({ name }) => name === table);
            const struct = abi.structs.find(struct => struct.name === tableDef.type);
            setFields(struct.fields);

            loadData().then((data) => {
                setRows(data.rows);
                setMore(data.more);
                setLoading(false);
            }).catch((error) => {
                setError(error && error.message ? error.message : 'An unexpected error occurred');
                setLoading(false);
            });
        };

        if (loading) {
            load();
        }
    }, [loading, accountName, table, scope, abi, index, keyType, lowerBound, upperBound, eosClient]);

    useEffect(() => {
        if (table && scope) {
            setLoading(true);
        }
    }, [table, scope]);

    const onSearch = () => {
        setLoading(true);
    };

    const onLoadMore = () => {
        // We need to determine which field to use for the lower bound when loading more data
        // First check table definition 
        // Fallback to using first name or i64 type
        let fieldName;
        const tableDef = abi.tables.find(({ name }) => name === table)
        if (tableDef && tableDef.key_names.length >= index) {
            fieldName = tableDef.key_names[index - 1];
        } else if (index === 1 && accountName === 'eosio') {

            const field = fields.find(field => field.type === 'name');
            if (field) {
                fieldName = field.name;
            }
        }

        // Show error if field name cannot be resolved
        if (!fieldName) {
            onOpenAlertDialog();
        } else {
            getTableRows(
                accountName,
                table,
                scope,
                eosClient,
                { index, keyType: 'name', lowerBound: rows[rows.length - 1][fieldName] }
            ).then(data => {
                const newRows = rows.slice();
                newRows.push(...data.rows.slice(1));
                setRows(newRows);
                setMore(data.more);
            });
        }
    };

    const onCloseAlertDialog = () => {
        setOpenAlertDialog(false);
    };

    const onOpenAlertDialog = () => {
        setOpenAlertDialog(true);
    };

    const handleScopeChange = selection => {
        const value = selection ? selection.value : '';
        if (value !== scope) {
            onScopeChange(value);
        }
    };

    return show ? (
        <div className={classes.root}>
            <div className={classes.toolbar}>
                <ScopeAutocomplete
                    className={classNames(classes.toolbarItem, classes.scopeAutocomplete)}
                    value={{ label: scope, value: scope }}
                    table={table}
                    eosAccount={accountName}
                    eosClient={eosClient}
                    onChange={handleScopeChange}
                />
                <span style={{ flex: 1 }} />
                <Button
                    className={classNames(classes.toolbarItem, classes.advancedSearchButton)}
                    size="small"
                    variant="outlined"
                    onClick={onToggleAdvancedSearch}
                >
                    {showAdvancedSearch ? 'Hide' : 'Show'} Advanced Search
                </Button>
            </div>

            {showAdvancedSearch && <ContractTableSearchPanel
                index={index}
                keyType={keyType}
                lowerBound={lowerBound}
                upperBound={upperBound}
                onIndexChange={onSearchFieldChange('index')}
                onKeyTypeChange={onSearchFieldChange('keyType')}
                onLowerBoundChange={onSearchFieldChange('lowerBound')}
                onUpperBoundChange={onSearchFieldChange('upperBound')}
                onSearch={onSearch}
            />}

            {!loading && !error && <Paper className={classes.tableContainer}>
                <div className={classes.tableHeader}>
                    <Typography variant="body2" color="textSecondary">
                        Showing {rows.length} {!more ? `of ${rows.length} ` : ''} row{rows.length !== 1 ? 's' : ''}
                    </Typography>
                    {more && <Button color="primary" onClick={onLoadMore}>Load More Results</Button>}
                </div>
                {rows && fields && <ContractTable
                    rows={rows}
                    fields={fields}
                />}
                {more && rows.length > 20 && <div className={classes.tableFooter}>
                    <Button
                        fullWidth
                        color="primary"
                        onClick={onLoadMore}
                        variant="outlined"
                    >
                        Load More
                    </Button>
                </div>}
            </Paper>}
            {loading && <div className={classes.progressContainer}>
                <CircularProgress size={32} />
            </div>}
            {error && <div className={classes.errorContainer}>
                <Typography variant="subheading" gutterBottom>Failed to load data</Typography>
                <Typography align="center" variant="body2" color="textSecondary">{error}</Typography>
            </div>}
            {openAlertDialog && <Dialog
                open={openAlertDialog}
                onClose={onCloseAlertDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Table primary key not found"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We are not able to load more data for this table because it doesn't define the primary key in the table ABI.
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseAlertDialog} color="primary" autoFocus>
                        Got it
                        </Button>
                </DialogActions>
            </Dialog>}
        </div>
    ) : null;
}

ContractTableData.propTypes = {
    classes: PropTypes.object,
    table: PropTypes.string,
    scope: PropTypes.string,
    abi: PropTypes.object,
    index: PropTypes.number,
    keyType: PropTypes.string,
    lowerBound: PropTypes.string,
    upperBound: PropTypes.string,
    accountName: PropTypes.string,
    showAdvancedSearch: PropTypes.bool,
    show: PropTypes.bool,
    onScopeChange: PropTypes.func.isRequired,
    onToggleAdvancedSearch: PropTypes.func.isRequired,
    onSearchFieldChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(ContractTableData);
