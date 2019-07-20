import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import { observer, useObserver } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React, { useContext, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import EosClientContext from '../chain/EosClientContext';
import MobxContext from '../mobx/MobxContext';

const styles = theme => ({
    container: {
        position: 'relative',
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 250,
            borderRadius: 2,
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
            '&:hover': {
                background: lighten(theme.palette.background.paper, 0.1)
            }
        }
    },
    searchIcon: {
        color: theme.palette.text.primary
    },
    searchIconWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8px'
    },
    popper: {
        zIndex: 1200
    },
    popperPaper: {
        marginTop: 2,
        maxHeight: 400,
        overflow: 'auto',
        zIndex: 1200,
        padding: 8
    }
});

function SearchInput({
    classes,
    mobile,
    label,
    helperText,
    history,
    onSearchComplete
}) {
    const [value, setValue] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const inputRef = useRef(null);
    const { accountStore } = useContext(MobxContext);
    const eosClient = useContext(EosClientContext);

    const onChange = (event) => {
        const search = event.target.value;
        setValue(search);
        if (search) {
            searchForAccount(search);
        }
    };

    const onFocus = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const onBlur = () => {
        setAnchorEl(null);
    };

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            inputRef.current.blur();
            goToAccount(value);
        }
    };

    const onAccountSelected = (account) => () => {
        goToAccount(account);
    };

    const goToAccount = (account) => {
        if (account) {
            history.push(`/accounts/${account.trim()}`);
        }
        setValue('');
        setAnchorEl(null);
        if (onSearchComplete) {
            onSearchComplete();
        }
    };

    const searchForAccount = search => {
        let lowerBound = search;
        if (lowerBound.endsWith('.')) {
            lowerBound = lowerBound.substring(0, lowerBound.length - 1);
        }

        let upperBound = search;
        if (upperBound.endsWith('.')) {
            upperBound = upperBound.substring(0, upperBound.length - 1);
        }
        const charsToAdd = 12 - upperBound.length;
        for (let i = 0; i < charsToAdd; i++) {
            upperBound += 'z';
        }

        return eosClient.get_table_by_scope({
            code: 'eosio',
            table: 'userres',
            lower_bound: lowerBound,
            upper_bound: upperBound,
            limit: 10,
            json: true
        }).then(res => {
            setSearchResults(res.rows.map(row => row.scope));
        });
    }

    const Adornment = !mobile ? <div className={classes.searchIconWrapper}><SearchIcon className={classes.searchIcon} /></div> : null;

    return useObserver(() => (
        <div className={classes.container} onFocus={onFocus} onBlur={onBlur}>
            <TextField
                fullWidth
                label={label}
                helperText={helperText}
                value={value}
                onChange={onChange}
                placeholder="Search for account"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: { autoCapitalize: 'none' },
                    autoFocus: mobile,
                    startAdornment: Adornment,
                    inputRef: inputRef,
                    disableUnderline: true,
                    onKeyPress: onKeyPress
                }}
            />
            <Popper
                id='search-popper'
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                transition
                disablePortal
                className={classes.popper}
                modifiers={{
                    flip: {
                        enabled: false,
                    },
                    preventOverflow: {
                        enabled: false,
                        boundariesElement: 'viewport',
                    }
                }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper className={classes.popperPaper} style={anchorEl ? { width: anchorEl.clientWidth } : undefined}>
                            {searchResults && value && <div>
                                {searchResults.length > 0 && <List dense>
                                    {searchResults.map(account => (
                                        <ListItem key={account} button onClick={onAccountSelected(account)}>
                                            <ListItemText primary={account} />
                                        </ListItem>
                                    ))}
                                </List>}
                                {searchResults.length === 0 && <Typography variant="body2" color="textSecondary" className={classes.noAccountsLabel} align="center">
                                    No accounts matching search
                                </Typography>}
                            </div>}
                            {!value && <div>
                                <Typography variant="body2" color="textSecondary">Recent Accounts</Typography>
                                {accountStore.recentAccounts.length > 0 && <List dense>
                                    {accountStore.recentAccounts.slice(0, 10).map(account => (
                                        <ListItem disableGutters key={account} button onClick={onAccountSelected(account)}>
                                            <ListItemText primary={account} />
                                        </ListItem>
                                    ))}
                                </List>}
                                {accountStore.recentAccounts.length === 0 && <Typography variant="caption" color="textSecondary" className={classes.noAccountsLabel}>
                                    None
                                </Typography>}
                            </div>}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    ));
}

SearchInput.propTypes = {
    classes: PropTypes.object,
    mobile: PropTypes.bool,
    label: PropTypes.string,
    helperText: PropTypes.string,
    history: PropTypes.object,
    onSearchComplete: PropTypes.func
};

export default withStyles(styles)(withRouter(observer(SearchInput)));
