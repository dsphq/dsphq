import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import CloseIcon from '@material-ui/icons/Close';
import copy from 'clipboard-copy';
import { Api } from 'eosjs';
import { observer, useObserver } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import PrismCode from 'react-prism';
import { withRouter } from 'react-router-dom';
import { TextDecoder, TextEncoder } from 'text-encoding';
import EosClientContext from '../chain/EosClientContext';
import NetworkContext from '../chain/NetworkContext';

const style = (theme) => ({
    dialogContent: {
        padding: 24
    },
    code: {
        backgroundColor: darken(theme.palette.background.default, 0.05),
        overflow: 'auto', 
        padding: 16, 
        maxHeight: 250, 
        fontSize: 14 
    },
    placeholder: {
        backgroundColor: darken(theme.palette.background.default, 0.05)
    },
    closeButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        zIndex: 1000
    },
    avatar: { 
        marginBottom: 16 
    },
    header: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingTop: 24, 
        paddingBottom: 16 
    },
    copyLinkContainer: { 
        display: 'flex', 
        justifyContent: 'flex-end' 
    },
    dialogActions: { 
        marginTop: 24, 
        display: 'flex', 
        width: '100%', 
        justifyContent: 'flex-end' 
    }
});

function TxBuilderDialog({ classes, fullScreen, handleClose, getActions, authorization }) {
    const [transaction, setTransaction] = useState(null);
    const { apiEndpoint } = useContext(NetworkContext);
    const eosClient = useContext(EosClientContext);

    useEffect(() => {
        const eosApi = new Api({
            rpc: eosClient,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
        });

        eosApi.transact({
            actions: getActions().map(action => {
                const actionCopy = Object.assign(action);
                actionCopy.authorization = [authorization];
                return actionCopy;
            })
        },
            {
                blocksBehind: 3,
                expireSeconds: 60 * 60,
                broadcast: false,
                sign: false
            }
        )
            .then(async result => {
                const tx = await eosApi.deserializeTransactionWithActions(result.serializedTransaction)
                setTransaction(JSON.stringify(tx, null, 2));
            })
            .catch(error => {
                console.error('Transaction error :(', error);
                throw error;
            });
    }, [getActions, authorization, apiEndpoint, eosClient]);

    const onCopyTransaction = () => {
        copy(`cleos --url ${apiEndpoint} push transaction '${transaction}'`);
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
                <div>
                    <div className={classes.header}>
                        <Avatar className={classes.avatar}>cli</Avatar>
                        <Typography variant="body1" color="textSecondary" gutterBottom align="center">
                            The command below shows how you can use the cleos command line tool to submit the transaction.
                            Checkout the <Link href="https://developers.eos.io/eosio-cleos/reference#cleos-push-transaction" target="_blank" rel="noopener">EOSIO Developer Portal</Link> to learn more.
                        </Typography>
                    </div>

                    {!transaction && <Typography variant="caption">Building transaction...</Typography>}
                    <ReactPlaceholder ready={!!transaction} showLoadingAnimation customPlaceholder={
                        <RectShape className={classes.placeholder} style={{ height: 200 }} color={''} />
                    }>
                        <div>
                            {transaction && <div>
                                <div className={classes.copyLinkContainer}>
                                    <Link component="button" variant="body2" onClick={onCopyTransaction}>Copy to clipboard</Link>
                                </div>
                                <div className={classes.code}>
                                    <PrismCode component="pre" className="language-json">
                                        cleos --url {apiEndpoint} push transaction '{transaction}'
                                    </PrismCode>
                                </div>
                            </div>}
                        </div>
                    </ReactPlaceholder>
                    <div className={classes.dialogActions}>
                        <Button variant="contained" color="primary" onClick={handleClose}>Done</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    ));
}

TxBuilderDialog.propTypes = {
    classes: PropTypes.object,
    fullScreen: PropTypes.bool, 
    handleClose: PropTypes.func.isRequired, 
    getActions: PropTypes.func.isRequired, 
    authorization: PropTypes.object
};

export default withMobileDialog()(withStyles(style)(withRouter(observer(TxBuilderDialog))));
