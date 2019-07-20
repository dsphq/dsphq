import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import numeral from 'numeral';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { grey } from '@material-ui/core/colors';
import PropTypes from 'prop-types';

const styles = () => ({
    root: { 
        height: 130, 
        width: 130, 
        position: 'relative' 
    },
    textContainer: { 
        position: 'absolute', 
        left: 0, 
        right: 0, 
        top: '50%', 
        transform: 'translateY(-50%)' 
    },
    text: { 
        fontSize: 12 
    }
});

function AccountBalanceChart({ classes, balance, theme }) {
    const values = [];
    if (balance.available > 0) {
        values.push(balance.available);
    }
    if (balance.staked > 0) {
        values.push(balance.staked);
    }
    if (balance.pendingRefund > 0) {
        values.push(balance.pendingRefund);
    }

    const spacing = balance.total * 0.02;
    const color = theme.palette.primary.main;

    const series = values.reduce((series, value) => {
        if (series.length === 1) {
            series.push({
                value: spacing,
                color: 'rgba(0,0,0,0)'
            });
        }
        series.push({
            value,
            color
        });
        if (series.length > 1) {
            series.push({
                value: spacing,
                color: 'rgba(0,0,0,0)'
            });
        }
        return series;
    }, []);

    const pieData = balance.total > 0 ? {
        datasets: [{
            data: series.map(data => data.value),
            backgroundColor: series.map(data => data.color),
            hoverBackgroundColor: series.map(data => data.color)
        }]
    } : {
        datasets: [{
            data: [100],
            backgroundColor: [grey[800]],
            hoverBackgroundColor: [grey[800]]
        }]
    };

    return (
        <div className={classes.root}>
            <Pie data={pieData} options={{
                maintainAspectRatio: false,
                responsive: true,
                cutoutPercentage: 90,
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                },
                animation: {
                    animateRotate: false
                },
                elements: {
                    arc: {
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0)'
                    },
                }
            }} />
            <div className={classes.textContainer}>
                <Typography className={classes.text} align="center" variant="body2" color="textSecondary" gutterBottom>
                    {numeral(balance.total).format('0,0.0000', Math.floor)}
                </Typography>
                <Typography align="center" variant="caption">DAPP Total</Typography>
            </div>
        </div>
    );
}

AccountBalanceChart.propTypes = {
    classes: PropTypes.object,
    balance: PropTypes.object,
    theme: PropTypes.object
};

export default withStyles(styles, { withTheme: true })(AccountBalanceChart);
