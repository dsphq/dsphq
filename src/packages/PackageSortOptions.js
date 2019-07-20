import AssetType from '../chain/AssetType';

export default {
    accountsDescending: {
        label: 'Number of Accounts',
        compare: (a, b) => b.selectedPackages.length - a.selectedPackages.length
    },
    stakeDescending: {
        label: 'Amount Staked',
        compare: (a, b) => b.staked.total - a.staked.total
    },
    quotaAscending: {
        label: 'Quota: Low-High',
        compare: (a, b) => new AssetType(a.quota).value - new AssetType(b.quota).value
    },
    quotaDescending: {
        label: 'Quota: High-Low',
        compare: (a, b) => new AssetType(b.quota).value - new AssetType(a.quota).value
    },
    minStakeAscending: {
        label: 'Min Stake: Low-High',
        compare: (a, b) => new AssetType(a.minStakeQuantity).value - new AssetType(b.minStakeQuantity).value
    },
    minStakeDescending: {
        label: 'Min Stake: High-Low',
        compare: (a, b) => new AssetType(b.minStakeQuantity).value - new AssetType(a.minStakeQuantity).value
    },
    periodAscending: {
        label: 'Package Period: Low-High',
        compare: (a, b) => a.packagePeriod - b.packagePeriod
    },
    periodDescending: {
        label: 'Package Period: High-Low',
        compare: (a, b) => b.packagePeriod - a.packagePeriod
    },
    unstakePeriodAscending: {
        label: 'Unstake Period: Low-High',
        compare: (a, b) => a.minUnstakePeriod - b.minUnstakePeriod
    },
    unstakePeriodDescending: {
        label: 'Unstake Period: High-Low',
        compare: (a, b) => b.minUnstakePeriod - a.minUnstakePeriod
    }
};
