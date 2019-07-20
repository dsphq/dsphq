import { Divider } from '@material-ui/core';
import React from 'react';
import NoResultsText from '../common/NoResultsText';
import DspListItem from './DspListItem';
import DspSortOptions from './DspSortOptions';
import PropTypes from 'prop-types';

function DspList({
    providers,
    search,
    sort,
    className
}) {

    const sortedProviders = providers.slice().sort(DspSortOptions[sort].compare);
    const filteredProviders = search ? sortedProviders.filter(provider => provider.id.startsWith(search)) : sortedProviders;

    return (
        <div className={className}>
            {filteredProviders && <div>
                <Divider light />
                {filteredProviders.map(provider => {
                    return <DspListItem
                        key={provider.id}
                        provider={provider}
                    />;
                })}
                {filteredProviders.length === 0 && <NoResultsText>
                    No providers matching filters
                </NoResultsText>}
            </div>}
        </div>
    );
}

DspList.propTypes = {
    providers: PropTypes.array,
    search: PropTypes.string,
    sort: PropTypes.string,
    className: PropTypes.string,
};

export default DspList;
