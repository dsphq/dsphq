import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { JsonRpc } from 'eosjs';
import qs from 'qs';
import React, { memo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import AccountStore from './account/AccountStore';
import NetworkChangeListener from './chain/NetworkChangeListener';
import NetworkContext from './chain/NetworkContext';
import Networks from './chain/Networks';
import CookieSnackbar from './common/CookieSnackbar';
import DappClient from './dsp/DappClient';
import DappClientContext from './dsp/DappClientContext';
import MobxContext from './mobx/MobxContext';
import AppHeader from './nav/AppHeader';
import Routes from './Routes';
import darkTheme from './theme/darkTheme';
import lightTheme from './theme/lightTheme';
import { setPrismTheme } from './theme/prism/prism';
import AuthManager from './tx/AuthManager';
import TxJobStatusBar from './tx/TxJobStatusBar';
import TxJobStore from './tx/TxJobStore';
import HistoryClientContext from './history/HistoryClientContext';
import EosClientContext from './chain/EosClientContext';
import DfuseHistoryProvider from './history/DfuseHistoryProvider';
import PropTypes from 'prop-types';
import HistoryClient from './history/HistoryClient';

const style = (theme) => ({
  content: {
    marginTop: 56,
    paddingTop: 16,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
    }
  }
});

const DEFAULT_THEME = window.localStorage.getItem('uiTheme') === 'light' ? 'light' : 'dark';

setPrismTheme(DEFAULT_THEME);

function App({ classes, history }) {
  const { network: networkName } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const [network, setNetwork] = useState(networkName ? Networks.find(network => network.shortName === networkName) : Networks[0]);
  const [themeType, setThemeType] = useState(DEFAULT_THEME);

  const onNetworkChange = (name) => {
    setNetwork(Networks.find(network => network.shortName === name));
    history.push(`/?network=${name}`);
  };

  const onThemeToggle = () => {
    const newThemeType = themeType === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('uiTheme', newThemeType);
    setPrismTheme(newThemeType);
    setThemeType(newThemeType);
  };

  const eosClient = new JsonRpc(network.apiEndpoint);
  const dappClient = new DappClient(eosClient, network.contracts);
  const historyClient = new HistoryClient(new DfuseHistoryProvider(network.historyEndpoint, eosClient), eosClient);

  const authManager = new AuthManager(network);
  const accountStore = new AccountStore(authManager, network);
  const txJobStore = new TxJobStore(dappClient);

  return (
    <MuiThemeProvider theme={themeType === 'dark' ? darkTheme : lightTheme}>
      <NetworkContext.Provider value={network}>
        <EosClientContext.Provider value={eosClient}>
          <MobxContext.Provider value={{
            accountStore,
            txJobStore
          }}>
            <HistoryClientContext.Provider value={historyClient}>
              <DappClientContext.Provider value={dappClient}>
                <CssBaseline />
                <AppHeader onNetworkChange={onNetworkChange} />
                <div className={classes.content}>
                  <Routes onThemeToggle={onThemeToggle} />
                </div>
                <TxJobStatusBar />
                <CookieSnackbar />
                <NetworkChangeListener network={network} />
              </DappClientContext.Provider>
            </HistoryClientContext.Provider>
          </MobxContext.Provider>
        </EosClientContext.Provider>
      </NetworkContext.Provider>
    </MuiThemeProvider>
  );
};

App.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object
};

// Use memo to prevent rerender of main App component
export default withStyles(style)(withRouter(memo(App, () => true)));
