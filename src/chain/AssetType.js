import numeral from 'numeral';

class AssetType {
    constructor(asset) {
        this.asset = asset;
        this.value = parseFloat(asset.substring(0, asset.indexOf(' ')));
        this.symbol = asset.substring(asset.indexOf(' ') + 1);
    }

    toString() {
        return `${numeral(this.value).format('0.0000', Math.floor)} ${this.symbol}`;
    }

    static fromNumber(value, symbol) {
        return new AssetType(`${numeral(value).format('0.0000', Math.floor)} ${symbol}`);
    }
}

export default AssetType;