import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';


export default function ParamsBinom(props) {
  const id = props.id
  const randomCell = props.randomCell
  const setRandomCells = props.setRandomCells
  const setProb = props.setProb

  const [valueStart, setValueStart] = useState(randomCell.valueStart ? randomCell.valueStart : "")
  const [valueEnd, setValueEnd] = useState(randomCell.valueEnd ? randomCell.valueEnd : "")
  const [valueStep, setValueStep] = useState(randomCell.valueStep ? randomCell.valueStep : "")
  const [valueP, setValueP] = useState(randomCell.valueP ? randomCell.valueP : "")

  const [valueNumStart, setValueNumStart] = useState(randomCell.valueNumStart ? randomCell.valueNumStart : null)
  const [valueNumEnd, setValueNumEnd] = useState(randomCell.valueNumEnd ? randomCell.valueNumEnd : null)
  const [valueNumStep, setValueNumStep] = useState(randomCell.valueNumStep ? randomCell.valueNumStep : null)
  const [valueNumP, setValueNumP] = useState(randomCell.valueNumP ? randomCell.valueNumP : null)

  const [stepEgtTwo, setStepEgtTwo] = useState(randomCell.stepEgtTwo ? randomCell.stepEgtTwo : null)
  const [valueBtwZeroOneP, setValueBtwZeroOneP] = useState(randomCell.valueBtwZeroOneP ? randomCell.valueBtwZeroOneP : null)

  useEffect(() => {
    if (valueNumStep) {
      (Number.isInteger(Number(valueStep))) && (Number(valueStep) >= 2) ? setStepEgtTwo(true) : setStepEgtTwo(false)
    } else {
      setStepEgtTwo(null)
    }
  }, [valueStep, valueNumStep, setStepEgtTwo])

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        valueStart: valueStart, valueEnd: valueEnd, valueStep: valueStep, valueP: valueP,
        valueNumStart: valueNumStart, valueNumEnd: valueNumEnd, valueNumStep: valueNumStep, valueNumP: valueNumP,
        stepEgtTwo: stepEgtTwo,
      }
    }))
  }, [setRandomCells, id, valueStart, valueEnd, valueStep, valueP, valueNumStart, valueNumEnd, valueNumStep, valueNumP, stepEgtTwo])

  useEffect(() => {
    setValueNumP(!(isNaN(valueP) || valueP === ""))
    setValueBtwZeroOneP(valueP >= 0 && valueP <= 1)
  }, [valueP])

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

  const handleChangeStep = (e) => {
    e.preventDefault()
    setValueStep(e.target.value)
    setValueNumStep(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeP = (e) => {
    e.preventDefault()
    setValueP(e.target.value)
    setValueNumP(!(isNaN(e.target.value) || e.target.value === ""))
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
              <TextField
                error={!valueNumStep || !stepEgtTwo}
                helperText={!valueNumStep ? "Step value is not an integer." : !stepEgtTwo ? "Step value is not 2 or more integer." : ""}
                size="small"
                id="outlined-helperText"
                label="Step"
                value={valueStep}
                onChange={handleChangeStep}
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
                error={!valueNumP || !valueBtwZeroOneP}
                helperText={!valueNumP ? "Probability is not a number." : !valueBtwZeroOneP ? "P must be between 0 and 1." : ""}
                size="small"
                id="outlined-helperText"
                label="P"
                value={valueP}
                onChange={handleChangeP}
                disabled={randomCell.assigned}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
