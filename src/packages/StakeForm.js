import { Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import PropTypes from 'prop-types';

const style = () => ({
    input: {
        paddingTop: 12,
        paddingBottom: 12
    },
    availableTokensContainer: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end' 
    }
});

function StakeForm({
    classes,
    action,
    dappAvailable,
    dapphdlAvailable,
    amount,
    useAirHodl,
    onAmountChange,
    onUseAirHodlChange
}) {
    const symbol = useAirHodl ? 'DAPPHDL' : 'DAPP';

    return (
        <div>
            <div>
                <Typography>{action === 'stake' ? 'Amount to Stake' : 'Amount to Unstake'}</Typography>
                <FormControl variant="outlined" fullWidth>
                    <TextField
                        variant="outlined"
                        value={amount}
                        onChange={(e) => onAmountChange(e.target.value)}
                        type="number"
                        InputProps={{
                            inputProps: { autoCapitalize: 'none' },
                            endAdornment: <InputAdornment position="end">{symbol}</InputAdornment>,
                            classes: {
                                input: classes.input
                            }
                        }}
                    />
                </FormControl>
            </div>
            <div className={classes.availableTokensContainer}>
                <Typography color="primary">
                    Available: {useAirHodl ? dapphdlAvailable : dappAvailable}
                </Typography>
            </div>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={useAirHodl}
                        onChange={() => onUseAirHodlChange(!useAirHodl)}
                        value="true"
                    />
                }
                label="Use Air Hodl Tokens"
            />
        </div>
    );
}

StakeForm.propTypes = {
    classes: PropTypes.object,
    action: PropTypes.string,
    dappAvailable: PropTypes.string,
    dapphdlAvailable: PropTypes.string,
    amount: PropTypes.string,
    useAirHodl: PropTypes.bool,
    onAmountChange: PropTypes.func.isRequired,
    onUseAirHodlChange: PropTypes.func.isRequired,
};

export default withStyles(style)((StakeForm));
