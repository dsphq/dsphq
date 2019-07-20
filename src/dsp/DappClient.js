import axios from 'axios';
import FormatUtils from '../chain/FormatUtils';
import moment from 'moment';
import AssetType from '../chain/AssetType';

class DappClient {

    constructor(eosClient, contracts) {
        this.eosClient = eosClient;
        this.contracts = contracts;
        this.serviceMetadata = this._getServiceMetadata();
        this.providerMetadata = this._getProviderMetadata();
    }

    clearCache() {
        this.selectedPackagesPromise = undefined;
        this.packageDefinitionsPromise = undefined;
    }

    getServiceMetadata() {
        return this.serviceMetadata;
    }

    async getStats() {
        const [
            packageDefinitions, 
            selectedPackages, 
            providers, 
            dappStats
        ] = await Promise.all([
            this.getPackageDefinitions(),
            this.getSelectedPackages(),
            this.getProviders(),
            this.getDappStats()
        ]);

        const accounts = selectedPackages.reduce((accounts, pkg) => {
            accounts.add(pkg.account);
            return accounts;
        }, new Set());

        const stats = {
            users: {
                total: accounts.size
            },
            dsp: {
                total: providers.length
            },
            packages: {
                total: packageDefinitions.length
            },
            dapp: {
                supply: new AssetType(dappStats.supply).value
            }
        };
        return stats;
    }

    getSelectedPackages() {
        if (!this.selectedPackagesPromise) {
            this.selectedPackagesPromise = Promise.all([
                this._getAllTableRows({
                    code: this.contracts.dappservices,
                    scope: '......2ke1.o4',
                    table: 'accountext',
                    limit: 100
                }),
                this.providerMetadata,
                this.serviceMetadata
            ]).then(([accountsExt, providerMetadata, serviceMetadata]) => accountsExt.reduce((packages, accountExt) => {
                packages.push(...this._buildPackageModelsFromAccountExt(
                    accountExt,
                    providerMetadata[accountExt.provider],
                    serviceMetadata[accountExt.service]
                ));
                return packages;
            }, []));
        }
        return this.selectedPackagesPromise;
    }

    getAccountDetails(account) {
        return Promise.all([
            this.getBalance(account),
            this.getPackageDefinitions(),
            this.getReward(account),
            this.getStaked(account),
            this.getRefunds(account),
            this.getRefunds(this.contracts.dappairhodl).then(refunds => refunds.filter(refund => refund.account === account)),
            this.getAirHodlBalance(account).catch(() => ({})),
            this.serviceMetadata,
            this.providerMetadata
        ]).then(async ([
            availableBalance,
            packageDefinitions,
            reward,
            staked,
            refunds,
            airHodlRefunds,
            airHodlBalance,
            serviceMetadata,
            providerMetadata
        ]) => {
            const available = new AssetType(availableBalance).value;
            // Add the balance of all staked tokens
            const stakedBalance = staked.reduce((balance, row) => balance + new AssetType(row.balance).value, 0);
            // Add refunds
            const pendingRefundAmount = [...refunds, ...airHodlRefunds].reduce((balance, row) => balance + new AssetType(row.amount).value, 0);

            const accountDetails = {
                name: account,
                balance: {
                    total: available + stakedBalance + pendingRefundAmount,
                    staked: stakedBalance,
                    pendingRefund: pendingRefundAmount,
                    available,
                    airHodl: airHodlBalance
                },
                refunds: [
                    ...refunds.map(refund =>
                        this._buildRefundModel(refund, false, providerMetadata[refund.provider], serviceMetadata[refund.service])),
                    ...airHodlRefunds.map(refund =>
                        this._buildRefundModel(refund, true, providerMetadata[refund.provider], serviceMetadata[refund.service]))
                ]
            };

            // Check if this account is a DSP
            const providedPackages = packageDefinitions.filter(pkgDef => pkgDef.provider === account);
            if (providedPackages.length) {
                const serviceMap = providedPackages.reduce((services, pkg) => {
                    if (!services[pkg.service]) {
                        services[pkg.service] = {
                            account: pkg.service,
                            name: serviceMetadata[pkg.service] ? serviceMetadata[pkg.service].name : pkg.service
                        };
                    }
                    return services;
                }, {});

                accountDetails.dsp = {
                    id: account,
                    services: Object.keys(serviceMap).map(key => serviceMap[key]),
                    packages: providedPackages,
                    reward,
                    // Use package json to get dsp json uri
                    details: await this.getProviderDetailsFromPackage(providedPackages[0])
                };
            }

            accountDetails.selected = packageDefinitions.reduce((accumulator, pkgDef) => {
                accumulator.packageDefinitions[pkgDef.id] = pkgDef;
                accumulator.packages.push(...pkgDef.selectedPackages.filter(pkg => pkg.account === account));
                return accumulator;
            }, { packageDefinitions: {}, packages: [] });

            // Get AirHODL balance for each selected package
            await Promise.all(accountDetails.selected.packages.map(pkg => this.getStakedAirHodl(account, pkg.service, pkg.provider)
                .then(stakedAirHodl => {
                    pkg.stakedAirHodl = stakedAirHodl ? stakedAirHodl.balance : '0.0000 DAPP';
                })));

            return accountDetails;
        });
    }

