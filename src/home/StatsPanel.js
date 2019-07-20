import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import numeral from 'numeral';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        margin: '0 -8px'
    },
    panel: {
        margin: '0 8px 8px 8px',
        padding: 8,
        border: `1px solid ${theme.palette.divider}`
    }
});

const renderGridItem = (label, value, classes) => {
    return (
        <Grid key={label} item xs={12} sm={6} md={3}>
            <div className={classes.panel}>
                <Typography align="center" component="div" gutterBottom>
                    {label}
                </Typography>
                <Typography align="center" component="div" variant="title">
                    {value}
                </Typography>
            </div>
        </Grid>
    );
};

function StatsPanel({ classes, stats }) {
    return (
        <div className={classes.root}>
            <Grid container>
                {renderGridItem('Users', stats.users.total, classes)}
                {renderGridItem('DSPs', stats.dsp.total, classes)}
                {renderGridItem('Packages', stats.packages.total, classes)}
                {renderGridItem('Total DAPP', numeral(stats.dapp.supply).format('0.000a'), classes)}
            </Grid>
        </div >
    );
}

StatsPanel.propTypes = {
    classes: PropTypes.object,
    stats: PropTypes.object
};

export default withStyles(styles)(withRouter(StatsPanel));
