import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import Grid from '@mui/material/Grid';


export default function InputAuto(props) {
  const id = props.id
  const randomCell = props.randomCells[id]
  const setRandomCells = props.setRandomCells
  const setX = props.setX
  const setProb = props.setProb

  const [valueStart, setValueStart] = useState(randomCell.valueStart ? randomCell.valueStart : "")
  const [valueEnd, setValueEnd] = useState(randomCell.valueEnd ? randomCell.valueEnd : "")
  const [valueStep, setValueStep] = useState(randomCell.valueStep ? randomCell.valueStep : "")

  const [valueNumStart, setValueNumStart] = useState(randomCell.valueNumStart ? randomCell.valueNumStart : null)
  const [valueNumEnd, setValueNumEnd] = useState(randomCell.valueNumEnd ? randomCell.valueNumEnd : null)
  const [valueNumStep, setValueNumStep] = useState(randomCell.valueNumStep ? randomCell.valueNumStep : null)

  const [endGtStart, setEndGtStart] = useState(randomCell.endGtStart ? randomCell.endGtStart : null)
  const [stepEgtTwo, setStepEgtTwo] = useState(randomCell.stepEgtTwo ? randomCell.stepEgtTwo : null)

  useEffect(() => {
    if (valueNumStart && valueNumEnd) {
      Number(valueEnd) > Number(valueStart) ? setEndGtStart(true) : setEndGtStart(false)
    } else {
      setEndGtStart(null)
    }
  }, [valueStart, valueEnd, valueNumStart, valueNumEnd])

  useEffect(() => {
    if (valueNumStep) {
      (Number.isInteger(Number(valueStep))) && (Number(valueStep) >= 2) ? setStepEgtTwo(true) : setStepEgtTwo(false)
    } else {
      setStepEgtTwo(null)
    }
  }, [valueStep, valueNumStep, setStepEgtTwo])

  useEffect(() => {
    if (valueNumStart && valueNumEnd && valueNumStep && endGtStart && stepEgtTwo) {
      setX(calcLinspace(Number(valueStart), Number(valueEnd), Number(valueStep)))
    } else {
      setX("")
    }
  }, [setX, valueStart, valueEnd, valueStep, valueNumStart, valueNumEnd, valueNumStep, endGtStart, stepEgtTwo])

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        valueStart: valueStart, valueEnd: valueEnd, valueStep: valueStep,
        valueNumStart: valueNumStart, valueNumEnd: valueNumEnd, valueNumStep: valueNumStep,
        endGtStart: endGtStart, stepEgtTwo: stepEgtTwo
      }
    }))
  }, [setRandomCells, id, valueStart, valueEnd, valueStep, valueNumStart, valueNumEnd, valueNumStep, endGtStart, stepEgtTwo])

  function calcLinspace(start, end, step) {
    const result = [];
    const scale = (end - start) / (step - 1);
    for (let i = 0; i < step; i++) {
      result.push(start + (scale * i));
    }
    return result;
  }

  const handleChangeStart = (e) => {
    setValueStart(e.target.value)
    setValueNumStart(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeEnd = (e) => {
    setValueEnd(e.target.value)
    setValueNumEnd(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeStep = (e) => {
    setValueStep(e.target.value)
    setValueNumStep(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleClickProb = (e) => {
    e.preventDefault()
    const url = 'http://127.0.0.1:8000/prob';
    const data = { start: Number(valueStart), end: Number(valueEnd), step: Number(valueStep), dist: 'expon' }
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
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Random Variables
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="flex-end" justifyContent="flex-end">
            <IconButton variant="outlined" onClick={handleClickProb} disabled={props.conn !== 1 || randomCell.assigned}>
              <BarChartIcon />
            </IconButton>
            <IconButton variant="outlined" disabled={props.conn !== 1 || randomCell.assigned}>
              <ArrowLeftIcon />
            </IconButton>
            <IconButton variant="outlined" disabled={props.conn !== 1 || randomCell.assigned}>
              <ArrowRightIcon />
            </IconButton>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <TextField
              error={!valueNumStart || endGtStart === false}
              helperText={!valueNumStart ? "Start value is not a number." : endGtStart === false ? "Start value is greater than End." : ""}
              size="small"
              id="outlined-helperText"
              label="Start"
              value={valueStart}
              onChange={handleChangeStart}
              disabled={randomCell.assigned}
            />
            <TextField
              error={!valueNumEnd || endGtStart === false}
              helperText={!valueNumEnd ? "End value is not a number." : endGtStart === false ? "Start value is greater than End." : ""}
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
    </>
  );
}
