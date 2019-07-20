import { decorate, observable } from 'mobx';

class TxJobStore {
    job = null;

    constructor(dappClient) {
        this.dappClient = dappClient;
        this.listeners = [];
    }

    addJobListener(listener) {
        this.listeners.push(listener);
        // Return function to remove listener
        return () => {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        };
    }

    submitJob({ authorization, actions, wallet }) {
        this.job = {
            wallet,
            authorization,
            actions,
            state: 'initializing'
        };

        const stateCallback = ({ state, error }) => {
            this.job.state = state;
            if (error) {
                this.job.error = error;
            }
        }

        stateCallback({ state: 'pendingSignatureRequest' });
        this.getSignedTransaction(this.job, (signedTransaction) => {
            this.job.state = 'executingTransaction';
            wallet.eosApi.pushSignedTransaction(signedTransaction)
                .then((response) => {
                    // Add a delay to give the transaction time to complete
                    return new Promise(resolve => setTimeout(() => {
                        this.job.state = 'transactionExecuted';
                        this.job.transactionId = response.transaction_id;
                        // Clear cached data
                        this.dappClient.clearCache();
                        this._fireListenerEvent(l => l.onComplete && l.onComplete(this.job));
                        resolve();
                    }, 3000));
                }).catch((error) => {
                    this.job.state = 'transactionError';
                    this.job.error = error.json ? error.json.error : error
                });
        }).catch(() => {
            stateCallback({ state: 'signatureRequestDenied' });
        });
    }

    getSignedTransaction(job, trxCallback) {
        return this._signTransaction(job)
            .then(trx => trxCallback(trx));
    }

    _signTransaction(job) {
        const actions = job.actions.map(action => {
            const actionCopy = Object.assign(action);
            actionCopy.authorization = [job.authorization];
            return actionCopy;
        });

        return job.wallet.eosApi
            .transact({
                actions
            },
                {
                    sign: true,
                    broadcast: false,
                    blocksBehind: 3,
                    expireSeconds: 120
                }
            );
    }

    isJobFailed() {
        const state = this.job ? this.job.state : null;
        return state === 'connectionError'
            || state === 'authenticationError'
            || state === 'signatureRequestDenied'
            || state === 'transactionError';
    }

    isJobComplete() {
        const state = this.job ? this.job.state : null;
        return state === 'transactionExecuted';
    }

    cancelJob() {
        this.job = null;
    }

    _fireListenerEvent(callback) {
        try {
            this.listeners.forEach(l => callback(l));
        } catch (error) {
            console.error('Failed to invoke callback listener', error);
        }
    }
}

decorate(TxJobStore, {
    job: observable
});

export default TxJobStore;
