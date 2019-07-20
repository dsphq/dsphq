import { createMuiTheme } from '@material-ui/core/styles';
import { blue, green } from '@material-ui/core/colors';

export default createMuiTheme({
    palette: {
        primary: {
            main: blue[600]
        },
        secondary: {
            main: green[600]
        },
        type: 'light'
    }
});