import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function BasicCard() {
  const [values, setValues] = useState({
    sheet: "Sheet1",
    cell: "A35",
    start: "",
    end: "",
    step: "",
  })

  const [valuesAreNum, setValuesAreNum] = useState({
    start: null,
    end: null,
    step: null,
  })

  const [endGreaterStart, setEndGreaterStart] = useState()
  const [stepAboveZero, setStepAboveZero] = useState()

  useEffect(() => {
      if (isNaN(values.start)) {
        setValuesAreNum((prevState) => {
          return { ...prevState, ['start']: false }
        })
      } else {
        setValuesAreNum((prevState) => {
          return { ...prevState, ['start']: true }
        })
      }
  }, [values.start])

  useEffect(() => {
      if (isNaN(values.end)) {
        setValuesAreNum((prevState) => {
          return { ...prevState, ['end']: false }
        })
      } else {
        setValuesAreNum((prevState) => {
          return { ...prevState, ['end']: true }
        })
      }
  }, [values.end])

  useEffect(() => {
      if (isNaN(values.step)) {
        setValuesAreNum((prevState) => {
          return { ...prevState, ['step']: false }
        })
      } else {
        setValuesAreNum((prevState) => {
          return { ...prevState, ['step']: true }
        })
      }
  }, [values.step])

  useEffect(() => {
    if (valuesAreNum.start && valuesAreNum.end) {
      Number(values.end) > Number(values.start) ? setEndGreaterStart(true) : setEndGreaterStart(false)
    } else {
      setEndGreaterStart(null)
    }
  }, [values.start, values.end, valuesAreNum.start, valuesAreNum.end])

  useEffect(() => {
    if (valuesAreNum.step) {
      Number(values.step) > 0 ? setStepAboveZero(true) : setStepAboveZero(false)
    } else {
      setStepAboveZero(null)
    }
  }, [values.step, valuesAreNum.step])

  const handleChange = (e) => {
    setValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          {values.sheet}
        </Typography>
        <Typography variant="h5" component="div">
          {values.cell}
        </Typography>
        <Stack spacing={2} direction="row">
          <FormControl size='small'>
            <InputLabel htmlFor="component-outlined">Start</InputLabel>
            <OutlinedInput
              id="component-outlined-start"
              label="Start"
              name="start"
              value={values.start}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl size='small'>
            <InputLabel htmlFor="component-outlined">End</InputLabel>
            <OutlinedInput
              id="component-outlined-end"
              label="End"
              name="end"
              value={values.end}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl size='small'>
            <InputLabel htmlFor="component-outlined">Step</InputLabel>
            <OutlinedInput
              id="component-outlined-step"
              label="Step"
              name="step"
              value={values.step}
              onChange={handleChange}
            />
          </FormControl>
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small">Advanced</Button>
      </CardActions>
    </Card>
  );
}