    getPackageDefinitions() {
        if (!this.packageDefinitionsPromise) {
            this.packageDefinitionsPromise = Promise.all([
                this.getSelectedPackages(),
                this._getAllTableRows({
                    code: this.contracts.dappservices,
                    scope: this.contracts.dappservices,
                    table: 'package',
                    limit: 1000
                }),
                this.getTotalDappStaked().then(total => new AssetType(total).value),
                this.providerMetadata,
                this.serviceMetadata
            ]).then(([selectedPackages, packageDefinitions, totalDappStaked, providerMetadata, serviceMetadata]) => {
                // Build map of selected packages by package definition
                const selectedPackagesMap = selectedPackages.reduce((accumulator, pkg) => {
                    const key = `${pkg.packageId}:${pkg.provider}:${pkg.service}`;
                    if (!accumulator[key]) {
                        accumulator[key] = [];
                    }
                    accumulator[key].push(pkg);
                    return accumulator;
                }, {})

                const packageDefModels = packageDefinitions.map(pkgDef => {
                    const model = this._buildPackageDefModel(pkgDef, providerMetadata[pkgDef.provider], serviceMetadata[pkgDef.service]);
                    model.selectedPackages = selectedPackagesMap[model.id] || [];

                    // Calculate stats
                    model.staked = model.selectedPackages.reduce((staked, pkg) => {
                        staked.total += new AssetType(pkg.balance).value;
                        staked.percentage = Math.floor((staked.total / totalDappStaked) * 1000000) / 1000000;
                        return staked;
                    }, { total: 0, percentage: 0 });

                    return model;
                });

                return packageDefModels;
            });
        }
        return this.packageDefinitionsPromise;
    }

    getPackageDefinition(provider, service, packageId) {
        const key = FormatUtils.buildChecksumKey(packageId, provider, service);
        return Promise.all([
            this.eosClient.get_table_rows({
                code: this.contracts.dappservices,
                scope: this.contracts.dappservices,
                table: 'package',
                lower_bound: key,
                key_type: 'sha256',
                encode_type: 'hex',
                index_position: 2,
                limit: 1,
                json: true
            }).then(res => {
                return res.rows.length ? res.rows[0] : undefined;
            }),
            this.getSelectedPackages(),
            this.getServiceModel(service, provider, packageId).catch(() => ({})),
            this.getTotalDappStaked().then(total => new AssetType(total).value),
            this.providerMetadata,
            this.serviceMetadata
        ]).then(async ([pkgDef, selectedPackages, serviceModel, totalDappStaked, providerMetadata, serviceMetadata]) => {
            if (pkgDef) {
                const model = this._buildPackageDefModel(pkgDef, providerMetadata[pkgDef.provider], serviceMetadata[pkgDef.service]);

                model.selectedPackages = selectedPackages.filter(pkg =>
                    pkg.packageId === model.packageId &&
                    pkg.provider === model.provider &&
                    pkg.service === model.service);

                model.staked = model.selectedPackages.reduce((staked, pkg) => {
                    staked.total += new AssetType(pkg.balance).value;
                    staked.percentage = Math.floor((staked.total / totalDappStaked) * 1000000) / 1000000;
                    return staked;
                }, { total: 0, percentage: 0 });

                // Add total staked for provider
                model.providerTotalStaked = AssetType.fromNumber(selectedPackages.filter(pkg => pkg.provider === model.provider)
                    .reduce((total, pkg) => total + new AssetType(pkg.balance).value, 0), 'DAPP').toString();

                model.serviceModel = serviceModel;

                model.details = await this.getPackageDetails(model);
                model.providerDetails = model.details.dsp_json_uri ? await this.getProviderDetails(model.details.dsp_json_uri) : {};

                return model;
            }
        });
    }

