import { Typography, Avatar } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import { observer, useObserver } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { withRouter } from 'react-router-dom';
import MobxContext from '../mobx/MobxContext';
import TxResultDialog from './TxResultDialog';
import AuthProviderIcons from './AuthProviderIcons';
import PropTypes from 'prop-types';

const style = (theme) => ({
    root: {
        height: 60,
        zIndex: 1299
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: 8,
        width: 24,
        height: 24
    },
    errorIcon: {
        marginRight: 8,
        color: red[500]
    },
    successIcon: {
        marginRight: 8,
        color: green[500]
    },
    closeButtton: {
        paddingLeft: 8
    }
});

const MESSAGE_FROM_STATE = {
    'connecting': 'Connecting to wallet...',
    'authenticating': 'Logging in to wallet...',
    'pendingSignatureRequest': 'Waiting on signature request...',
    'signatureRequestDenied': 'Signature request denied',
    'executingTransaction': 'Executing transaction...',
    'transactionExecuted': 'Transaction submitted!',
    'transactionError': 'Transaction failed!',
    'authenticationError': 'Failed to login to wallet',
    'connectionError': 'Failed to connect to wallet'
};

function TxJobStatusBar({ classes }) {
    const [showDialog, setShowDialog] = useState(false);
    const { txJobStore } = useContext(MobxContext);

    const onOpenDialog = () => {
        setShowDialog(true);
    };

    const onCloseDialog = () => {
        setShowDialog(false);
    };

    const handleClose = () => {
        if (!showDialog) {
            txJobStore.cancelJob();
        }
    };

    const job = txJobStore.job;

    const failed = txJobStore.isJobFailed();
    const complete = txJobStore.isJobComplete();

    return useObserver(() => (
        <React.Fragment>
            {job && job.state !== 'initializing' && <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                classes={{
                    root: classes.root
                }}
                open={true}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={
                    <span className={classes.message}>
                        {!failed && !complete && <Avatar src={AuthProviderIcons[job.wallet.provider.id]} className={classes.avatar} />}
                        {failed && <ErrorIcon className={classes.errorIcon} />}
                        {complete && <CheckCircleIcon className={classes.successIcon} />}
                        <Typography color="inherit">{MESSAGE_FROM_STATE[job.state]}</Typography>
                    </span>
                }
                action={complete || failed ? [
                    <Link key="details" component="button" variant="body2" onClick={onOpenDialog}>View Details</Link>,
                    <Link key="close" className={classes.closeButtton} component="button" variant="body2" onClick={handleClose}>Close</Link>
                ] : []}
            />}
            {showDialog && <TxResultDialog
                handleClose={onCloseDialog}
                job={job}
            />}
        </React.Fragment>
    ));
}

TxJobStatusBar.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(withRouter(observer(TxJobStatusBar)));