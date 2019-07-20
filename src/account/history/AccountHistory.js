import { Chip, Divider, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ListPlaceholder from '../../common/ListPlaceholder';
import NoResultsText from '../../common/NoResultsText';
import ActionListItem from '../../history/ActionListItem';

const style = (theme) => ({
    root: {
        paddingTop: 16
    },
    loadMoreProgressIndicator: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 8
    },
    title: {
        marginBottom: 16
    },
    list: {
        paddingTop: 0
    },
    chip: {
        marginRight: 6,
        marginTop: 6
    },
    selectedChip: {
        backgroundColor: theme.palette.background.paper
    },
    filterPanel: { 
        marginBottom: 24 
    }
});

function AccountHistory({ classes, actions, onLoadMore, hasMore, abi, filters, onFilterSelected }) {
    return (
        <div className={classes.root}>
            <Typography variant="h5" className={classes.title}>Account Activity</Typography>
            {abi && abi.actions && <div className={classes.filterPanel}>
                {abi.actions.map(action => <Chip
                    key={action.name}
                    className={filters.includes(action.name) ? classNames(classes.chip, classes.selectedChip) : classes.chip}
                    variant="outlined"
                    color={filters.includes(action.name) ? 'primary' : 'default'}
                    label={action.name}
                    onClick={() => onFilterSelected(action.name)}
                    clickable
                />)}
            </div>}
            <ListPlaceholder ready={!!actions}>
                <div>
                    {actions && <InfiniteScroll
                        pageStart={0}
                        loadMore={onLoadMore}
                        initialLoad={false}
                        hasMore={hasMore}
                        loader={<div key="loading-indicator" className={classes.loadMoreProgressIndicator}>
                            <CircularProgress />
                        </div>}
                    >
                        <Divider light />
                        <List className={classes.list}>
                            {actions.map(action => <ActionListItem
                                key={action.id}
                                action={action}
                            />)}
                        </List>
                        {actions.length === 0 && <NoResultsText>This account has no DAPP network activity</NoResultsText>}
                    </InfiniteScroll>}
                </div>
            </ListPlaceholder>
        </div>
    );
}

AccountHistory.propTypes = {
    actions: PropTypes.array,
    onLoadMore: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    classes: PropTypes.object
};

export default withStyles(style)(AccountHistory);
