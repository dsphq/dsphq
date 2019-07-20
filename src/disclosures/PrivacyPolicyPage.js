import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const style = (theme) => ({
    root: {
        maxWidth: 1100,
        margin: '0 auto',
        padding: '16px 8px'
    },
    paper: {
        padding: 24
    },
    markdown: {
        color: theme.palette.text.secondary
    }
});

/* eslint-disable */
const terms = `# Privacy Notice #
This privacy notice discloses the privacy practices for https://dsphq.io. This privacy notice applies solely to information collected by this website. It will notify you of the following:

1. What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.
2. What choices are available to you regarding the use of your data.
3. The security procedures in place to protect the misuse of your information.
4. How you can correct any inaccuracies in the information.

## Information Collection, Use, and Sharing ##
We are the sole owners of the information collected on this site. We only have access to/collect information that you voluntarily give us via email or other direct contact from you. We will not sell or rent this information to anyone.

We will use your information to respond to you, regarding the reason you contacted us. We will not share your information with any third party outside of our organization.

Unless you ask us not to, we may contact you via email in the future to tell you about new services, or changes to this privacy policy.

## Your Access to and Control Over Information ##
You may opt out of any future contacts from us at any time. You can do the following at any time by contacting us via the email address or phone number given on our website:

See what data we have about you, if any.
Change/correct any data we have about you.
Have us delete any data we have about you.
Express any concern you have about our use of your data.

## Security ##
We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline.

Wherever we collect sensitive information, that information is encrypted and transmitted to us in a secure way. You can verify this by looking for a lock icon in the address bar and looking for "https" at the beginning of the address of the Web page.

While we use encryption to protect sensitive information transmitted online, we also protect your information offline. Only employees who need the information to perform a specific job (for example, billing or customer service) are granted access to personally identifiable information. The computers/servers in which we store personally identifiable information are kept in a secure environment.

## Cookies ##
We use "cookies" on this site. A cookie is a piece of data stored on a site visitor's hard drive to help us improve your access to our site and identify repeat visitors to our site. For instance, when we use a cookie to identify you, you would not have to log in a password more than once, thereby saving time while on our site. Cookies can also enable us to track and target the interests of our users to enhance the experience on our site. Usage of a cookie is in no way linked to any personally identifiable information on our site.

Some of our business partners may use cookies on our site (for example, advertisers). However, we have no access to or control over these cookies.

## Links ##

This website contains links to other sites. Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.
`;
/* eslint-enable */

function PrivacyPolicyPage({ classes }) {
    return (
        <div className={classes.root}>
            <Paper classes={{ root: classes.paper }}>
                <ReactMarkdown className={classes.markdown} source={terms} disallowedTypes={['link']} unwrapDisallowed />
            </Paper>
        </div>
    );
}

PrivacyPolicyPage.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(PrivacyPolicyPage);
