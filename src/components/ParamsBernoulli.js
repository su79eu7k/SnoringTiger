import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';


export default function ParamsBernoulli(props) {
  const id = props.id
  const randomCell = props.randomCell
  const setRandomCells = props.setRandomCells
  const setProb = props.setProb

  const [valueStart, setValueStart] = useState(randomCell.valueStart ? randomCell.valueStart : "")
  const [valueEnd, setValueEnd] = useState(randomCell.valueEnd ? randomCell.valueEnd : "")
  const [valueP, setValueP] = useState(randomCell.valueP ? randomCell.valueP : "")
  const [valueLoc, setValueLoc] = useState(randomCell.valueLoc ? randomCell.valueLoc : "")

  const [valueNumStart, setValueNumStart] = useState(randomCell.valueNumStart ? randomCell.valueNumStart : null)
  const [valueNumEnd, setValueNumEnd] = useState(randomCell.valueNumEnd ? randomCell.valueNumEnd : null)
  const [valueNumP, setValueNumP] = useState(randomCell.valueNumP ? randomCell.valueNumP : null)
  const [valueNumLoc, setValueNumLoc] = useState(randomCell.valueNumLoc ? randomCell.valueNumLoc : null)

  const [valueBtwZeroOneP, setValueBtwZeroOneP] = useState(randomCell.valueBtwZeroOneP ? randomCell.valueBtwZeroOneP : null)

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        valueStart: valueStart, valueEnd: valueEnd, valueP: valueP, valueLoc: valueLoc,
        valueNumStart: valueNumStart, valueNumEnd: valueNumEnd, valueNumP: valueNumP, valueNumLoc: valueNumLoc,
      }
    }))
  }, [setRandomCells, id, valueStart, valueEnd, valueP, valueLoc, valueNumStart, valueNumEnd, valueNumP, valueNumLoc])

  useEffect(() => {
    const _valid = randomCell.valueNumStart && randomCell.valueNumEnd

    if (_valid) {
        setValueLoc("0")
        setValueP("0.5")
    }
  }, [randomCell.valueNumStart, randomCell.valueNumEnd])

  useEffect(() => {
    setValueNumLoc(!(isNaN(valueLoc) || valueLoc === ""))
    setValueNumP(!(isNaN(valueP) || valueP === ""))
    setValueBtwZeroOneP(valueP >= 0 && valueP <= 1)
  }, [valueP, valueLoc])

  const handleChangeStart = (e) => {
    e.preventDefault()
    setValueStart(e.target.value)
    setValueNumStart(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeEnd = (e) => {
    e.preventDefault()
    setValueEnd(e.target.value)
    setValueNumEnd(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeScale = (e) => {
    e.preventDefault()
    setValueP(e.target.value)
    setValueNumP(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeLoc = (e) => {
    e.preventDefault()
    setValueLoc(e.target.value)
    setValueNumLoc(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="flex-start">
              <TextField
                error={!valueNumStart}
                helperText={!valueNumStart ? "Start value is not a number." : ""}
                size="small"
                id="outlined-helperText"
                label="Start"
                value={valueStart}
                onChange={handleChangeStart}
                disabled={randomCell.assigned}
              />
              <TextField
                error={!valueNumEnd}
                helperText={!valueNumEnd ? "End value is not a number." : ""}
                size="small"
                id="outlined-helperText"
                label="End"
                value={valueEnd}
                onChange={handleChangeEnd}
                disabled={randomCell.assigned}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="flex-start">
              <TextField
                error={!valueNumLoc}
                helperText={!valueNumLoc ? "Loc is not a number." : ""}
                size="small"
                id="outlined-helperText"
                label="Loc(0)"
                value={valueLoc}
                onChange={handleChangeLoc}
                disabled={randomCell.assigned}
              />
              <TextField
                error={!valueNumP || !valueBtwZeroOneP}
                helperText={!valueNumP ? "P is not a number." : !valueBtwZeroOneP ? "P must be between 0 and 1." : ""}
                size="small"
                id="outlined-helperText"
                label="P"
                value={valueP}
                onChange={handleChangeScale}
                disabled={randomCell.assigned}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
