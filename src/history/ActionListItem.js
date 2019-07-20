import { orange } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PendingIcon from '@material-ui/icons/TimelapseRounded';
import moment from 'moment';
import React, { useState } from 'react';
import PrismCode from 'react-prism';
import ExpandableListItem from '../common/ExpandableListItem';
import JSONTable from '../common/JSONTable';
import ActionPatterns from './ActionPatterns';
import jsonpath from 'jsonpath';
import { Chip } from '@material-ui/core';
import PropTypes from 'prop-types';

const style = (theme) => ({
    preview: {
        display: 'block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    tab: {
        [theme.breakpoints.down('xs')]: {
            minWidth: 0
        }
    },
    tabs: {
        marginBottom: 24
    },
    pendingIcon: {
        marginLeft: 8,
        fill: orange[500]
    },
    listItem: {
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'space-between'
    },
    prismContainer: {
        fontSize: 13
    },
    actionTitleContainer: {
        display: 'flex'
    },
    listItemMainContent: { 
        minWidth: 0 
    }
});

const generatePreview = (data) => {
    let preview = '';
    if (data) {
        if (typeof (data) === 'string') {
            preview = data;
        } else if (typeof (data) === 'object') {
            const fields = Object.keys(data).reduce((acc, key) => {
                if (typeof (data[key]) === 'string') {
                    acc.push(`${key}: ${data[key]}`);
                }
                return acc;
            }, []);
            preview = fields.join('   \u2022   ');
        }
    }
    return preview;
}

const matchPattern = (str, action) => {
    const parts = [];

    let matched = str.match(/{(.*?)}/);
    while (matched && matched.length) {
        // Remove matched part
        const startIndex = str.indexOf(matched[0]);
        if (startIndex > 0) {
            parts.push(str.slice(0, startIndex));
            str = str.substring(startIndex);
        }

        let match = matched[1];
        const results = jsonpath.query(action, match);
        const val = results.length ? results[0] : '';

        parts.push(val);

        str = str.replace(matched[0], '');
        matched = str.match(/{(.*?)}/);
    }

    if (str.length) {
        parts.push(str);
    }

    return parts;
}

function ActionListItem({ classes, action }) {
    const [tab, setTab] = useState('action');

    const onTabChange = (event, tab) => {
        setTab(tab);
    };

    // Check for pattern
    const pattern = ActionPatterns.find(pattern => pattern.actionName === action.name && (!pattern.contract || pattern.contract === action.handler_account_name));

    return (
        <ExpandableListItem details={
            <div>
                <Tabs
                    classes={{ root: classes.tabs }}
                    value={tab}
                    onChange={onTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="off"
                >
                    <Tab label="Action" value="action" className={classes.tab} />
                    <Tab label="Transaction" value="transaction" className={classes.tab} />
                    <Tab label="Execution Trace" value="trace" className={classes.tab} />
                </Tabs>
                {tab === 'action' && <div>
                    <JSONTable source={action.data} />
                </div>}
                {tab === 'transaction' && <div className={classes.prismContainer}>
                    <PrismCode component="pre" className="language-json">
                        {JSON.stringify(action.transaction, null, 2)}
                    </PrismCode>
                </div>}
                {tab === 'trace' && <div className={classes.prismContainer}>
                    <PrismCode component="pre" className="language-json">
                        {JSON.stringify(action.execution_trace, null, 2)}
                    </PrismCode>
                </div>}
            </div>
        }>
            <div className={classes.listItem}>
                <div className={classes.listItemMainContent}>
                    <div className={classes.actionTitleContainer}>
                        <Typography variant="body1" gutterBottom>{pattern ? matchPattern(pattern.primary, action) : `${action.handler_account_name} - ${action.name}`}</Typography>
                        {!action.irreversible && <Tooltip title="pending"><PendingIcon className={classes.pendingIcon} /></Tooltip>}
                    </div>
                    {pattern && pattern.secondary && <Typography gutterBottom classes={{ root: classes.preview }} variant="body1" color="textSecondary" noWrap={false}>{matchPattern(pattern.secondary, action)}</Typography>}
                    {pattern && pattern.preview && <Typography gutterBottom classes={{ root: classes.preview }} variant="body1" color="textSecondary" noWrap={false}>{generatePreview(pattern.preview(action.data))}</Typography>}
                    <Typography variant="caption">{moment.utc(action.block_time).local().format('MMM D, YYYY h:mm A')}</Typography>
                </div>
                <div>
                    <Chip variant="outlined" label={action.name} />
                </div>
            </div>
        </ExpandableListItem>
    );
}

ActionListItem.propTypes = {
    classes: PropTypes.object,
    action: PropTypes.object
};

export default withStyles(style)(ActionListItem);
