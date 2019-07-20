import { Api, Serialize } from 'eosjs';
import { TextEncoder, TextDecoder } from 'text-encoding';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

class HistoryClient {
    constructor(historyProvider, eosClient) {
        this.historyProvider = historyProvider;
        this.eosClient = eosClient;
        this.eosApi = new Api({
            rpc: eosClient,
            textDecoder,
            textEncoder
        });
        this.contracts = {};
    }

    async getActions(account, options) {
        if (this.contracts[account] === undefined) {
            try {
                this.contracts[account] = await this.eosApi.getContract(account);
            } catch (error) {
                this.contracts[account] = null;
            }
        }

        const chainInfo = await this.eosClient.get_info();
        const { hasMore, actions, cursor } = await this.historyProvider.getActions(account, chainInfo, options);
        
        const { filters } = options;
        const filteredActions = actions.filter(action => {
            return filters && filters.length ? filters.includes(action.name) :
                (action.handler_account_name === 'dappservices' ||
                    action.handler_account_name === 'dappairhodl1' ||
                    action.handler_account_name === account ||
                    action.name === 'xsignal') &&
                ((action.authorization &&
                    action.authorization.some(auth => auth.actor === account)) || (action.receiver === account))
        }).map(action => {
            if (action.name === 'xvexec') {
                return this._deserializeXvexecActionPayload(account, this.contracts[account], action);
            }
            if (action.name === 'xgeturi') {
                return this._deserializeXgeturiActionPayload(account, this.contracts[account], action)
            }
            if (action.name === 'xsignal') {
                return this._deserializeXsignalActionPayload(account, this.contracts[account], action)
            }
            return action;
        });

        return {
            hasMore,
            actions: filteredActions,
            cursor
        };
    }

    _deserializeXvexecActionPayload = (accountName, contract, action) => {
        const payloadBytes = Serialize.hexToUint8Array(action.data.payload);
        const buffer = new Serialize.SerialBuffer({
            textDecoder,
            textEncoder
        });
        buffer.pushArray(payloadBytes);
        const virtualAction = this.eosApi.deserialize(buffer, 'action');


        const actionData = Serialize.deserializeAction(contract, accountName, virtualAction.name, [], virtualAction.data, textEncoder, textDecoder);
        return {
            ...action, data: {
                ...action.data, payload: {
                    name: actionData.name,
                    data: actionData.data
                }
            }
        };
    };

    _deserializeXgeturiActionPayload = (accountName, contract, action) => {
        return {
            ...action, data: {
                ...action.data,
                data: Buffer.from(action.data.data, 'hex').toString('utf8'),
                uri: Buffer.from(action.data.uri, 'hex').toString('utf8')
            }
        };
    };

    _deserializeXsignalActionPayload = (accountName, contract, action) => {
        if (action.data.action === 'geturi') {
            return {
                ...action, data: {
                    ...action.data,
                    signalRawData: Buffer.from(action.data.signalRawData, 'hex').toString('utf8')
                }
            };
        }
        return action;
    };
}

export default HistoryClient;
