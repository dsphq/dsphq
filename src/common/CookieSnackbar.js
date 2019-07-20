import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        left: 0,
        width: '100%',
        transform: 'none'
    },
    contentRoot: {
        width: '100%',
        maxWidth: '100%',
        borderRadius: 0,
        justifyContent: 'center'
    },
    contentAction: {
        marginLeft: 16,
        [theme.breakpoints.down('sm')]: {
            margin: 0,
            padding: 0
        }
    }
});

function CookieSnackbar({ classes }) {
    const [showSnackbar, setShowSnackbar] = useState(!window.localStorage.getItem('cookiePolicyAccepted'));

    const onClose = () => {
        window.localStorage.setItem('cookiePolicyAccepted', true);
        setShowSnackbar(false);
    };

    return showSnackbar ? (
        <Snackbar
            classes={{ root: classes.root }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={true}
            ContentProps={{
                classes: {
                    root: classes.contentRoot,
                    action: classes.contentAction
                }
            }}
            message={
                <span id="message-id">
                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                </span>
            }
            action={
                <Button color="primary" variant="contained" size="medium" onClick={onClose}>
                    Got It
                </Button>
            }
        />
    ) : null;
}

CookieSnackbar.propTypes = {
    classes: PropTypes.object
};

export default withStyles(styles)(CookieSnackbar);