    getProviders() {
        return Promise.all([
            this.getPackageDefinitions(),
            this.getTotalDappStaked().then(total => new AssetType(total).value),
            this.providerMetadata,
            this.serviceMetadata
        ]).then(([packages, totalDappStaked, providerMetadata, serviceMetadata]) => {
            const providerMap = packages.reduce((providerMap, pkg) => {
                if (!providerMap[pkg.provider]) {
                    providerMap[pkg.provider] = this._buildProviderModel(pkg.provider, providerMetadata[pkg.provider]);
                }
                if (!providerMap[pkg.provider].services.some(service => service.account === pkg.service)) {
                    providerMap[pkg.provider].services.push({
                        account: pkg.service,
                        name: serviceMetadata[pkg.service] ? serviceMetadata[pkg.service].name : pkg.service
                    });
                }
                providerMap[pkg.provider].packages.push(pkg);

                return providerMap;
            }, {});

            return Object.keys(providerMap).map(key => {
                const provider = providerMap[key];
                // Calculate total staked
                provider.staked = provider.packages.reduce((staked, { selectedPackages }) => {
                    selectedPackages.forEach(pkg => {
                        staked.total += new AssetType(pkg.balance).value;
                        staked.percentage = Math.floor((staked.total / totalDappStaked) * 1000000) / 1000000;
                        staked.numberOfAccounts++;
                    });
                    return staked;
                }, { total: 0, percentage: 0, numberOfAccounts: 0 });

                return provider;
            });
        });
    }

    getReward(account) {
        return this.eosClient.get_table_rows({
            code: this.contracts.dappservices,
            scope: account,
            table: 'reward',
            limit: 1,
            json: true
        }).then(res => {
            return res.rows.length ? res.rows[0] : undefined;
        }).catch(() => ({ total_staked: '0 DAPP', balance: '0 DAPP', last_usage: 0, last_inflation_ts: 0}));
    }

    getBalance(account) {
        return this.eosClient.get_table_rows({
            code: this.contracts.dappservices,
            scope: account,
            table: 'accounts',
            limit: 100,
            json: true
        }).then(res => {
            return res.rows.length ? res.rows[0].balance : '0 DAPP';
        });
    }

    getAirHodlBalance(account) {
        return this.eosClient.get_table_rows({
            code: this.contracts.dappairhodl,
            scope: account,
            table: 'accounts',
            limit: 1,
            json: true
        }).then(res => {
            return res.rows.length ? res.rows[0] : undefined;
        });
    }

    getStakedAirHodl(account, service, provider) {
        const key = FormatUtils.buildChecksumKey(account, provider, service);
        return this.eosClient.get_table_rows({
            code: this.contracts.dappservices,
            scope: this.contracts.dappairhodl,
            table: 'staking',
            lower_bound: key,
            key_type: 'sha256',
            encode_type: 'hex',
            index_position: 2,
            limit: 1,
            json: true
        }).then(res => {
            return res.rows.find(row => row.account === account && row.service === service && row.provider === provider)
        });
    }

    getStaked(account) {
        return this.eosClient.get_table_rows({
            code: this.contracts.dappservices,
            scope: account,
            table: 'staking',
            limit: 1000,
            json: true
        }).then(res => {
            return res.rows;
        });
    }

    getRefunds(account) {
        return this.eosClient.get_table_rows({
            code: this.contracts.dappservices,
            scope: account,
            table: 'refunds',
            limit: 1000,
            json: true
        }).then(res => {
            return res.rows;
        });
    }

    getTotalDappStaked() {
        return this.eosClient.get_table_rows({
            code: this.contracts.dappservices,
            scope: '......2ke1.o4',
            table: 'statext',
            limit: 1,
            json: true
        }).then(res => {
            return res.rows ? res.rows[0].staked : '0.0000 DAPP';
        });
    }

    getDappStats() {
        return this.eosClient.get_table_rows({
            code: this.contracts.dappservices,
            scope: 'DAPP',
            table: 'stat',
            limit: 1,
            json: true
        }).then(res => {
            return res.rows ? res.rows[0] : {};
        });
    }

    getProviderDetails(uri) {
        return axios.get(uri).then(({ data }) => typeof data === 'object' && data !== null ? data : {}).catch(() => ({}));
    }

    getProviderDetailsFromPackage(pkg) {
        // Use package json to get dsp json uri
        return this.getPackageDetails(pkg)
            .then(({ dsp_json_uri }) => dsp_json_uri ? this.getProviderDetails(dsp_json_uri) : {});
    }

    getPackageDetails({ packageJsonUri }) {
        return packageJsonUri ? axios.get(packageJsonUri)
            .then(({ data }) => typeof data === 'object' && data !== null ? data : {}).catch(() => ({})) : Promise.resolve({});
    }

    getServiceModel(service, provider, packageId) {
        return this.eosClient.get_table_rows({
            code: service,
            scope: provider,
            table: 'providermdl',
            limit: 1,
            lower_bound: packageId,
            json: true
        }).then(res => {
            return res.rows.length ? res.rows[0].model : null;
        });
    }

