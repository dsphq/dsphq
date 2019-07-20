import { green, red } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const style = () => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    title: {
        marginBottom: 16
    },
    successIcon: {
        width: 80,
        height: 80,
        color: green[500],
        marginBottom: 16
    },
    errorIcon: {
        width: 80,
        height: 80,
        color: red[500],
        marginBottom: 16
    },
    dialogContent: {
        padding: 24
    },
    wordBreak: {
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
    },
    closeButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        zIndex: 1000
    },
    txIdContainer: { 
        margin: '16px 0' 
    }
});

function TxResultDialog({ fullScreen, handleClose, classes, job, history }) {
    const onViewAccountActivity = (account) => {
        handleClose();
        history.push(`/accounts/${job.authorization.actor}/activity`);
    };

    const renderSignatureRequestDeniedError = (job) => {
        return (
            <div className={classes.root}>
                <ErrorIcon classes={{ root: classes.errorIcon }} />
                <Typography variant="title" color="textSecondary" classes={{ root: classes.title }}>Transaction Denied!</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom align="center" classes={{ root: classes.text }}>
                    Your transaction was not executed because you denied the signature request
                </Typography>
            </div>
        );
    };

    const renderTransactionError = (job) =>{
        return (
            <div className={classes.root}>
                <ErrorIcon classes={{ root: classes.errorIcon }} />
                <Typography variant="title" color="textSecondary" classes={{ root: classes.title }}>Transaction Failed!</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom align="center" classes={{ root: classes.text }}>
                    {buildTransactionErrorMessage(job.error)}
                </Typography>
            </div>
        );
    };

    const renderTransactionComplete = (job) => {
        return (
            <div className={classes.root}>
                <CheckCircleIcon classes={{ root: classes.successIcon }} />
                <Typography variant="title" color="textSecondary" classes={{ root: classes.title }}>Transaction submitted!</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom align="center" classes={{ root: classes.text }} component="div">
                    Your transaction has been successfully submitted and is now pending confirmation.
                    You can track the status of your transaction by viewing your <Link variant="body2" component="button" onClick={onViewAccountActivity}>Account Activity</Link> page.
                </Typography>
                <div className={classes.txIdContainer}>
                    <Typography variant="body2" color="textSecondary" align="center">
                        Transaction ID
                    </Typography>
                    <Typography variant="caption" color="textSecondary" gutterBottom align="center" className={classes.wordBreak}>
                        {job.transactionId}
                    </Typography>
                </div>
            </div>
        )
    };

    const buildTransactionErrorMessage = (error) => {
        let message = 'Unknown error occured when submitting transaction to the network.';
        if (error
            && error.details
            && error.details.find(detail => detail.method === 'eosio_assert')) {
            const assert = error.details.find(detail => detail.method === 'eosio_assert');
            message = assert.message;
        } else if (error && error.what) {
            message = error.what;
        }
        return message;
    };

    return (
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
                {job.state === 'transactionExecuted' && renderTransactionComplete(job)}
                {job.state === 'transactionError' && renderTransactionError(job)}
                {job.state === 'signatureRequestDenied' && renderSignatureRequestDeniedError(job)}
            </DialogContent>
        </Dialog>
    );
}

TxResultDialog.propTypes = {
    classes: PropTypes.object,
    fullScreen: PropTypes.bool, 
    handleClose: PropTypes.func.isRequired, 
    job: PropTypes.object, 
    history: PropTypes.object
};

export default withMobileDialog()(withStyles(style)(withRouter(TxResultDialog)));