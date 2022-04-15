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
import CableIcon from '@mui/icons-material/Cable';
import axios from 'axios';

export default function BasicCard() {
  const [address, setAddress] = useState({
    sheet: null,
    cell: null,
    currentVal: null,
  })

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
    setValues(prevState => (
      { ...prevState, [e.target.name]: e.target.value }
    ))

    setValuesNum(prevState => ({ ...prevState, [e.target.name]: !isNaN(e.target.value) }))
  };

  const handleClick = (e) => {
    axios.get("http://127.0.0.1:8000/get_selection").then((response) => {
      setAddress({ sheet: response.data.sheet, cell: response.data.range, currentVal: response.data.value })
    });
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      {address.cell ? <>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">
            Sheet
          </Typography>
          <Typography variant="caption">
            {address.sheet}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Cell
          </Typography>
          <Typography variant="h6">
            {address.cell}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Current value
          </Typography>
          <Typography variant="caption">
            {address.currentVal}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Random variable range
          </Typography>
          <Stack spacing={2} direction="row">
            {Object.keys(values).map((k, i) =>
              <FormControl key={i} size='small'>
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
          </Stack>
        </CardContent></> : null}
      <CardActions>
        <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClick}>
          Connect Cell
        </Button>
      </CardActions>
    </Card>
  );
}
