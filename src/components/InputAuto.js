import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
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
    setProb(null)
  }, [setRandomCells, id, dist, setProb])

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
      start: Number(randomCell.valueStart), end: Number(randomCell.valueEnd), step: Number(randomCell.valueStep) + 1,
      loc: Number(randomCell.valueLoc), scale: Number(randomCell.valueScale),
      a: Number(randomCell.valueA), b: Number(randomCell.valueB),
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
          <Typography noWrap variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
            Random Sampling (Distribution)
          </Typography>
          <Typography noWrap variant="subtitle2" sx={{ padding: '3px 4px' }}>
            {dist === "unif" ? "Uniform" : dist === "norm" ? "Normal" : dist === "expon" ? "Exponential" : dist === "beta" ? "Beta" : ""}
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
              <AutoStoriesIcon />
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
              <AutoFixHighIcon />
            </IconButton>
          </Stack>
        </Grid>
        {
          ["unif", "norm", "expon", "beta"].includes(dist) ?
            <>
              <Grid item xs={12}>
                <Linspace id={id} randomCell={randomCell} setRandomCells={setRandomCells} setProb={setProb} />
              </Grid>
              <Grid item xs={12}>
                <Params id={id} randomCell={randomCell} setRandomCells={setRandomCells} setProb={setProb} />
              </Grid>
            </> : null
        }
      </Grid>
    </>
  );
}
