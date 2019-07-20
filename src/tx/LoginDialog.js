import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import LockIcon from '@material-ui/icons/Lock';
import { observer, useObserver } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import MobxContext from '../mobx/MobxContext';
import AuthProviderIcons from './AuthProviderIcons';
import PropTypes from 'prop-types';

const style = (theme) => ({
    dialogContent: {
        padding: 24
    },
    sigProviderList: {
        marginBottom: 16
    },
    closeButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        zIndex: 1000
    },
    errorIcon: {
        width: 80,
        height: 80,
        color: red[500],
        marginBottom: 16
    },
    errorTitle: {
        marginBottom: 16
    },
    errorRoot: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    titleContainer: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingTop: 24 
    },
    backButton: { 
        marginRight: 16 
    },
    accountSelectionActions: { 
        marginTop: 24, 
        display: 'flex', 
        width: '100%', 
        justifyContent: 'flex-end' 
    },
    accountInputContainer: { 
        padding: '24px 0' 
    }
});

function LoginDialog({ classes, fullScreen, handleClose }) {
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [loginInProgress, setLoginInProgress] = useState(false);
    const [account, setAccount] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const { accountStore } = useContext(MobxContext);

    const handleProviderSelected = (providerId) => () => {
        setSelectedProvider(providerId);
        if (providerId !== 'cli') {
            startLogin(account, providerId);
        }
    };

    const onBack = () => {
        setSelectedProvider(null);
        setAccount('');
    };

    const onSelectAccount = () => {
        if (selectedProvider === 'cli' && !account) {
            setShowErrors(true);
        } else {
            startLogin(account, selectedProvider);
        }
    };

    const startLogin = (account, provider) => {
        setLoginInProgress(true);
        accountStore.login(account ? account : undefined, provider).then(() => {
            setLoginInProgress(false);
            handleClose();
        }).catch(error => setLoginError(error && error.message ? error.message : error));
    };

    const renderLoginError = () => {
        return (
            <div className={classes.errorRoot}>
                <ErrorIcon classes={{ root: classes.errorIcon }} />
                <Typography variant="title" color="textSecondary" classes={{ root: classes.errorTitle }}>Failed to login to {selectedProvider}!</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom align="center">
                    {loginError}
                </Typography>
            </div>
        );
    };

    const renderProviderListItem = (provider) => {
        return (
            <ListItem key={provider.id} button onClick={handleProviderSelected(provider.id)}>
                {(!loginInProgress || selectedProvider !== provider.id) && !AuthProviderIcons[provider.id] && <ListItemAvatar>
                    <Avatar><LockIcon /></Avatar>
                </ListItemAvatar>}
                {(!loginInProgress || selectedProvider !== provider.id) && !!AuthProviderIcons[provider.id] && <ListItemAvatar>
                    <Avatar src={AuthProviderIcons[provider.id]} />
                </ListItemAvatar>}
                {loginInProgress && selectedProvider === provider.id && <CircularProgress className={classes.progress} />}
                <ListItemText primary={provider.meta.name} secondary={provider.meta.description} />
            </ListItem>
        );
    };

    return useObserver(() => (
        <Dialog
            fullScreen={fullScreen}
            fullWidth
            maxWidth="sm"
            open={true}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <IconButton className={classes.closeButton} onClick={handleClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent className={classes.dialogContent}>
                {!loginError && selectedProvider !== 'cli' && <div>
                    <div className={classes.titleContainer}>
                        <Typography variant="title" color="textSecondary">Select a signature provider</Typography>
                    </div>
                    <List className={classes.sigProviderList}>
                        {accountStore.authManager.getProviders().map(provider => renderProviderListItem(provider))}
                        {renderProviderListItem({ id: 'cli', meta: { name: 'Command Line', description: 'Use the cleos command line tool (advanced)' } })}
                    </List>
                    <Typography variant="caption" color="textSecondary" align="center">By selecting a signature provider, you agree to our <Link href="/terms" target="_blank" rel="noopener">Terms of Service</Link></Typography>
                </div>}
                {!loginError && selectedProvider === 'cli' && <div>
                    <div className={classes.titleContainer}>
                        <Typography variant="title" color="textSecondary">Select an EOS account</Typography>
                    </div>
                    <div className={classes.accountInputContainer}>
                        <TextField
                            variant="outlined"
                            autoFocus
                            fullWidth
                            placeholder="EOS account name"
                            classes={{ root: classes.textField }}
                            margin="none"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            error={showErrors && !account}
                            helperText={showErrors && !account ? 'Account is required' : ''}
                            InputProps={{
                                inputProps: { autoCapitalize: 'none' }
                            }}
                        />
                    </div>
                    <div className={classes.accountSelectionActions}>
                        <Button variant="outlined" color="primary" onClick={onBack} className={classes.backButton}>Back</Button>
                        <Button variant="contained" color="primary" onClick={onSelectAccount}>Select</Button>
                    </div>
                </div>}
                {loginError && renderLoginError()}
            </DialogContent>
        </Dialog>
    ));
}

LoginDialog.propTypes = {
    classes: PropTypes.object,
    fullScreen: PropTypes.bool, 
    handleClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withStyles(style)(withRouter(observer(LoginDialog))));