import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    expansionPanelSummary: {
        alignItems: 'center',
        margin: 0,
        minWidth: 0,
        '&>:last-child': {
            paddingRight: 16
        }
    },
    expansionPanelRoot: {
        backgroundColor: 'inherit',
        boxShadow: 'none',
        '&:first-child': {
            borderRadius: 0
        }
    },
    expansionPanelExpanded: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 0 4px 1px rgba(0, 0, 0, 0.01), 0 3px 24px rgba(0, 0, 0, 0.6)',
        '&:first-child': {
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4
        }
    },
    expansionPanelSummaryRoot: {
        padding: 0
    },
    listItem: { 
        padding: '16px 16px' 
    },
    listItemButton: {
        '&:hover': {
            textDecoration: 'none',
            backgroundColor: darken(theme.palette.background.default, 0.05)
        }
    },
    details: { 
        width: '100%' 
    }
});

function ExpandableListItem({ classes, children, details, onExpanded }) {
    const [expanded, setExpanded] = useState(false);

    const onChange = (event, expanded) => {
        setExpanded(expanded);
        if (onExpanded) {
            onExpanded();
        }
    };

    return (
        <ExpansionPanel
            onChange={onChange}
            classes={{ root: classes.expansionPanelRoot, expanded: classes.expansionPanelExpanded }}
        >
            <ExpansionPanelSummary
                classes={{
                    content: classes.expansionPanelSummary,
                    root: classes.expansionPanelSummaryRoot
                }}
            >
                <ListItem divider={expanded} button={!expanded} className={classes.listItem} classes={{ button: classes.listItemButton }}>
                    {children}
                </ListItem>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                {expanded && <div className={classes.details}>{details}</div>}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

ExpandableListItem.propTypes = {
    classes: PropTypes.object,
    children: PropTypes.node, 
    details: PropTypes.node, 
    onExpanded: PropTypes.func
};

export default withStyles(styles)(ExpandableListItem);
