import Button from '@material-ui/core/Button';
import { useObserver } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import MobxContext from '../mobx/MobxContext';
import LoginDialog from '../tx/LoginDialog';
import TxBuilderDialog from '../tx/TxBuilderDialog';
import PropTypes from 'prop-types';

function SubmitActionsButton({ 
    classes, 
    children, 
    variant, 
    color, 
    getActions, 
    ...other 
}) {
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showTransactionDialog, setShowTransactionDialog] = useState(false);
    const { accountStore, txJobStore } = useContext(MobxContext);

    const onSubmit = () => {
        accountStore.loggedInAccount ? submit() : setShowLoginDialog(true);
    }

    const onCloseLoginDialog = () => {
        setShowLoginDialog(false);
        if (accountStore.loggedInAccount) {
            submit();
        }
    }

    const submit = () => {
        const loggedInAccount = accountStore.loggedInAccount;
        if (loggedInAccount.providerId !== 'cli') {
            const job = {
                authorization: {
                    actor: loggedInAccount.accountName,
                    permission: loggedInAccount.permission
                },
                actions: getActions(),
                wallet: loggedInAccount.wallet
            };
            txJobStore.submitJob(job);
        } else {
            setShowTransactionDialog(true);
        }
    }

    return useObserver(() => (
        <div>
            <Button
                variant={variant}
                color={color}
                onClick={onSubmit}
                {...other}
            >
                {children}
            </Button>
            {showLoginDialog && <LoginDialog handleClose={onCloseLoginDialog} />}
            {showTransactionDialog && <TxBuilderDialog
                handleClose={() => setShowTransactionDialog(false)}
                getActions={getActions}
                authorization={{
                    actor: accountStore.loggedInAccount.accountName,
                    permission: accountStore.loggedInAccount.permission
                }}
            />}
        </div>
    ));
}

SubmitActionsButton.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.node.isRequired, 
    variant: PropTypes.string, 
    color: PropTypes.string, 
    getActions: PropTypes.func.isRequired
};

export default SubmitActionsButton;
