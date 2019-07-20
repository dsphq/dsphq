import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useEffect, useState } from 'react';
import ApiError from '../common/ApiError';
import LoadingIndicator from '../common/LoadingIndicator';
import DappClientContext from './DappClientContext';
import DspList from './DspList';
import DspSortOptions from './DspSortOptions';
import PropTypes from 'prop-types';

const style = () => ({
    root: {
        margin: 'auto',
        maxWidth: 900,
        padding: 16
    },
    input: {
        paddingTop: 12,
        paddingBottom: 12
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24
    },
    dspList: {
        padding: '8px 0'
    }
});

function DspListPage({ classes }) {
    const [providers, setProviders] = useState(null);
    const [search, setSearch] = useState('');
    const [apiError, setApiError] = useState(false);
    const [sort, setSort] = useState(Object.keys(DspSortOptions)[0]);
    const dappClient = useContext(DappClientContext);

    useEffect(() => {
        dappClient.getProviders()
            .then((providers) => setProviders(providers))
            .catch(() => setApiError(true));
    }, [dappClient]);

    return providers ? (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h4">DSPs</Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="sort-by">
                        Sort By
                        </InputLabel>
                    <Select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        input={<OutlinedInput
                            labelWidth={53}
                            name="sort-by"
                            classes={{
                                input: classes.input
                            }}
                        />}
                    >
                        {Object.keys(DspSortOptions).map(key => <MenuItem key={key} value={key}>{DspSortOptions[key].label}</MenuItem>)}
                    </Select>
                </FormControl>
            </div>
            <div>
                <TextField
                    variant="outlined"
                    margin="none"
                    value={search}
                    fullWidth
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search DSPs"
                    InputProps={{
                        inputProps: { autoCapitalize: 'none' },
                        classes: {
                            input: classes.input
                        }
                    }}
                />
            </div>
            <DspList className={classes.dspList} providers={providers} search={search} sort={sort} />
        </div>
    ) : apiError ? <ApiError /> : <LoadingIndicator />;
}

DspListPage.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(DspListPage);