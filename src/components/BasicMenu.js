import React from 'react'
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Menu  from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


function BasicMenu(props) {
    const anchorEl = props.anchorEl
    const open = props.open
    const onClose = props.onClose
    const handleClickProb = props.handleClickProb

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
      <MenuItem onClick={(e) => handleClickProb('unif', e)}>
        <ListItemText>Uniform</ListItemText>
      </MenuItem>
      <MenuItem onClick={(e) => handleClickProb('norm', e)}>
        <ListItemText>Normal</ListItemText>
      </MenuItem>
      <MenuItem onClick={(e) => handleClickProb('expon', e)}>
        <ListItemText>Exponential</ListItemText>
      </MenuItem>
      <MenuItem onClick={(e) => handleClickProb('beta', e)}>
        <ListItemText>Beta</ListItemText>
      </MenuItem>
    </MenuList>
  </Menu>
  )
}

export default BasicMenu