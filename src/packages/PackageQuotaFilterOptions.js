import AssetType from '../chain/AssetType';

export default [
    {
        label: 'Small 0 - 100',
        value: 'small',
        filter: pkg => new AssetType(pkg.quota).value <= 100
    },
    {
        label: 'Medium 100 - 1000',
        value: 'medium',
        filter: pkg => new AssetType(pkg.quota).value >= 100 && new AssetType(pkg.quota).value <= 1000
    },
    {
        label: 'Large 1000 and up',
        value: 'large',
        filter: pkg => new AssetType(pkg.quota).value >= 1000
    }
]