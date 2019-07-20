import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import YAML from 'json2yaml';
import React from 'react';
import PropTypes from 'prop-types';

const style = (theme) => ({
    root: {
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    detailsPanel: {
        padding: 24,
        marginBottom: 24,
        [theme.breakpoints.up('md')]: {
            marginBottom: 0,
            marginRight: 24,
            minWidth: 300
        }
    },
    fieldsPanel: {
        padding: 24,
        [theme.breakpoints.up('md')]: {
            minWidth: 300
        }
    },
    tableDetailsBody: { 
        paddingTop: 16 
    }
});

const formatJsonValue = (val) => {
    return YAML.stringify(val)
        .replace('---\n', '')
        .replace('---', '')
};

function TableSchema({ classes, table, abi }) {
    const tableDef = abi.tables.find(({ name }) => name === table);
    const struct = abi.structs.find(struct => struct.name === tableDef.type);

    return (
        <div className={classes.root}>
            <div>
                <Paper className={classes.detailsPanel}>
                    <Typography variant="subheading">Table Details</Typography>
                    <div className={classes.tableDetailsBody}>
                        <Typography variant="body1" color="textSecondary">Name</Typography>
                        <Typography variant="subheading" gutterBottom>{tableDef.name}</Typography>
                        <Typography variant="body1" color="textSecondary">Index Type</Typography>
                        <Typography variant="subheading" gutterBottom>{tableDef.index_type}</Typography>
                        <Typography variant="body1" color="textSecondary">Type</Typography>
                        <Typography variant="subheading" gutterBottom>{tableDef.type}</Typography>
                        <Typography variant="body1" color="textSecondary">Key Names</Typography>
                        <Typography variant="subheading" gutterBottom>{tableDef.key_names.length ? formatJsonValue(tableDef.key_names) : 'None'}</Typography>
                        <Typography variant="body1" color="textSecondary">Key Types</Typography>
                        <Typography variant="subheading" gutterBottom>{tableDef.key_types.length ? formatJsonValue(tableDef.key_types) : 'None'}</Typography>
                    </div>
                </Paper>
            </div>
            <div>
                <Paper className={classes.fieldsPanel}>
                    <Typography variant="subheading">Table Fields</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {struct.fields.map(field => {
                                return (
                                    <TableRow key={field.name}>
                                        <TableCell >
                                            {field.name}
                                        </TableCell>
                                        <TableCell >
                                            {field.type}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        </div>
    );
}

TableSchema.propTypes = {
    classes: PropTypes.object,
    table: PropTypes.string, 
    abi: PropTypes.object 
};

export default withStyles(style)(TableSchema);
