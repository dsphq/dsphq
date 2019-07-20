import { Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { withRouter } from 'react-router-dom';
import DspDetails from '../dsp/DspDetails';
import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = () => ({
    root: {
        padding: 16,
        marginBottom: 24
    },
    header: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: 16 
    },
});

function DspPanel({ classes, provider, history }) {
    const onShowPackages = () => {
        history.push(`/packages?provider[]=${provider.id}`);
    };

    return (
        <Paper className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h6">DSP Details</Typography>
                <Button color="primary" onClick={onShowPackages}>
                    {provider.packages.length} Package{provider.packages.length !== 1 ? 's' : ''}
                </Button>
            </div>
            <DspDetails
                providerId={provider.id}
                totalStaked={provider.reward.total_staked}
                availableReward={provider.reward.balance}
                rewardLastClaimed={provider.reward.last_usage}
                services={provider.services}
                providerDetails={provider.details}
            />
        </Paper>
    );
}

DspPanel.propTypes = {
    classes: PropTypes.object,
    provider: PropTypes.object,
    history: PropTypes.object
};

export default withStyles(styles)(withRouter(DspPanel));
