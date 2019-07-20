import { Button, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDropdownIcon from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { useObserver } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import MobxContext from '../mobx/MobxContext';
import LoginDialog from '../tx/LoginDialog';
import AccountMenu from './AccountMenu';
import NetworkMenu from './NetworkMenu';
import SearchInput from './SearchInput';
import PropTypes from 'prop-types';

const style = (theme) => ({
  appBar: {
    position: 'fixed',
    backgroundColor: theme.palette.background.default,
    boxShadow: 'none',
    borderBottom: `${theme.palette.divider} 1px solid`
  },
  navButton: {
    textTransform: 'none'
  },
  drawerList: {
    width: 250
  },
  appTitleInAppBar: {
    marginRight: 16
  },
  appTitleInDrawer: {
    padding: '16px 16px 0 16px'
  },
  searchInputContainer: {
    paddingRight: 16
  },
  toolbarSection: {
    display: 'flex',
    alignItems: 'center'
  },
  toolbar: {
    justifyContent: 'space-between'
  }
});

const LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Packages', path: '/packages' },
  { label: 'Providers', path: '/providers' },
  { label: 'Settings', path: '/settings' }
];

function AppHeader({ classes, history, onNetworkChange }) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSidenav, setShowSidenav] = useState(false);
  const { accountStore } = useContext(MobxContext);

  const onPathChange = (path) => () => {
    history.push(path);
  };

  const onViewAccount = () => {
    history.push(`/accounts/${accountStore.loggedInAccount.accountName}`);
  };

  const onLogout = () => {
    accountStore.logout();
  };

  const onOpenMoreMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onToggleSidenav = () => {
    setShowSidenav(!showSidenav);
  };

  const onMenuItemClick = (path) => {
    history.push(path);
    setAnchorEl(null);
  };

  const onCloseMoreMenu = () => {
    setAnchorEl(null);
  };

  return useObserver(() => (
    <AppBar className={classes.appBar} color="inherit">
      {!showMobileSearch && <Toolbar className={classes.toolbar}>
        <div className={classes.toolbarSection}>
          <Hidden mdUp>
            <IconButton aria-label="Menu" onClick={onToggleSidenav}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            <Typography color="primary" variant="title" className={classes.appTitleInAppBar}>DSP HQ</Typography>
            {LINKS.slice(0, 3).map(link =>
              <Button key={link.path} className={classes.navButton} onClick={onPathChange(link.path)}>{link.label}</Button>)}
            <Button className={classes.navButton} onClick={onOpenMoreMenu}>More <ArrowDropdownIcon /></Button>
          </Hidden>
        </div>
        <div className={classes.toolbarSection}>
          <Hidden smDown>
            <div className={classes.searchInputContainer}>
              <SearchInput />
            </div>
          </Hidden>
          <Hidden mdUp>
            <IconButton
              onClick={() => setShowMobileSearch(true)}
              aria-labelledby="appbar-opensearch"
            >
              <SearchIcon />
            </IconButton>
          </Hidden>
          <NetworkMenu onNetworkChange={onNetworkChange} />
          {accountStore.initializing && <Typography>Logging in...</Typography>}
          {!accountStore.initializing && !accountStore.loggedInAccount && <Button color="primary" onClick={() => setShowLoginDialog(true)}>Login</Button>}
          {accountStore.loggedInAccount && <AccountMenu
            account={accountStore.loggedInAccount}
            onViewAccount={onViewAccount}
            onLogout={onLogout}
          />}
        </div>
      </Toolbar>}
      {showMobileSearch && <Toolbar classes={{ root: classes.mobileSearchToolbar }}>
        <IconButton
          onClick={() => setShowMobileSearch(false)}
        >
          <ArrowBackIcon />
        </IconButton>
        <SearchInput mobile onSearchComplete={() => setShowMobileSearch(false)} />
      </Toolbar>}
      {showLoginDialog && <LoginDialog handleClose={() => setShowLoginDialog(false)} />}
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onCloseMoreMenu}
      >
        {LINKS.slice(3).map(link => <MenuItem key={link.path} onClick={() => onMenuItemClick(link.path)}>{link.label}</MenuItem>)}
      </Menu>
      <Drawer
        variant="temporary"
        anchor="left"
        open={showSidenav}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={onToggleSidenav}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <div
          className={classes.drawerList}
          role="presentation"
          onClick={onToggleSidenav}
        >
          <Typography color="primary" variant="title" className={classes.appTitleInDrawer}>DSP HQ</Typography>
          <List>
            {LINKS.map((link) => (
              <ListItem button key={link.path} onClick={onPathChange(link.path)}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </AppBar>
  ));
}

AppHeader.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object, 
  onNetworkChange: PropTypes.func.isRequired
};

export default withStyles(style)(withRouter(AppHeader));