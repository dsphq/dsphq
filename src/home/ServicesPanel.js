import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        padding: '8px 16px',
        border: `1px solid ${theme.palette.divider}`
    },
    gridItem: {
        margin: '8px 0'
    },
    description: {
        marginTop: 4
    },
    showAllLink: {
        marginTop: 16
    }
});

const renderGridItem = (service, classes, onLinkSelected) => {
    return (
        <Grid key={service.account} item xs={12} sm={6} md={4} classes={{ item: classes.gridItem }}>
            <Grid container alignItems="center">
                <Link component="button" variant="subheading" onClick={onLinkSelected(service)}>{service.name}</Link>
            </Grid>
            <Typography component="div" classes={{ root: classes.description }} color="textSecondary">
                {service.description}
            </Typography>
        </Grid>
    );
};

function ServicesPanel({ classes, history, services }) {
    const [showAll, setShowAll] = useState(false);
    const onLinkSelected = (service) => () => {
        history.push(`/packages?service[]=${service.account}`);
    };

    return (
        <div className={classes.root}>
            <Grid container>
                {services.slice(0, 6).map(service => renderGridItem(service, classes, onLinkSelected))}
            </Grid>
            <Collapse in={showAll} timeout="auto" unmountOnExit>
                <Grid container>
                    {services.slice(6).map(service => renderGridItem(service, classes, onLinkSelected))}
                </Grid>
            </Collapse>
            {!showAll && <Link className={classes.showAllLink} color="textPrimary" component="button" variant="subheading" onClick={() => setShowAll(true)}>
                Show All Services
            </Link>}
        </div >
    );
}

ServicesPanel.propTypes = {
    classes: PropTypes.object,
    history: PropTypes.object,
    services: PropTypes.array
};

export default withStyles(styles)(withRouter(ServicesPanel));
