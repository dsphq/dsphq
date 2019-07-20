import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import PersonIcon from '@material-ui/icons/Person';
import { observer, useObserver } from 'mobx-react-lite';
import numeral from 'numeral';
import React, { useContext, useEffect, useState } from 'react';
import AssetType from '../chain/AssetType';
import ApiError from '../common/ApiError';
import LoadingIndicator from '../common/LoadingIndicator';
import DappClientContext from '../dsp/DappClientContext';
import MobxContext from '../mobx/MobxContext';
import PackageAccountList from './PackageAccountList';
import PackageAttributeList from './PackageAttributeList';
import PackageDspDetailsPanel from './PackageDspDetailsPanel';
import PackageServiceDetailsPanel from './PackageServiceDetailsPanel';
import SelectPackagePanel from './SelectPackagePanel';
import StakeUnstakePanel from './StakeUnstakePanel';
import PropTypes from 'prop-types';

const style = (theme) => ({
    root: {
        maxWidth: 1000,
        margin: '0 auto',
        padding: 16,
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    mainContent: {
        [theme.breakpoints.up('md')]: {
            flex: 1
        }
    },
    sidePanels: {
        marginBottom: 16,
        [theme.breakpoints.up('md')]: {
            width: 320,
            marginLeft: 36,
            marginBottom: 0
        }
    },
    sidePanel: {
        backgroundColor: theme.palette.background.default,
        padding: '8px 24px 16px 24px',
        boxShadow: '0 0 4px 1px rgba(0, 0, 0, 0.01), 0 3px 24px rgba(0, 0, 0, 0.6)'
    },
    avatar: {
        marginRight: 16,
        background: theme.palette.common.white
    },
    horizPanels: {
        marginTop: 24,
        [theme.breakpoints.up('md')]: {
            display: 'flex',
            '&>:first-child': {
                flex: 1,
                marginRight: 6
            },
            '&>:nth-child(2)': {
                flex: 1,
                marginLeft: 6
            }
        }
    },
    dialogCloseButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        zIndex: 1000
    },
    dialogContent: {
        padding: '16px 24px 16px 24px',
    },
    packageAttributesList: {
        marginTop: 24
    },
    packageUsageChipsContainer: {
        paddingTop: 16
    },
    packageUsageChip: {
        margin: '0 8px 8px 0'
    },
    header: {
        display: 'flex',
        alignItems: 'center'
    },
    packageNameContainer: {
        display: 'flex'
    },
    selectedPackageChip: {
        marginLeft: 16
    },
    primaryActionButton: {
        marginTop: 24
    },
    packageAccountList: {
        marginTop: 16
    }
});

function PackageDetailsPage({ classes, match, history }) {
    const [pkg, setPkg] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [apiError, setApiError] = useState(false);
    const { accountStore, txJobStore } = useContext(MobxContext);
    const dappClient = useContext(DappClientContext);

    useEffect(() => {
        const { provider, service, packageId } = match.params;
        const load = () => {
            dappClient.getPackageDefinition(provider, service, packageId)
            .then(pkg => setPkg(pkg))
            .catch(() => setApiError(true));
        };
        
        load();

        return txJobStore.addJobListener({
            onComplete: load
        });
    }, [dappClient, match, txJobStore]);

    const onAccountSelected = (account) => {
        history.push(`/accounts/${account}`);
    };

    const isSelected = pkg && accountStore.loggedInAccount && pkg.selectedPackages.some(({ account }) => accountStore.loggedInAccount.accountName === account);

    return useObserver(() => (
        pkg ? <div className={classes.root}>
            <div className={classes.mainContent}>
                <div className={classes.header}>
                    {pkg.details && pkg.details.logo && pkg.details.logo.logo_256 &&
                        <Avatar className={classes.avatar} alt="" src={pkg.details.logo.logo_256} />}
                    <div className={classes.packageNameContainer}>
                        <Typography variant="h5">
                            {pkg.details && pkg.details.name ? pkg.details.name : pkg.packageId}
                        </Typography>
                        {isSelected && <Chip
                            icon={<CheckIcon />}
                            label="Selected"
                            color="primary"
                            variant="outlined"
                            className={classes.selectedPackageChip}
                        />}
                    </div>
                </div>
                <div className={classes.packageUsageChipsContainer}>
                    <Tooltip title="Total percentage of DAPP staked to this package">
                        <Chip
                            className={classes.packageUsageChip}
                            variant="outlined"
                            label={`Percent Staked: ${numeral(pkg.staked.percentage).format('0.0000%')}`} />
                    </Tooltip>
                    <Tooltip title="Total amount staked to this package">
                        <Chip
                            className={classes.packageUsageChip}
                            variant="outlined"
                            label={`Total Staked: ${AssetType.fromNumber(pkg.staked.total, 'DAPP').toString()}`} />
                    </Tooltip>
                    <Tooltip title="Total number of accounts using this package">
                        <Chip
                            className={classes.packageUsageChip}
                            tooltip="test"
                            icon={<PersonIcon fontSize="small" />}
                            variant="outlined"
                            label={pkg.selectedPackages.length} />
                    </Tooltip>
                </div>
                <Hidden mdUp>
                    <Button className={classes.primaryActionButton} color="primary" variant="contained" onClick={() => setShowDialog(true)}>
                        {isSelected ? 'Stake / Unstake' : 'Select Package'}
                    </Button>
                </Hidden>
                <PackageAttributeList className={classes.packageAttributesList} pkg={pkg} />
                <div className={classes.horizPanels}>
                    <PackageServiceDetailsPanel pkg={pkg} />
                    <PackageDspDetailsPanel pkg={pkg} onAccountSelected={onAccountSelected} />
                </div>
                <PackageAccountList className={classes.packageAccountList} pkg={pkg} onAccountSelected={onAccountSelected} />
            </div>
            <Hidden smDown>
                {pkg && !accountStore.initializing && <div className={classes.sidePanels}>
                    <div className={classes.sidePanel}>
                        {!isSelected && <SelectPackagePanel
                            pkg={pkg}
                            account={accountStore.loggedInAccount ? accountStore.loggedInAccount.accountName : null}
                        />}
                        {isSelected && <StakeUnstakePanel
                            pkg={pkg}
                            account={accountStore.loggedInAccount.accountName}
                        />}
                    </div>
                </div>}
            </Hidden>
            <Dialog
                fullWidth
                open={showDialog}
                onClose={() => setShowDialog(false)}
                aria-labelledby="responsive-dialog-title"
            >
                <IconButton className={classes.dialogCloseButton} onClick={() => setShowDialog(false)}>
                    <CloseIcon />
                </IconButton>
                <div className={classes.dialogContent}>
                    {!isSelected && <SelectPackagePanel
                        pkg={pkg}
                        account={accountStore.loggedInAccount ? accountStore.loggedInAccount.accountName : null}
                    />}
                    {isSelected && <StakeUnstakePanel
                        pkg={pkg}
                        account={accountStore.loggedInAccount.accountName}
                    />}
                </div>
            </Dialog>
        </div> : apiError ? <ApiError /> : <LoadingIndicator />
    ));
}

PackageDetailsPage.propTypes = {
    classes: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object
};

export default withStyles(style)((observer(PackageDetailsPage)));
