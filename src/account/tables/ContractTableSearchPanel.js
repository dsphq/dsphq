import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
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
    }
});

function ContractTableSearchPanel({
    classes,
    index,
    keyType,
    lowerBound,
    upperBound,
    onIndexChange,
    onKeyTypeChange,
    onLowerBoundChange,
    onUpperBoundChange,
    onSearch
}) {
    return (
        <div className={classes.root}>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="index">Index</InputLabel>
                <Select
                    value={index}
                    onChange={onIndexChange}
                    inputProps={{
                        name: 'index',
                        id: 'index',
                    }}
                >
                    <MenuItem value={1}>Primary</MenuItem>
                    <MenuItem value={2}>Second</MenuItem>
                    <MenuItem value={3}>Third</MenuItem>
                    <MenuItem value={4}>Fourth</MenuItem>
                    <MenuItem value={5}>Fifth</MenuItem>
                    <MenuItem value={6}>Sixth</MenuItem>
                    <MenuItem value={7}>Seventh</MenuItem>
                    <MenuItem value={8}>Eighth</MenuItem>
                    <MenuItem value={9}>Ninth</MenuItem>
                    <MenuItem value={10}>Tenth</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="index">Key Type</InputLabel>
                <Select
                    value={keyType}
                    onChange={onKeyTypeChange}
                    inputProps={{
                        name: 'key-type',
                        id: 'key-type',
                    }}
                >
                    <MenuItem value={'name'}>name</MenuItem>
                    <MenuItem value={'i64'}>i64</MenuItem>
                    <MenuItem value={'i128'}>i128</MenuItem>
                    <MenuItem value={'i256'}>i256</MenuItem>
                    <MenuItem value={'float64'}>float64</MenuItem>
                    <MenuItem value={'float128'}>float128</MenuItem>
                    <MenuItem value={'sha256'}>sha256</MenuItem>
                    <MenuItem value={'ripemd160'}>ripemd160</MenuItem>
                </Select>
            </FormControl>
            <TextField
                className={classes.formControl}
                label="Lower Bound"
                value={lowerBound}
                onChange={onLowerBoundChange}
                margin="none"
            />
            <TextField
                className={classes.formControl}
                label="Upper Bound"
                value={upperBound}
                onChange={onUpperBoundChange}
                margin="none"
            />
            <Button
                color="primary"
                variant="contained"
                onClick={onSearch}
            >
                Search
            </Button>
        </div>
    );
}

ContractTableSearchPanel.propTypes = {
    classes: PropTypes.object,
    index: PropTypes.number,
    keyType: PropTypes.string,
    lowerBound: PropTypes.string,
    upperBound: PropTypes.string,
    onIndexChange: PropTypes.func.isRequired,
    onKeyTypeChange: PropTypes.func.isRequired,
    onLowerBoundChange: PropTypes.func.isRequired,
    onUpperBoundChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
};

export default withStyles(styles)(ContractTableSearchPanel);
