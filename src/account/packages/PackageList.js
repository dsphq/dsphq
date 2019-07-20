import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import PackageListItem from './PackageListItem';
import NoResultsText from '../../common/NoResultsText';
import PropTypes from 'prop-types';

const styles = () => ({
    root: {
        paddingTop: 16
    }
});

function PackageList({ classes, account }) {
    return (
        <div className={classes.root}>
            {account.selected.packages.length > 0 && <div>
                <Typography variant="h6" gutterBottom>Selected Packages</Typography>
                <Divider />
                {account.selected.packages.map(pkg => <PackageListItem
                    key={pkg.id}
                    pkg={pkg}
                    packageDefinition={account.selected.packageDefinitions[`${pkg.packageId}:${pkg.provider}:${pkg.service}`]}
                    account={account}
                />)}
            </div>}
            {account.selected.packages.length === 0 && <NoResultsText>No selected packages</NoResultsText>}
        </div>
    );
}

PackageList.propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object
};

export default withStyles(styles)(PackageList);
