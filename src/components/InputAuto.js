import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BarChartIcon from '@mui/icons-material/BarChart';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import BasicMenu from './BasicMenu';
import Linspace from './Linspace'
import Params from './Params';
import Stack from '@mui/material/Stack';


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

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        dist: dist
      }
    }))
  }, [setRandomCells, id, dist])

  const handleClickDists = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickSubmit = (e) => {
    e.preventDefault()
    const url = 'http://127.0.0.1:8000/prob';
    const data = { 
      dist: randomCell.dist, 
      start: Number(randomCell.valueStart), end: Number(randomCell.valueEnd), step: Number(randomCell.valueStep), 
      loc: Number(randomCell.valueLoc), scale: Number(randomCell.valueScale), 
      a: .5, b: .5, 
    }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url, data, config).then((response) => {
      setX(response.data.x)
      setProb(response.data.prob)
    });
  }

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
          <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="flex-start">
            <IconButton
              variant="outlined"
              onClick={handleClickDists}
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
            <IconButton
              variant="outlined"
              onClick={handleClickSubmit}
              disabled={
                connStatus !== 1 || randomCell.assigned
              }>
              <BarChartIcon />
            </IconButton>
          </Stack>
        </Grid>
        {dist === "unif" ?
          <Grid item xs={12}>
            <Linspace id={id} randomCell={randomCell} setRandomCells={setRandomCells} setX={setX} setProb={setProb} />
          </Grid> : null
        }
        {dist === "unif" ?
          <Grid item xs={12}>
            <Params id={id} randomCell={randomCell} setRandomCells={setRandomCells} setProb={setProb} />
          </Grid> : null
        }
      </Grid>
    </>
  );
}
