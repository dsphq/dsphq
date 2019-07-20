import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Email from 'mdi-material-ui/Email';
import Facebook from 'mdi-material-ui/Facebook';
import Github from 'mdi-material-ui/GithubCircle';
import Reddit from 'mdi-material-ui/Reddit';
import Telegram from 'mdi-material-ui/Telegram';
import Twitter from 'mdi-material-ui/Twitter';
import Youtube from 'mdi-material-ui/Youtube';
import React from 'react';
import PropTypes from 'prop-types';

const SOCIAL_LINKS = [
    { id: 'twitter', tooltip: 'Twitter', path: (id) => `https://twitter.com/${id}`, icon: <Twitter /> },
    { id: 'youtube', tooltip: 'YouTube', path: (id) => `https://youtube.com/${id}`, icon: <Youtube /> },
    { id: 'facebook', tooltip: 'Facebook', path: (id) => `https://facebook.com/${id}`, icon: <Facebook /> },
    { id: 'github', tooltip: 'GitHub', path: (id) => `https://github.com/${id}`, icon: <Github /> },
    { id: 'reddit', tooltip: 'Reddit', path: (id) => `https://reddit.com/user/${id}`, icon: <Reddit /> },
    { id: 'telegram', tooltip: 'Telegram', path: (id) => `https://t.me/${id}`, icon: <Telegram /> }
];

function DspSocialLinks({ providerDetails }) {
    const onSocialLinkClick = (href) => {
        window.open(href, '_blank');
    };

    return (
        <div>
            {providerDetails.email && <Tooltip title="Email" aria-label="Email">
                <IconButton onClick={() => onSocialLinkClick(`mailto:${providerDetails.email}`)}><Email /></IconButton>
            </Tooltip>}
            {SOCIAL_LINKS.filter(link => providerDetails.social && providerDetails.social[link.id]).map(link =>
                <Tooltip key={link.id} title={link.tooltip} aria-label={link.tooltip}>
                    <IconButton onClick={() => onSocialLinkClick(link.path(providerDetails.social[link.id]))}>{link.icon}</IconButton>
                </Tooltip>)}
        </div>
    );
}

DspSocialLinks.propTypes = {
    providerDetails: PropTypes.object
};

export default DspSocialLinks;
