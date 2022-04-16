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
import BarChartIcon from '@mui/icons-material/BarChart';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Alert from '@mui/material/Alert';
import axios from 'axios';

export default function VariableCard(props) {
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

  const [linspace, setLinspace] = useState()
  const [prob, setProb] = useState()

  const [assigned, setAssigned] = useState(null)

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

  useEffect(() => {
    if (valuesNum.start && valuesNum.end && valuesNum.step && endGreaterStart && stepAboveZero) {
      setLinspace(calcLinspace(Number(values.start), Number(values.end), Number(values.step)))
    } else {
      setLinspace("")
    }
  }, [values, valuesNum, endGreaterStart, stepAboveZero])

  function calcLinspace(start, end, step) {
    const result = [];
    const scale = (end - start) / (step - 1);
    for (let i = 0; i < step; i++) {
      result.push(start + (scale * i));
    }
    console.log(result)
    return result;
  }

  const handleChange = (e) => {
    setValues(prevState => (
      { ...prevState, [e.target.name]: e.target.value }
    ))

    setValuesNum(prevState => ({ ...prevState, [e.target.name]: !isNaN(e.target.value) }))
  };

  const handleClickConnect = (e) => {
    axios.get("http://127.0.0.1:8000/get_selection").then((response) => {
      setAddress({ sheet: response.data.sheet, cell: response.data.range, currentVal: response.data.value })
    });
  }

  const handleClickProbability = (e) => {
    e.preventDefault()
    const url = 'http://127.0.0.1:8000/io_variable';
    const data = { start: Number(values.start), end: Number(values.end), step: Number(values.step), dist: 'unif' }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url, data, config).then((response) => {
      setLinspace(response.data.x)
      setProb(response.data.prob)
    });
  }

  const handleClickAssign = (e) => {
    e.preventDefault()
    if (!assigned) {
      const url = 'http://127.0.0.1:8000/assign_variable';
      const data = { sheet: address.sheet, cell: address.cell, x: linspace, prob: prob }
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      axios.post(url, data, config).then((response) => {
        setAssigned(true)

        props.setAssignedVars(prevState => ({ ...prevState, [props.id]: [address.sheet, address.cell].join('!') }))
      });
    } else {
      const url = 'http://127.0.0.1:8000/unassign_variable';
      const data = { sheet: address.sheet, cell: address.cell }
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      axios.post(url, data, config).then((response) => {
        setAssigned(false)
        setProb()

        props.setAssignedVars(prevState => ({ ...prevState, [props.id]: null }))
      });
    }
  }

  const testAlreadyAssigned = () => {
    const addressKey = [address.sheet, address.cell].join('!')
    return Object.values(props.assignedVars).includes(addressKey) && props.assignedVars[props.id] !== addressKey
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
            {address.currentVal === null ? "#Blank" : address.currentVal}
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
                  disabled={assigned}
                />
              </FormControl>
            )}
          </Stack>
          <Typography variant="caption">
            {linspace ? linspace.map(k => k.toFixed(2)).join(", ") : ""}
          </Typography>
        </CardContent></> : null}
      <CardActions>
        <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClickConnect} disabled={assigned}>
          Connect
        </Button>
        <Button variant="outlined" startIcon={<BarChartIcon />} onClick={handleClickProbability} disabled={assigned}>
          Probability
        </Button>
        {assigned ?
          <Button variant="outlined" startIcon={<LockIcon />} onClick={handleClickAssign} disabled={!prob}>
            Assigned
          </Button> : ""
        }
        {!assigned ?
          <Button variant="outlined" startIcon={<LockOpenIcon />} onClick={handleClickAssign} disabled={!prob || testAlreadyAssigned()}>
            Assign
          </Button> : ""
        }
      </CardActions>
      {testAlreadyAssigned() ?
        <Alert variant="outlined" severity="warning">
          Possible duplicate — check it out!
        </Alert> : ""
      }
    </Card>
  );
}
