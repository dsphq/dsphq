import { lightBlue } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        background: {
            default: '#1b1b1d',
            paper: '#262628'
        },
        primary: {
            main: lightBlue['A200']
        },
        secondary: {
            main: '#4ed8a0'
        },
        type: 'dark'
    }
});