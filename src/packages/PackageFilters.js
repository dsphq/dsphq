import { Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import PackageSortOptions from './PackageSortOptions';
import Chip from '@material-ui/core/Chip';
import PackageQuotaFilterOptions from './PackageQuotaFilterOptions';
import PropTypes from 'prop-types';

const style = () => ({
    chip: {
        margin: '0 8px 8px 0'
    },
    input: {
        paddingTop: 12,
        paddingBottom: 12
    },
    section: {
        marginBottom: 32
    },
    filterSelect: { 
        marginBottom: 16 
    }
});

function PackageFilters({
    classes,
    search,
    sortBy,
    filters,
    services,
    providers,
    serviceMetadata,
    onSearchChange,
    onSortByChange,
    onFiltersChange
}) {

    // Create map to track if features are currently selected
    const featureStates = {
        selected: filters.feature.includes('selected'),
        available: filters.feature.includes('available'),
        deprecated: filters.feature.includes('deprecated')
    };

    const onFeatureToggled = (name) => {
        const newFeatures = filters.feature.slice();
        if (featureStates[name]) {
            newFeatures.splice(newFeatures.indexOf(name), 1);
        } else {
            newFeatures.push(name);
        }
        onFiltersChange('feature', newFeatures);
    };

    const onSelectChange = (event) => {
        onFiltersChange(event.target.name, event.target.value);
    }

    return (
        <div>
            <div className={classes.section}>
                <Typography gutterBottom>Search</Typography>
                <TextField
                    variant="outlined"
                    margin="none"
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Search"
                    InputProps={{
                        inputProps: { autoCapitalize: 'none' },
                        classes: {
                            input: classes.input
                        }
                    }}
                    fullWidth
                />
            </div>
            <div className={classes.section}>
                <Typography gutterBottom>Sort By</Typography>
                <Select
                    value={sortBy}
                    onChange={onSortByChange}
                    input={<OutlinedInput
                        labelWidth={0}
                        name="age"
                        classes={{
                            input: classes.input
                        }}
                    />}
                    fullWidth
                >
                    {Object.keys(PackageSortOptions).map(key => <MenuItem key={key} value={key}>{PackageSortOptions[key].label}</MenuItem>)}
                </Select>
            </div>
            <div className={classes.section}>
                <Typography gutterBottom>Filters</Typography>
                <Select
                    value={filters.service}
                    onChange={onSelectChange}
                    input={<OutlinedInput
                        labelWidth={0}
                        name="service"
                        classes={{
                            input: classes.input
                        }}
                    />}
                    renderValue={() => 'Service'}
                    displayEmpty
                    multiple
                    fullWidth
                    className={classes.filterSelect}
                >
                    {services.map(service => <MenuItem key={service} value={service}>
                        <Checkbox checked={filters.service.includes(service)} color="default" />
                        <ListItemText primary={serviceMetadata[service] ? serviceMetadata[service].name : service} />
                    </MenuItem>)}
                </Select>
                <Select
                    value={filters.provider}
                    onChange={onSelectChange}
                    input={<OutlinedInput
                        labelWidth={0}
                        name="provider"
                        classes={{
                            input: classes.input
                        }}
                    />}
                    renderValue={() => 'Provider'}
                    displayEmpty
                    multiple
                    fullWidth
                    className={classes.filterSelect}
                >
                    {providers.map(provider => <MenuItem key={provider} value={provider}>
                        <Checkbox checked={filters.provider.includes(provider)} color="default" />
                        <ListItemText primary={provider} />
                    </MenuItem>)}
                </Select>
                <Select
                    value={filters.quota}
                    onChange={onSelectChange}
                    input={<OutlinedInput
                        labelWidth={0}
                        name="quota"
                        classes={{
                            input: classes.input
                        }}
                    />}
                    renderValue={() => 'Quota'}
                    displayEmpty
                    multiple
                    fullWidth
                >
                    {PackageQuotaFilterOptions.map(option => <MenuItem key={option.value} value={option.value}>
                        <Checkbox checked={filters.quota.includes(option.value)} color="default" />
                        <ListItemText primary={option.label} />
                    </MenuItem>)}
                </Select>
            </div>
            <div>
                <Typography gutterBottom>Features</Typography>
                <Chip
                    className={classes.chip}
                    label="Selected"
                    clickable
                    color={featureStates.selected ? 'primary' : 'default'}
                    variant={featureStates.selected ? 'default' : 'outlined'}
                    onClick={() => onFeatureToggled('selected')}
                />
                <Chip
                    className={classes.chip}
                    label="Available"
                    clickable
                    color={featureStates.available ? 'primary' : 'default'}
                    variant={featureStates.available ? 'default' : 'outlined'}
                    onClick={() => onFeatureToggled('available')}
                />
                <Chip
                    className={classes.chip}
                    label="Deprecated"
                    clickable
                    color={featureStates.deprecated ? 'primary' : 'default'}
                    variant={featureStates.deprecated ? 'default' : 'outlined'}
                    onClick={() => onFeatureToggled('deprecated')}
                />
            </div>
        </div>
    );
}

PackageFilters.propTypes = {
    classes: PropTypes.object,
    search: PropTypes.string,
    sortBy: PropTypes.string,
    filters: PropTypes.object,
    services: PropTypes.array,
    providers: PropTypes.array,
    serviceMetadata: PropTypes.object,
    onSearchChange: PropTypes.func.isRequired,
    onSortByChange: PropTypes.func.isRequired,
    onFiltersChange: PropTypes.func.isRequired
};

export default withStyles(style)(PackageFilters);
