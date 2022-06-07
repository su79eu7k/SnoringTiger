import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import BasicMenu from './BasicMenu';
import Linspace from './Linspace'


export default function InputAuto(props) {
  const connStatus = props.connStatus
  const id = props.id
  const randomCell = props.randomCells[id]
  const setRandomCells = props.setRandomCells
  const setX = props.setX
  const setProb = props.setProb

  const [dist, setDist] = useState(randomCell.dist ? randomCell.dist : "unif")

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Random Variables
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            {dist}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <IconButton
            variant="outlined"
            onClick={handleClick}
            disabled={
              connStatus !== 1 || randomCell.assigned
            }>
            <BarChartIcon />
          </IconButton>
          <BasicMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            setDist={setDist}
          />
        </Grid>
        {dist === "unif" ?
          <Grid item xs={12}>
            <Linspace id={id} randomCell={randomCell} setRandomCells={setRandomCells} setX={setX} setProb={setProb} />
          </Grid> : null
        }
      </Grid>
    </>
  );
}
