import qs from 'qs';
import { withRouter } from 'react-router-dom';
import Networks from './Networks';
import PropTypes from 'prop-types';

function NetworkChangeListener({ history, location, network }) {
    const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (!queryParams.network && network.shortName !== Networks[0].shortName) {
        history.replace({ search: qs.stringify({ ...queryParams, network: network.shortName }) });
    }
    return null;
}

NetworkChangeListener.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    network: PropTypes.object
};

export default withRouter(NetworkChangeListener);