    _getServiceMetadata() {
        return axios.get('https://raw.githubusercontent.com/dsphq/dsp-services/master/services.json')
            .then(res => res.data)
            .then(services => services.reduce((accumulator, service) => {
                accumulator[service.account] = service;
                return accumulator;
            }, {}));
    }

    _getProviderMetadata() {
        return axios.get('https://raw.githubusercontent.com/dsphq/dsp-providers/master/providers.json')
            .then(res => res.data)
            .then(providers => providers.reduce((accumulator, provider) => {
                accumulator[provider.account] = provider;
                return accumulator;
            }, {}));
    }

    _getAllTableRows({ code, scope, table, lower_bound, limit }, results = []) {
        return this.eosClient.get_table_rows({
            code,
            scope,
            table,
            lower_bound,
            limit,
            json: true
        }).then(res => {
            if (res.rows.length) {
                results.push(...res.rows);
            }
            return res.more && res.rows.length ? this._getAllTableRows({
                code,
                scope,
                table,
                limit,
                lower_bound: res.rows[res.rows.length - 1].id + 1
            }, results) : results;
        });
    }

    _buildRefundModel(refund, airHodl, providerMetadata = {}, serviceMetadata = {}) {
        return {
            amount: refund.amount,
            provider: refund.provider,
            providerName: providerMetadata.name || refund.provider,
            service: refund.service,
            serviceName: serviceMetadata.name || refund.service,
            unstakeTime: parseInt(refund.unstake_time),
            airHodl
        };
    }

    _buildProviderModel(providerAccount, providerMetadata = {}) {
        return {
            services: [],
            packages: [],
            logo: providerMetadata.logo,
            name: providerMetadata.name,
            id: providerAccount
        };
    }

    _buildPackageDefModel(pkg, providerMetadata = {}, serviceMetadata = {}) {
        return {
            id: `${pkg.package_id}:${pkg.provider}:${pkg.service}`,
            apiEndpoint: pkg.api_endpoint,
            packageId: pkg.package_id,
            packageJsonUri: pkg.package_json_uri,
            service: pkg.service,
            provider: pkg.provider,
            quota: pkg.quota,
            packagePeriod: pkg.package_period,
            minStakeQuantity: pkg.min_stake_quantity,
            minUnstakePeriod: pkg.min_unstake_period,
            enabled: pkg.enabled === 1,
            providerLogo: providerMetadata.logo,
            providerName: providerMetadata.name || pkg.provider,
            serviceName: serviceMetadata.name || pkg.service,
            serviceDescription: serviceMetadata.description,
            deprecated: pkg.api_endpoint === '' || pkg.api_endpoint === 'null'
        };
    }

    _buildPackageModelsFromAccountExt(accountExt, providerMetadata = {}, serviceMetadata = {}) {
        const packages = [];
        if (accountExt.package) {
            // Filter out package if it is expired
            const packageEnd = accountExt.package_end ? parseInt(accountExt.package_end) : 0;
            if (accountExt.package === accountExt.pending_package || moment(packageEnd).isAfter(moment())) {
                packages.push(this._buildPackageModelFromAccountExt(accountExt.package, accountExt, providerMetadata, serviceMetadata));
            }
        }
        if (accountExt.pending_package && accountExt.pending_package !== accountExt.package) {
            packages.push(this._buildPackageModelFromAccountExt(accountExt.pending_package, accountExt, providerMetadata, serviceMetadata));
        }
        return packages;
    }

    _buildPackageModelFromAccountExt(packageId, accountExt, providerMetadata = {}, serviceMetadata = {}) {
        const packageEnd = accountExt.package_end ? parseInt(accountExt.package_end) : 0;
        const waitingOnPackage = packageId === accountExt.pending_package &&
            accountExt.package && packageId !== accountExt.package && moment(packageEnd).isAfter(moment());
        return {
            id: `${accountExt.account}:${packageId}:${accountExt.provider}:${accountExt.service}`,
            packageId,
            account: accountExt.account,
            providerLogo: providerMetadata.logo,
            providerName: providerMetadata.name || accountExt.provider,
            availableQuota: accountExt.quota,
            balance: accountExt.balance,
            lastUsage: accountExt.last_usage ? parseInt(accountExt.last_usage) : 0,
            lastReward: accountExt.last_reward ? parseInt(accountExt.last_reward) : 0,
            packageStarted: accountExt.package_started ? parseInt(accountExt.package_started) : 0,
            packageEnd,
            service: accountExt.service,
            provider: accountExt.provider,
            serviceName: serviceMetadata.name || accountExt.service,
            serviceDescription: serviceMetadata.description,
            waitingOnPackage,
            expires: packageId !== accountExt.pending_package
        };
    }
}

export default DappClient;
