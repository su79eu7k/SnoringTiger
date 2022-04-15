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
    start: "",
    end: "",
    step: "",
  })

  const [valuesNum, setValuesNum] = useState({
    start: null,
    end: null,
    step: null,
  })

  const [endGreaterStart, setEndGreaterStart] = useState()
  const [stepAboveZero, setStepAboveZero] = useState()

  useEffect(() => {
    if (valuesNum.start && valuesNum.end) {
      Number(values.end) > Number(values.start) ? setEndGreaterStart(true) : setEndGreaterStart(false)
    } else {
      setEndGreaterStart(null)
    }
  }, [values.start, values.end, valuesNum.start, valuesNum.end])

  useEffect(() => {
    if (valuesNum.step) {
      Number(values.step) > 0 ? setStepAboveZero(true) : setStepAboveZero(false)
    } else {
      setStepAboveZero(null)
    }
  }, [values.step, valuesNum.step])

  const handleChange = (e) => {
    setValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })

    if (isNaN(e.target.value)) {
      setValuesNum((prevState) => {
        return { ...prevState, [e.target.name]: false }
      })
    } else {
      setValuesNum((prevState) => {
        return { ...prevState, [e.target.name]: true }
      })
    }
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          Sheet1
        </Typography>
        <Typography variant="h5" component="div">
          A35
        </Typography>
        <Stack spacing={2} direction="row">
          {Object.keys(values).map((k) =>
            <FormControl size='small'>
              <InputLabel htmlFor="component-outlined">{k.toUpperCase()}</InputLabel>
              <OutlinedInput
                id={"component-outlined-" + k}
                label={k.toUpperCase()}
                name={k}
                value={values[k]}
                onChange={handleChange}
              />
            </FormControl>
          )}
          {/* <FormControl size='small'>
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
          </FormControl> */}
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small">Advanced</Button>
      </CardActions>
    </Card>
  );
}
