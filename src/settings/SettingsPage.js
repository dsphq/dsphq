import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const style = () => ({
    root: {
        maxWidth: 600,
        margin: '0 auto',
        padding: 16
    }
});

function SettingsPage({ onThemeToggle, classes, theme }) {
    return (
        <div className={classes.root}>
            <Paper classes={{ root: classes.root }}>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container alignItems="center" justify="space-between">
                            <Grid item>
                                <Typography>Enable Dark Mode</Typography>
                            </Grid>
                            <Grid item>
                                <FormControlLabel control={
                                    <Switch value="dark" checked={theme.palette.type === 'dark'} onChange={onThemeToggle} />
                                } />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

SettingsPage.propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object,
    onThemeToggle: PropTypes.func.isRequired
};

export default withStyles(style, { withTheme: true })(SettingsPage);