import React from 'react';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import "react-placeholder/lib/reactPlaceholder.css";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import PropTypes from 'prop-types';

const styles = theme => ({
    listItem: {
        backgroundColor: darken(theme.palette.background.default, 0.2)
    }
});

function ListPlaceholder({ classes, rows, rowHeight, children, ready }) {
    return <ReactPlaceholder ready={ready} showLoadingAnimation customPlaceholder={
        (
            <List dense disablePadding>
                {
                    Array.from({ length: rows || 10 }).map((item, index) => (
                        <ListItem key={index} dense>
                            <TextRow className={classes.listItem} style={{ height: rowHeight || 72 }} color={''} />
                        </ListItem>
                    ))
                }
            </List>
        )
    }>
        {children}
    </ReactPlaceholder>
}

ListPlaceholder.propTypes = {
    classes: PropTypes.object,
    rows: PropTypes.array, 
    rowHeight: PropTypes.number, 
    children: PropTypes.node, 
    ready: PropTypes.bool
};

export default withStyles(styles)(ListPlaceholder);