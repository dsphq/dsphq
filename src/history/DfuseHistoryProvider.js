import axios from 'axios';
import moment from 'moment';

class DfuseHistoryProvider {
    constructor(historyEndpoint, eosClient) {
        this.historyEndpoint = historyEndpoint;
        this.eosClient = eosClient;
        this.cachedToken = window.localStorage.getItem('dfuseJwt') ? JSON.parse(window.localStorage.getItem('dfuseJwt')) : undefined;
        this.accountBlockNumMap = {};
    }

    async getActions(account, chainInfo, { cursor, limit, cancelToken, filters }) {
        if (!this.accountBlockNumMap[account]) {
            const { created } = await this.eosClient.get_account(account);
            try {
                this.accountBlockNumMap[account] = await this._queryApi(`${this.historyEndpoint}/v0/block_id/by_time?time=${created}&comparator=lte`).then(({ block }) => block.num);
            } catch (error) {
                this.accountBlockNumMap[account] = 1;
            }
        }

        const blockCount = chainInfo.head_block_num - this.accountBlockNumMap[account];
        const query = filters && filters.length ? `(account:${account} OR receiver:${account}) ${filters.length > 1 ? `(${filters.map(filter => `action:${filter}`).join(' OR ')})` : `action:${filters[0]}`}` :
            `(account:dappservices OR account:dappairhodl1 OR account:${account} OR action:xsignal) (auth:${account} OR receiver:${account})`;

        let url = `${this.historyEndpoint}/v0/search/transactions?limit=${limit}&with_reversible=true&block_count=${blockCount}&sort=desc&q=${encodeURIComponent(query)}`;
        if (cursor) {
            url += `&cursor=${cursor}`;
        }

        const response = await this._queryApi(url, { cancelToken, timeout: 60000 });

        const hasMore = response.cursor && response.cursor !== '9hd1ai3EX1dUhNPvo0dj0Q==' &&
            response.transactions && response.transactions.length === limit;
        let parsedActions = response.transactions ? response.transactions.reduce((acc, { lifecycle }) => {
            lifecycle.execution_trace.action_traces.forEach(at => this._mapActionModel(at, acc, lifecycle));
            return acc;
        }, []) : [];

        return {
            hasMore: !!hasMore,
            actions: parsedActions,
            cursor: response.cursor
        };
    }


    _queryApi(url, options) {
        return this._getJwtToken().then(token => axios.get(url + `&token=${token}`, options).then(response => response.data));
    }

    _getJwtToken() {
        if (this.pendingAuthRequest !== undefined) {
            return this.pendingAuthRequest;
        } else if (this.cachedToken && moment.unix(this.cachedToken.expiration).isAfter(moment().add(1, 'm'))) {
            return Promise.resolve(this.cachedToken.token);
        } else {
            this.pendingAuthRequest = this._issueAuthRequest().then(({ expires_at, token }) => {
                this.cachedToken = { expiration: expires_at, token };
                window.localStorage.setItem('dfuseJwt', JSON.stringify(this.cachedToken));
                this.pendingAuthRequest = undefined;
                return token;
            });
            return this.pendingAuthRequest;
        }
    }

    _issueAuthRequest() {
        return axios({
            method: 'POST',
            data: {
                api_key: 'web_7338711fda84cc0506f1254602fb4206'
            },
            url: 'https://auth.dfuse.io/v1/auth/issue'
        }).then((response) => {
            return response.data;
        });
    }

    _mapActionModel(action, actions, lifecycle) {
        const actionModel = {
            status: lifecycle.transaction_status,
            transaction_id: action.trx_id,
            receiver: action.receipt.receiver,
            console: action.console,
            authorization: action.act.authorization,
            handler_account_name: action.act.account,
            name: action.act.name,
            data: action.act.data,
            block_time: action.block_time,
            block_num: action.block_num,
            global_seq: action.receipt.global_sequence,
            act_digest: action.receipt.act_digest,
            irreversible: lifecycle.execution_irreversible,
            transaction: lifecycle.transaction,
            execution_trace: lifecycle.execution_trace
        };
        actionModel.id = `${actionModel.transaction_id}:${actionModel.handler_account_name}:${actionModel.name}:${actionModel.act_digest}`;
        actions.push(actionModel);

        if (action.inline_traces) {
            action.inline_traces.forEach(at => this._mapActionModel(at, actions, lifecycle));
        }
    }
}

export default DfuseHistoryProvider;
