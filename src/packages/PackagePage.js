import { Divider, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FilterIcon from '@material-ui/icons/FilterList';
import { observer, useObserver } from 'mobx-react-lite';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ApiError from '../common/ApiError';
import LoadingIndicator from '../common/LoadingIndicator';
import NoResultsText from '../common/NoResultsText';
import DappClientContext from '../dsp/DappClientContext';
import MobxContext from '../mobx/MobxContext';
import PackageCard from './PackageCard';
import PackageFilters from './PackageFilters';
import PackageQuotaFilterOptions from './PackageQuotaFilterOptions';
import PackageSortOptions from './PackageSortOptions';
import PropTypes from 'prop-types';

const style = (theme) => ({
    root: {
        margin: 'auto',
        maxWidth: 1300,
        padding: 16
    },
    filtersPanel: {
        padding: 16,
        boxShadow: '0 0 4px 1px rgba(0, 0, 0, 0.01), 0 3px 24px rgba(0, 0, 0, 0.6)'
    },
    mainContent: {
        [theme.breakpoints.up('md')]: {
            flex: 1
        }
    },
    contentContainer: {
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    sidePanels: {
        width: 250,
        marginLeft: 16,
        marginBottom: 0
    },
    closeDrawerButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        zIndex: 1000
    },
    header: { 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: 24, 
        justifyContent: 'space-between' 
    },
    filterIcon: { 
        marginLeft: 4 
    },
    filterChip: { 
        margin: '0 8px 8px 0', 
        fontSize: '1rem' 
    },
    packageSectionsContainer: { 
        margin: '16px 0 24px 0' 
    },
    packageSection: { 
        marginBottom: 16 
    },
    divider: { 
        marginBottom: 16 
    },
    packageFiltersDrawerContent: { 
        padding: 16 
    },
    packageFiltersDrawerTitle: { 
        marginBottom: 16 
    }
});

const DEFAULT_SORT = 'accountsDescending';

const packageQuotaFilterOptionsMap = PackageQuotaFilterOptions.reduce((accumulator, option) => {
    accumulator[option.value] = option;
    return accumulator;
}, {});

const FILTERS = {
    service: (value, pkgDef) => value === pkgDef.service,
    provider: (value, pkgDef) => value === pkgDef.provider,
    quota: (value, pkgDef) => packageQuotaFilterOptionsMap[value] ? packageQuotaFilterOptionsMap[value].filter(pkgDef) : false,
    feature: (value, pkgDef, loggedInAccount) => {
        switch (value) {
            case 'selected':
                return loggedInAccount && pkgDef.selectedPackages.some(pkg => pkg.account === loggedInAccount.accountName);
            case 'available':
                return !pkgDef.deprecated;
            case 'deprecated':
                return pkgDef.deprecated;
            default:
                return true;
        }
    }
};

function PackagePage({ classes, history, location }) {
    const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });

    const [packages, setPackages] = useState(null);
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [search, setSearch] = useState('');
    const [serviceMetadata, setServiceMetadata] = useState(null);
    const [filters, setFilters] = useState({
        service: queryParams.service || [],
        provider: queryParams.provider || [],
        quota: queryParams.quota || [],
        feature: queryParams.feature || []
    });
    const [sortBy, setSortBy] = useState(queryParams.sortBy || DEFAULT_SORT);
    const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
    const [apiError, setApiError] = useState(false);
    const { accountStore } = useContext(MobxContext);
    const dappClient = useContext(DappClientContext);

    useEffect(() => {
        Promise.all([
            dappClient.getPackageDefinitions(),
            dappClient.getServiceMetadata()
        ]).then(([packages, serviceMetadata]) => {
            const services = new Set();
            const providers = new Set();

            packages.forEach(pkg => {
                services.add(pkg.service);
                providers.add(pkg.provider);
            });

            setServiceMetadata(serviceMetadata);
            setServices(Array.from(services));
            setProviders(Array.from(providers));
            setPackages(packages);
        }).catch(() => setApiError(true));
    }, [dappClient, history]);

    useEffect(() => {
        // Update query params
        const params = { ...filters };
        if (sortBy !== DEFAULT_SORT) {
            params.sortBy = sortBy;
        }
        history.replace({ search: qs.stringify(params, { arrayFormat: 'brackets', encodeValuesOnly: true }) });
    }, [filters, sortBy, history]);

    const filterPackage = (pkg) => {
        return (!search || pkg.packageId.startsWith(search) || pkg.provider.startsWith(search) || pkg.service.startsWith(search)) &&
            Object.keys(filters).every(key => !filters[key].length || filters[key].some(val => FILTERS[key](val, pkg, accountStore.loggedInAccount)));
    }

    const onFilterSelected = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
    }

    const onSortBySelected = (event) => {
        const newSortBy = event.target.value;
        setSortBy(newSortBy);
    }

    const onClearFilters = () => {
        const filtersCopy = { ...filters };
        Object.keys(filters).forEach(key => {
            filtersCopy[key] = [];
        });
        setFilters(filtersCopy);
    }

    const onRemoveFilter = (type, filter) => () => {
        const filtersCopy = { ...filters };
        filtersCopy[type].splice(filters[type].indexOf(filter), 1);
        setFilters(filtersCopy);
    }

    const onPackageSelected = pkg => event => {
        event.stopPropagation();
        history.push(`/packages/${pkg.provider}/${pkg.service}/${pkg.packageId}`);
    }

    const onToggleFiltersDrawer = () => {
        setShowFiltersDrawer(!showFiltersDrawer);
    };

    const getFilterLabel = (key, filter) => {
        switch (key) {
            case 'service':
                return serviceMetadata[filter] ? serviceMetadata[filter].name : filter;
            case 'quota':
                return packageQuotaFilterOptionsMap[filter] ? `Quota: ${packageQuotaFilterOptionsMap[filter].label}` : filter;
            case 'feature':
                return `Feature: ${filter}`;
            default:
                return filter;
        }
    }

    // Sort and filter
    const packageMap = packages ? packages.slice().sort(PackageSortOptions[sortBy].compare)
        .filter(filterPackage).reduce((sections, pkg) => {
            const key = pkg.service;
            if (!sections[key]) {
                sections[key] = [];
            }
            sections[key].push(pkg);

            return sections;
        }, {}) : {};

    const sections = Object.keys(packageMap).map(key => ({ name: key, packages: packageMap[key] }));
    const hasFilter = Object.keys(filters).some(key => filters[key].length);

    return useObserver(() => packages && serviceMetadata ? (
        <div className={classes.root}>
            <div className={classes.contentContainer}>
                <div className={classes.mainContent}>
                    <div className={classes.header}>
                        <Typography variant="h4">Packages</Typography>
                        <Hidden mdUp>
                            <Button color="primary" variant="outlined" onClick={onToggleFiltersDrawer}>
                                Filters <FilterIcon className={classes.filterIcon} />
                            </Button>
                        </Hidden>
                    </div>
                    {hasFilter && <div>
                        {Object.keys(filters).map(key => filters[key].map(filter => (<Chip
                            key={`${key}:${filter}`}
                            className={classes.filterChip}
                            label={getFilterLabel(key, filter)}
                            variant="outlined"
                            color="primary"
                            onDelete={onRemoveFilter(key, filter)}
                        />)))}
                        <Link component="button" variant="body2" onClick={onClearFilters}>Clear All</Link>
                    </div>}
                    <div className={classes.packageSectionsContainer}>
                        {sections.map(section => <div key={section.name} className={classes.packageSection}>
                            <Typography color="primary" variant="h6" gutterBottom>
                                {serviceMetadata[section.name] ? serviceMetadata[section.name].name : section.name} - {section.packages.length} package{section.packages.length === 1 ? '' : 's'}
                            </Typography>
                            <Divider light className={classes.divider} />
                            <div>
                                <Grid container>
                                    {section.packages.map(pkg => <Grid key={pkg.id} item xs={12} sm={6} lg={4}>
                                        <PackageCard
                                            pkg={pkg}
                                            selected={accountStore.loggedInAccount && pkg.selectedPackages.some(({account}) => account === accountStore.loggedInAccount.accountName)}
                                            onSelect={onPackageSelected(pkg)}
                                        />
                                    </Grid>)}
                                </Grid>
                            </div>
                        </div>)}
                        {sections.length === 0 && <NoResultsText>
                            No packages matching filters
                        </NoResultsText>}
                    </div>
                </div>
                <Hidden smDown>
                    <div className={classes.sidePanels}>
                        <div className={classes.filtersPanel}>
                            <PackageFilters
                                filters={filters}
                                sortBy={sortBy}
                                search={search}
                                services={services}
                                providers={providers}
                                serviceMetadata={serviceMetadata}
                                onFiltersChange={onFilterSelected}
                                onSortByChange={onSortBySelected}
                                onSearchChange={(val) => setSearch(val)}
                            />
                        </div>
                    </div>
                </Hidden>
            </div>
            <Hidden mdUp>
                <Drawer
                    variant="temporary"
                    anchor="right"
                    open={showFiltersDrawer}
                    onClose={onToggleFiltersDrawer}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    <IconButton className={classes.closeDrawerButton} onClick={onToggleFiltersDrawer}>
                        <CloseIcon />
                    </IconButton>
                    <div className={classes.packageFiltersDrawerContent}>
                        <Typography variant="title" className={classes.packageFiltersDrawerTitle}>Filter Packages</Typography>
                        <PackageFilters
                            filters={filters}
                            sortBy={sortBy}
                            search={search}
                            services={services}
                            providers={providers}
                            serviceMetadata={serviceMetadata}
                            onFiltersChange={onFilterSelected}
                            onSortByChange={onSortBySelected}
                            onSearchChange={(val) => setSearch(val)}
                        />
                    </div>
                </Drawer>
            </Hidden>
        </div>
    ) : apiError ? <ApiError /> : <LoadingIndicator />);
}

PackagePage.propTypes = {
    classes: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
};

export default withStyles(style)(withRouter(observer(PackagePage)));
