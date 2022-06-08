import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';


export default function Params(props) {
  const id = props.id
  const randomCell = props.randomCell
  const setRandomCells = props.setRandomCells
  const setProb = props.setProb

  const [valueLoc, setValueLoc] = useState(randomCell.valueLoc ? randomCell.valueLoc : "")
  const [valueScale, setValueScale] = useState(randomCell.valueScale ? randomCell.valueScale : "")

  const [valueNumLoc, setValueNumLoc] = useState(randomCell.valueNumLoc ? randomCell.valueNumLoc : null)
  const [valueNumScale, setValueNumScale] = useState(randomCell.valueNumScale ? randomCell.valueNumScale : null)

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        valueLoc: valueLoc, valueScale: valueScale,
        valueNumLoc: valueNumLoc, valueNumScale: valueNumScale,
      }
    }))
  }, [setRandomCells, id, valueLoc, valueScale, valueNumLoc, valueNumScale])

  const handleChangeLoc = (e) => {
    e.preventDefault()
    setValueLoc(e.target.value)
    setValueNumLoc(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeScale = (e) => {
    e.preventDefault()
    setValueScale(e.target.value)
    setValueNumScale(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="flex-start">
            <TextField
              error={!valueNumLoc}
              helperText={!valueNumLoc ? "Loc is not a number." : ""}
              size="small"
              id="outlined-helperText"
              label="Loc"
              value={valueLoc}
              onChange={handleChangeLoc}
              disabled={randomCell.assigned}
            />
            <TextField
              error={!valueNumScale}
              helperText={!valueNumScale ? "Scale is not a number." : ""}
              size="small"
              id="outlined-helperText"
              label="Scale"
              value={valueScale}
              onChange={handleChangeScale}
              disabled={randomCell.assigned}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
