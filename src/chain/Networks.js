const NETWORKS = [
    {
        id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        name: 'Mainnet',
        shortName: 'mainnet',
        host: 'eos.greymass.com',
        port: '443',
        protocol: 'https',
        historyEndpoint: 'https://mainnet.eos.dfuse.io',
        contracts: {
            dappservices: 'dappservices',
            dappairhodl: 'dappairhodl1'
        }
    },
    {
        id: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
        name: 'Kylin Testnet',
        shortName: 'kylin',
        host: 'kylin.eos.dfuse.io',
        port: '443',
        protocol: 'https',
        historyEndpoint: 'https://kylin.eos.dfuse.io',
        contracts: {
            dappservices: 'dappservices',
            dappairhodl: 'dappairhodl1'
        }
    }
];

NETWORKS.forEach(network => {
    network.apiEndpoint = `${network.protocol}://${network.host}:${network.port}`;
});

export default NETWORKS;
