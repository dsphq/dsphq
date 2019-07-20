import { decorate, observable } from 'mobx';

const ACCOUNTS_KEY = 'recent_accounts';
const LOGGED_IN_ACCOUNT_KEY = 'logged_in_account';

class AccountStore {
    recentAccounts = [];
    loggedInAccount = null;
    initializing = true;

    constructor(authManager, network) {
        this.authManager = authManager;
        this.network = network;

        this.recentAccounts = JSON.parse(this._getItem(ACCOUNTS_KEY) || '[]');
        // Check for logged in account
        if (this._getItem(LOGGED_IN_ACCOUNT_KEY)) {
            const { accountName, providerId } = JSON.parse(this._getItem(LOGGED_IN_ACCOUNT_KEY));
            // Attempt to login
            this.login(accountName, providerId).then(() => {
                this.initializing = false;
            }).catch(error => {
                console.warn(error);
                this.initializing = false;
                // Clear logged in user
                this._removeItem(LOGGED_IN_ACCOUNT_KEY);
            });
        } else {
            this.initializing = false;
        }
    }

    async login(accountName, providerId) {
        if (providerId !== 'cli') {
            const wallet = this.authManager.getWallet(providerId);
            await wallet.connect();
            await wallet.login(accountName);

            if (wallet.auth) {
                this.loggedInAccount = {
                    accountName: wallet.auth.accountName,
                    permission: wallet.auth.permission,
                    wallet,
                    providerId
                };

                this._setItem(LOGGED_IN_ACCOUNT_KEY, JSON.stringify({
                    accountName: wallet.auth.accountName,
                    permission: wallet.auth.permission,
                    providerId
                }));
            }
        } else {
            this.loggedInAccount = {
                accountName,
                permission: 'active',
                providerId
            };

            this._setItem(LOGGED_IN_ACCOUNT_KEY, JSON.stringify({
                accountName,
                permission: 'active',
                providerId
            }));
        }
    }

    async logout() {
        if (this.loggedInAccount) {
            const { accountName, wallet } = this.loggedInAccount;
            if (wallet) {
                await wallet.logout(accountName);
            }
            this.loggedInAccount = null;
            this._removeItem(LOGGED_IN_ACCOUNT_KEY);
        }
    }

    addRecentAccount(account) {
        const index = this.recentAccounts.findIndex((name) => name === account);
        if (index !== -1) {
            this.recentAccounts.splice(index, 1);
        }
        this.recentAccounts.unshift(account);
        this._setItem(ACCOUNTS_KEY, JSON.stringify(this.recentAccounts));
    }

    _getItem(key) {
        return window.localStorage.getItem(`${this.network.shortName}/${key}`);
    }

    _setItem(key, item) {
        window.localStorage.setItem(`${this.network.shortName}/${key}`, item);
    }

    _removeItem(key) {
        window.localStorage.removeItem(`${this.network.shortName}/${key}`);
    }
}

decorate(AccountStore, {
    recentAccounts: observable,
    loggedInAccount: observable,
    initializing: observable
});

export default AccountStore;
