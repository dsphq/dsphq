import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NoResultsText from '../../common/NoResultsText';
import ContractTable from './ContractTable';
import PropTypes from 'prop-types';

const styles = theme => ({
    progressContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 32
    },
    searchPanel: {
        backgroundColor: darken(theme.palette.background.default, 0.02),
        border: `1px solid ${theme.palette.divider}`,
        padding: 8,
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
        }
    },
    formControl: {
        marginBottom: 16,
        [theme.breakpoints.up('md')]: {
            width: 150,
            marginBottom: 0
        }
    },
    virtualTableBanner: {
        border: `1px solid ${theme.palette.primary.main}`,
        padding: 16,
        marginBottom: 24
    },
    tableContainer: { 
        padding: 8, 
        marginTop: 0 
    }
});

function ContractVirtualTableData({
    classes,
    table,
    abi,
    accountName,
    show,
    providers
}) {
    const [fields, setFields] = useState();
    const [searchResult, setSearchResult] = useState(null);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(providers.length ? providers[0].account : null);
    const [scope, setScope] = useState(accountName);
    const [key, setKey] = useState('');
    const [showFormError, setShowFormError] = useState(false);

    useEffect(() => {
        const tableDef = abi.tables.find(({ name }) => name === table);
        const struct = abi.structs.find(struct => struct.name === tableDef.type);
        setFields(struct.fields);
    }, [abi, table]);

    useEffect(() => {
        if (loading) {
            setNoResultsFound(false);
            setSearchResult(null);
            const apiEndpoint = providers.find(p => p.account === provider).apiEndpoint;
            axios({
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: {
                    contract: accountName,
                    table: table.startsWith('.') ? table.substring(1) : table,
                    scope,
                    key
                },
                url: `${apiEndpoint}/v1/dsp/ipfsservice1/get_table_row`
            }).then((response) => {
                setSearchResult(response.data.row);
                setLoading(false);
            }).catch(() => {
                setNoResultsFound(true);
                setLoading(false);
            });
        }
    }, [loading, accountName, table, scope, key, provider, providers]);

    const onSearch = () => {
        if (scope && key) {
            setLoading(true);
        } else {
            setShowFormError(true);
        }
    };

    const onKeyChange = event => {
        setKey(event.target.value);
    };

    const onScopeChange = event => {
        setScope(event.target.value);
    };

    const onProviderSelected = event => {
        setProvider(event.target.value);
    }

    return show ? (
        <div className={classes.root}>
            <div className={classes.virtualTableBanner}>
                <Typography variant="body1">This is a virtual table using the LiquidVRAM service.</Typography>
                <Typography variant="caption">
                    You can search for table rows stored on IPFS by entering a scope and table key.
                </Typography>
            </div>
            {providers.length > 0 && <div className={classes.searchPanel}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="index">DSP</InputLabel>
                    <Select
                        value={provider}
                        onChange={onProviderSelected}
                        inputProps={{
                            name: 'dsp',
                            id: 'dsp',
                        }}
                    >
                        {providers.map(provider => <MenuItem key={provider.account} value={provider.account}>{provider.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField
                    className={classes.formControl}
                    label="Scope"
                    value={scope}
                    onChange={onScopeChange}
                    margin="none"
                    error={showFormError && !scope}
                    helperText={showFormError && !scope ? 'scope is required' : ''}
                />
                <TextField
                    className={classes.formControl}
                    label="Key"
                    value={key}
                    onChange={onKeyChange}
                    margin="none"
                    error={showFormError && !key}
                    helperText={showFormError && !key ? 'key is required' : ''}
                />
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onSearch}
                >
                    Search
                </Button>
            </div>}
            {searchResult && <Paper className={classes.tableContainer}>
                <ContractTable
                    rows={[searchResult]}
                    fields={fields}
                />
            </Paper>}
            {providers.length === 0 && <Typography variant="subheading" color="error">You must select one or more LiquidVRAM packages before you can view any data.</Typography>}
            {noResultsFound && <NoResultsText>No results found for search</NoResultsText>}
            {loading && <div className={classes.progressContainer}>
                <CircularProgress size={32} />
            </div>}
        </div>
    ) : null;
}

ContractVirtualTableData.propTypes = {
    classes: PropTypes.object,
    table: PropTypes.string,
    abi: PropTypes.object,
    accountName: PropTypes.string,
    show: PropTypes.bool,
    providers: PropTypes.array
};

export default withStyles(styles)(ContractVirtualTableData);
