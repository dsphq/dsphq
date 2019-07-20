import { Button } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useContext, useState } from 'react';
import NetworkContext from '../chain/NetworkContext';
import Networks from '../chain/Networks';
import PropTypes from 'prop-types';

function NetworkMenu({ onNetworkChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const selectedNetwork = useContext(NetworkContext);

  const onMenuItemClick = (network) => {
    onNetworkChange(network.shortName);
    setAnchorEl(null);
  };

  const onCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        color="primary"
        variant="outlined"
        size="small"
        onClick={e => setAnchorEl(e.currentTarget)}>
        {selectedNetwork.name}
      </Button>
      <Menu
        id="network-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onCloseMenu}
      >
        {Networks.map(network => <MenuItem
          selected={network.shortName === selectedNetwork.shortName}
          key={network.shortName}
          onClick={() => onMenuItemClick(network)}>
          {network.name}
        </MenuItem>
        )}
      </Menu>
    </div>
  );
}

NetworkMenu.propTypes = {
  onNetworkChange: PropTypes.func.isRequired
};

export default NetworkMenu;