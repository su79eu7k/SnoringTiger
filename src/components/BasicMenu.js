import React from 'react'
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


function BasicMenu(props) {
  const anchorEl = props.anchorEl
  const open = props.open
  const onClose = props.onClose
  const setDist = props.setDist

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuList dense>
        <MenuItem onClick={(e) => setDist('bern')}>
          <ListItemText>Bernoulli</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => setDist('binom')}>
          <ListItemText>Binomial</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => setDist('poiss')}>
          <ListItemText>Poisson</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={(e) => setDist('unif')}>
          <ListItemText>Uniform</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => setDist('norm')}>
          <ListItemText>Normal</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => setDist('expon')}>
          <ListItemText>Exponential</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => setDist('beta')}>
          <ListItemText>Beta</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default BasicMenu