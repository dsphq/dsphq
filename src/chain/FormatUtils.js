
import { Long } from 'bytebuffer';
import BigNumber from 'bignumber.js';

const charmap = '.12345abcdefghijklmnopqrstuvwxyz';
const charidx = ch => {
    const idx = charmap.indexOf(ch)
    if (idx === -1)
        throw new TypeError(`Invalid character: '${ch}'`)

    return idx
};

class FormatUtils {

    static buildChecksumKey(val1, val2, val3) {
        let encodedVal3 = new BigNumber(FormatUtils.encodeName(val3, true));
        let encodedVal2 = new BigNumber(FormatUtils.encodeName(val2, true));
        let encodedNone = new BigNumber(0);
        let encodedVal1 = new BigNumber(FormatUtils.encodeName(val1, true));
        encodedVal2 = (FormatUtils.toBound(encodedVal2.toString(16), 8));
        encodedVal3 = (FormatUtils.toBound(encodedVal3.toString(16), 8));
        encodedVal1 = (FormatUtils.toBound(encodedVal1.toString(16), 8));
        encodedNone = (FormatUtils.toBound(encodedNone.toString(16), 8));
        return encodedVal1 + encodedNone + encodedVal2 + encodedVal3;
    };

    static toBound(numStr, bytes) {
        return `${(new Array(bytes * 2 + 1).join('0') + numStr).substring(numStr.length).toUpperCase()}`;
    }

    // encodeName function from eosjs
    // https://github.com/EOSIO/eosjs/blob/v16.0.9/src/format.js#L78
    static encodeName(name, littleEndian = true) {
        if (typeof name !== 'string')
            throw new TypeError('name parameter is a required string')

        if (name.length > 12)
            throw new TypeError('A name can be up to 12 characters long')

        let bitstr = ''
        for (let i = 0; i <= 12; i++) { // process all 64 bits (even if name is short)
            const c = i < name.length ? charidx(name[i]) : 0
            const bitlen = i < 12 ? 5 : 4
            let bits = Number(c).toString(2)
            if (bits.length > bitlen) {
                throw new TypeError('Invalid name ' + name)
            }
            bits = '0'.repeat(bitlen - bits.length) + bits
            bitstr += bits
        }

        const value = Long.fromString(bitstr, true, 2)

        // convert to LITTLE_ENDIAN
        let leHex = ''
        const bytes = littleEndian ? value.toBytesLE() : value.toBytesBE()
        for (const b of bytes) {
            const n = Number(b).toString(16)
            leHex += (n.length === 1 ? '0' : '') + n
        }

        const ulName = Long.fromString(leHex, true, 16).toString()

        return ulName.toString()
    }
}

export default FormatUtils;
