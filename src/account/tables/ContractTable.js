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

const styles = () => ({
    noResultsText: {
        margin: '64px 0'
    },
    valueColumn: {
        display: 'block',
        whiteSpace: 'pre',
        margin: '1em 0px'
    },
    assetValue: { 
        whiteSpace: 'nowrap' 
    },
    outerTable: { 
        tableLayout: 'fixed', 
        width: '100%', 
        fontSize: 14 
    },
    outerTableCell: { 
        overflow: 'auto', 
        paddingBottom: 24 
    }
});

function ContractTable({ classes, fields, rows }) {
    const formatValue = (val, type) => {
        if (typeof (val) === 'object') {
            return < div className={classes.valueColumn} >
                {YAML.stringify(val)
                    .replace('---\n', '')
                    .replace('---', '')}
            </div >;
        } else if (type === 'asset') {
            return <span className={classes.assetValue}>{val}</span>;
        } else {
            return val;
        }
    };

    return (
        <div>
            {rows && rows.length > 0 && <div>
                <table className={classes.outerTable}>
                    <tbody>
                        <tr>
                            <td className={classes.outerTableCell}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {fields.map(field => <TableCell key={field.name}>{field.name}</TableCell>)}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    {fields.map(field => <TableCell key={field.name}>
                                                        {formatValue(row[field.name], field.type)}
                                                    </TableCell>)}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>}
            {rows && rows.length === 0 && <Typography align="center" variant="subheading" color="textSecondary" classes={{ root: classes.noResultsText }}>No results for the selected filters</Typography>}
        </div>
    );
}

ContractTable.propTypes = {
    classes: PropTypes.object,
    fields: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired
};

export default withStyles(styles)(ContractTable);
