import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';

const getLabel = (account) => {
    if (!account) {
        return '';
    } else if (account === 'eosio') {
        return `E`;
    } if (account.indexOf('eosio.') === 0) {
        return `E${account.substring(6).charAt(0)}`;
    } else if (account.indexOf('eos.') === 0) {
        return `E${account.substring(4).charAt(0)}`;
    } else if (account.indexOf('eos') === 0) {
        return `E${account.substring(3).charAt(0)}`;
    } else {
        return account.charAt(0);
    }
};

function AccountAvatar({ className, account }) {
    return (
        <Avatar className={className}>
            {getLabel(account).toUpperCase()}
        </Avatar>
    );
}

AccountAvatar.propTypes = {
    className: PropTypes.string,
    account: PropTypes.string
};

export default AccountAvatar;
