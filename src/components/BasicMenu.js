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
  const setProb = props.setProb

  const handleClick = (params, e) => {
    e.preventDefault()

    setDist(params)
    setProb(null)
  }

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
        <MenuItem onClick={(e) => handleClick('bern', e)}>
          <ListItemText>Bernoulli</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleClick('binom', e)}>
          <ListItemText>Binomial</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleClick('poiss', e)}>
          <ListItemText>Poisson</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={(e) => handleClick('unif', e)}>
          <ListItemText>Uniform</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleClick('norm', e)}>
          <ListItemText>Normal</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleClick('expon', e)}>
          <ListItemText>Exponential</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleClick('beta', e)}>
          <ListItemText>Beta</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default BasicMenu