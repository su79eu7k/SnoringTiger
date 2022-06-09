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

  const [labelLoc, setLabelLoc] = useState(randomCell.labelLoc ? randomCell.labelLoc : "Loc")
  const [labelScale, setLabelScale] = useState(randomCell.labelScale ? randomCell.labelScale : "Scale")

  const [valueLoc, setValueLoc] = useState(randomCell.valueLoc ? randomCell.valueLoc : "")
  const [valueScale, setValueScale] = useState(randomCell.valueScale ? randomCell.valueScale : "")

  const [valueNumLoc, setValueNumLoc] = useState(randomCell.valueNumLoc ? randomCell.valueNumLoc : null)
  const [valueNumScale, setValueNumScale] = useState(randomCell.valueNumScale ? randomCell.valueNumScale : null)

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        labelLoc: labelLoc, labelScale: labelScale,
        valueLoc: valueLoc, valueScale: valueScale,
        valueNumLoc: valueNumLoc, valueNumScale: valueNumScale,
      }
    }))
  }, [setRandomCells, id, valueLoc, valueScale, valueNumLoc, valueNumScale])

  useEffect(() => {
    if (randomCell.dist === "unif") {
      setLabelLoc("Loc")
      setLabelScale("Scale")

      setValueLoc(randomCell.valueNumStart ? randomCell.valueStart : "")
      setValueScale((randomCell.valueNumStart && randomCell.valueNumEnd) ? randomCell.valueEnd - randomCell.valueStart : "")
    } else if (randomCell.dist === "norm") {
      setLabelLoc("Loc(μ)")
      setLabelScale("Scale(σ)")
      
      const _n = randomCell.x.length
      const _mean = randomCell.x.reduce((a, b) => a + b) / _n
      const _stdv = Math.sqrt(randomCell.x.map(x => Math.pow(x - _mean, 2)).reduce((a, b) => a + b) / _n)

      setValueLoc((randomCell.valueNumStart && randomCell.valueNumEnd && randomCell.valueNumStep) ? _mean : "")
      setValueScale((randomCell.valueNumStart && randomCell.valueNumEnd && randomCell.valueNumStep) ? _stdv : "")
    } else if (randomCell.dist === "expon") {
      setLabelLoc("Loc")
      setLabelScale("Scale(1 / λ)")
      
      setValueLoc(randomCell.valueNumStart ? randomCell.valueStart : "")
      setValueScale((randomCell.valueNumStart && randomCell.valueNumEnd) ? "1" + (randomCell.valueEnd - randomCell.valueStart).toString().substring(1).replace(/[0-9]/g, "0") : "")
    }
  }, [randomCell.dist, randomCell.valueStart, randomCell.valueEnd, randomCell.valueStep, randomCell.valueNumStart, randomCell.valueNumEnd])
  
  useEffect(() => {
      setValueNumLoc(!(isNaN(valueLoc) || valueLoc === ""))
      setValueNumScale(!(isNaN(valueScale) || valueScale === ""))
  }, [valueLoc, valueScale])

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
              helperText={!valueNumLoc ? labelLoc + " is not a number." : ""}
              size="small"
              id="outlined-helperText"
              label={labelLoc}
              value={valueLoc}
              onChange={handleChangeLoc}
              disabled={randomCell.assigned}
            />
            <TextField
              error={!valueNumScale}
              helperText={!valueNumScale ? labelScale + " is not a number." : ""}
              size="small"
              id="outlined-helperText"
              label={labelScale}
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
