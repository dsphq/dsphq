import { initAccessContext } from 'eos-transit';
import scatter from 'eos-transit-scatter-provider';
import lynx from 'eos-transit-lynx-provider';
import meetone from 'eos-transit-meetone-provider';
import tokenpocket from 'eos-transit-tokenpocket-provider';

class AuthManager {
    constructor(network) {
        this.accessContext = initAccessContext({
            appName: 'DSP HQ',
            network: {
                host: network.host,
                port: network.port,
                protocol: network.protocol,
                chainId: network.id
            },
            walletProviders: [
                scatter(),
                lynx(),
                meetone(),
                tokenpocket()
            ]
        });
    }

    getWallet(providerId) {
        return this.accessContext.initWallet(this.getProvider(providerId));
    }

    getProvider(providerId) {
        return this.getProviders().find(provider => provider.id === providerId);
    }

    getProviders() {
        return this.accessContext.getWalletProviders();
    }
}

export default AuthManager;
