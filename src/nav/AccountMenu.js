import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropdownIcon from '@material-ui/icons/ArrowDropDown';
import React, { useState } from 'react';
import AccountAvatar from '../account/AccountAvatar';
import PropTypes from 'prop-types';

const style = () => ({
    button: {
        textTransform: 'none'
    },
    content: {
        minWidth: 250
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: 16
    },
    avatar: {
        marginRight: 8
    }
});

function AccountMenu({ account, classes, onViewAccount, onLogout }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const onActionSelected = (callback) => () => {
        setAnchorEl(null);
        callback();
    };

    return (
        <div>
            <Button size="large" color="primary" onClick={(e) => setAnchorEl(e.currentTarget)} className={classes.button}>
                {account.accountName} <ArrowDropdownIcon />
            </Button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.content}>
                    <div className={classes.header}>
                        <AccountAvatar className={classes.avatar} account={account.accountName} />
                        <div>
                            <Typography variant="subheading">{account.accountName}</Typography>
                            <Typography>{account.permission}</Typography>
                            <Typography color="secondary">logged in with {account.providerId}</Typography>
                        </div>
                    </div>
                    <Divider />
                    <List disablePadding>
                        <ListItem
                            button
                            onClick={onActionSelected(onViewAccount)}
                            divider
                        >
                            <ListItemText primary="View Account" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={onActionSelected(onLogout)}
                        >
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </div>
            </Popover>
        </div>
    );
}

AccountMenu.propTypes = {
    classes: PropTypes.object,
    account: PropTypes.object,
    onViewAccount: PropTypes.func.isRequired, 
    onLogout: PropTypes.func.isRequired
};

export default withStyles(style)(AccountMenu);
