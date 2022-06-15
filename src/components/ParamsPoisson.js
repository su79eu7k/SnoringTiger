import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';


export default function ParamsPoisson(props) {
  const id = props.id
  const randomCell = props.randomCell
  const setRandomCells = props.setRandomCells
  const setProb = props.setProb

  const [valueStart, setValueStart] = useState(randomCell.valueStart ? randomCell.valueStart : "")
  const [valueEnd, setValueEnd] = useState(randomCell.valueEnd ? randomCell.valueEnd : "")
  const [valueStep, setValueStep] = useState(randomCell.valueStep ? randomCell.valueStep : "")
  const [valueMu, setValueMu] = useState(randomCell.valueMu ? randomCell.valueMu : "")
  const [valueLoc, setValueLoc] = useState(randomCell.valueLoc ? randomCell.valueLoc : "")

  const [valueNumStart, setValueNumStart] = useState(randomCell.valueNumStart ? randomCell.valueNumStart : null)
  const [valueNumEnd, setValueNumEnd] = useState(randomCell.valueNumEnd ? randomCell.valueNumEnd : null)
  const [valueNumStep, setValueNumStep] = useState(randomCell.valueNumStep ? randomCell.valueNumStep : null)
  const [valueNumMu, setValueNumMu] = useState(randomCell.valueNumMu ? randomCell.valueNumMu : null)
  const [valueNumLoc, setValueNumLoc] = useState(randomCell.valueNumLoc ? randomCell.valueNumLoc : null)

  const [stepEgtTwo, setStepEgtTwo] = useState(randomCell.stepEgtTwo ? randomCell.stepEgtTwo : null)

  useEffect(() => {
    if (valueNumStep) {
      (Number.isInteger(Number(valueStep))) && (Number(valueStep) >= 2) ? setStepEgtTwo(true) : setStepEgtTwo(false)
    } else {
      setStepEgtTwo(null)
    }
  }, [valueStep, valueNumStep, setStepEgtTwo])

  useEffect(() => {
    const _valid = randomCell.valueNumStart && randomCell.valueNumEnd && randomCell.valueNumStep && randomCell.stepEgtTwo

    if (_valid) {
      setValueLoc("0")
    }
  }, [randomCell.valueNumStart, randomCell.valueNumEnd, randomCell.valueNumStep, randomCell.stepEgtTwo])

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        valueStart: valueStart, valueEnd: valueEnd, valueStep: valueStep, valueMu: valueMu, valueLoc: valueLoc,
        valueNumStart: valueNumStart, valueNumEnd: valueNumEnd, valueNumStep: valueNumStep, valueNumMu: valueNumMu, valueNumLoc: valueNumLoc,
        stepEgtTwo: stepEgtTwo,
      }
    }))
  }, [setRandomCells, id, valueStart, valueEnd, valueStep, valueMu, valueLoc, valueNumStart, valueNumEnd, valueNumStep, valueNumMu, valueNumLoc, stepEgtTwo])

  useEffect(() => {
    setValueNumLoc(!(isNaN(valueLoc) || valueLoc === ""))
    setValueNumMu(!(isNaN(valueMu) || valueMu === ""))
  }, [valueMu, valueLoc])

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

  const handleChangeMu = (e) => {
    e.preventDefault()
    setValueMu(e.target.value)
    setValueNumMu(!(isNaN(e.target.value) || e.target.value === ""))
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
                error={!valueNumMu}
                helperText={!valueNumMu ? "μ is not a number." : ""}
                size="small"
                id="outlined-helperText"
                label="μ"
                value={valueMu}
                onChange={handleChangeMu}
                disabled={randomCell.assigned}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
