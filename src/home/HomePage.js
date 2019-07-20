import { Link, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ApiError from '../common/ApiError';
import LoadingIndicator from '../common/LoadingIndicator';
import DappClientContext from '../dsp/DappClientContext';
import DspList from '../dsp/DspList';
import ServicesPanel from './ServicesPanel';
import StatsPanel from './StatsPanel';
import PropTypes from 'prop-types';

const style = (theme) => ({
    root: {
        margin: 'auto',
        maxWidth: 900,
        padding: 16
    },
    input: {
        paddingTop: 12,
        paddingBottom: 12
    },
    quickLinksSection: {
        background: theme.palette.background.paper,
        padding: 16,
        marginTop: 40
    },
    servicePanelTitle: {
        marginBottom: 8
    },
    dspSection: {
        marginTop: 40
    },
    dspSectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dspList: {
        padding: '8px 0'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 8px'
    },
    footerLinks: {
        display: 'flex'
    },
    termsLink: {
        marginRight: 16
    },
    servicesSection: { 
        marginTop: 32 
    }
});

function HomePage({ classes }) {
    const [providers, setProviders] = useState(null);
    const [providerSearch, setProviderSearch] = useState('');
    const [serviceMetadata, setServiceMetadata] = useState(null);
    const [stats, setStats] = useState(null);
    const [apiError, setApiError] = useState(false);
    const dappClient = useContext(DappClientContext);

    useEffect(() => {
        Promise.all([
            dappClient.getProviders(),
            dappClient.getServiceMetadata(),
            dappClient.getStats()
        ]).then(([providers, serviceMetadata, stats]) => {
            setServiceMetadata(serviceMetadata);
            setProviders(providers);
            setStats(stats);
        }).catch(() => setApiError(true));
        
    }, [dappClient]);

    return providers && serviceMetadata ? (
        <div className={classes.root}>
            
            <Typography variant="h6" className={classes.servicePanelTitle}>Stats</Typography>
            {stats && <StatsPanel stats={stats} />}

            <div className={classes.servicesSection}>
                <Typography variant="h6" className={classes.servicePanelTitle}>DAPP Services</Typography>
                {serviceMetadata && <ServicesPanel services={Object.keys(serviceMetadata).map(key => serviceMetadata[key])} />}
            </div>

            <div className={classes.dspSection}>
                <div className={classes.dspSectionHeader}>
                    <Typography variant="h6">DSPs</Typography>
                    <TextField
                        variant="outlined"
                        margin="none"
                        value={providerSearch}
                        onChange={e => setProviderSearch(e.target.value)}
                        placeholder="Search DSPs"
                        InputProps={{
                            inputProps: { autoCapitalize: 'none' },
                            classes: {
                                input: classes.input
                            }
                        }}
                    />
                </div>
                <DspList className={classes.dspList} providers={providers} search={providerSearch} sort="stakeDescending" />
            </div>
            <div className={classes.quickLinksSection}>
                <Typography variant="h6" gutterBottom>Quick Links</Typography>
                <List dense>
                    <ListItem disableGutters>
                        <Link color="textPrimary" href="https://liquidapps.io" target="_blank">LiquidApps Website</Link>
                    </ListItem>
                    <ListItem disableGutters>
                        <Link color="textPrimary" href="https://github.com/liquidapps-io" target="_blank">LiquidApps GitHub</Link>
                    </ListItem>
                    <ListItem disableGutters>
                        <Link color="textPrimary" href="https://docs.liquidapps.io/en/v1.4/" target="_blank">DAPP Network Documentation</Link>
                    </ListItem>
                </List>

            </div>
            <div className={classes.footer}>
                <Typography>&copy;  2019 DSP HQ</Typography>
                <div className={classes.footerLinks}>
                    <Link component={RouterLink} color="textPrimary" to="/terms" className={classes.termsLink}>Terms of Use</Link>
                    <Link component={RouterLink} color="textPrimary" to="/privacy">Privacy Policy</Link>
                </div>
            </div>
        </div>
    ) : apiError ? <ApiError /> : <LoadingIndicator />;
}

HomePage.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(HomePage);