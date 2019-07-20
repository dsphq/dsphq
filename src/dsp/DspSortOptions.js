export default {
    stakeDescending: {
        label: 'Amount Staked: High-Low ',
        compare: (a, b) => b.staked.total - a.staked.total
    },
    stakeAscending: {
        label: 'Amount Staked: Low-High ',
        compare: (a, b) => a.staked.total - b.staked.total
    },
    accountsDescending: {
        label: 'Number of Accounts',
        compare: (a, b) => b.staked.numberOfAccounts - a.staked.numberOfAccounts
    }
};
