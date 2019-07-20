import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Select from 'react-select/lib/Async';
import PropTypes from 'prop-types';

const styles = theme => ({
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    }
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

function ScopeAutocomplete({ classes, theme, value, onChange, className, table, eosAccount, eosClient }) {
    const promiseOptions = inputValue => {
        let lowerBound = inputValue;
        if (lowerBound.endsWith('.')) {
            lowerBound = lowerBound.substring(0, lowerBound.length - 1);
        }

        let upperBound = inputValue;
        if (upperBound.endsWith('.')) {
            upperBound = upperBound.substring(0, upperBound.length - 1);
        }
        const charsToAdd = 12 - upperBound.length;
        for (let i = 0; i < charsToAdd; i++) {
            upperBound += 'z';
        }

        return eosClient.get_table_by_scope({
            code: eosAccount,
            table: table,
            lower_bound: lowerBound,
            upper_bound: upperBound,
            json: true
        }).then(res => {
            const options = res.rows.map(row => ({
                value: row.scope,
                label: row.scope
            }));

            if (value && value.label && !options.some(option => option.value === value.value)) {
                // Include selected value
                options.unshift(value);
            }

            return options;
        });
    };

    const selectStyles = {
        indicatorsContainer: base => ({
            ...base,
            cursor: 'pointer'
        }),
        input: base => ({
            ...base,
            color: theme.palette.text.primary,
            '& input': {
                font: 'inherit',
            },
        }),
    };

    return (
        <div className={className}>
            <Typography color="textSecondary">Scope</Typography>
            <Select
                classes={classes}
                styles={selectStyles}
                hideSelectedOptions={false}
                components={components}
                value={value}
                onChange={onChange}
                isClearable
                defaultOptions={true}
                loadOptions={promiseOptions}
            />
        </div>
    );
}

ScopeAutocomplete.propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object, 
    value: PropTypes.object, 
    onChange: PropTypes.func, 
    className: PropTypes.string, 
    table: PropTypes.string, 
    eosAccount: PropTypes.string,  
    eosClient: PropTypes.object 
};

export default withStyles(styles, { withTheme: true })(ScopeAutocomplete);