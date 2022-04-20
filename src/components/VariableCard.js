import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CableIcon from '@mui/icons-material/Cable';
import BarChartIcon from '@mui/icons-material/BarChart';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import _ from 'lodash'

export default function VariableCard(props) {
  const variable = props.variables[props.id]

  const [addressSheet, setAddressSheet] = useState(variable ? variable.addressSheet : null)
  const [addressCell, setAddressCell] = useState(variable ? variable.addressCell : null)

  const [valueStart, setValueStart] = useState(variable ? variable.valueStart : "")
  const [valueEnd, setValueEnd] = useState(variable ? variable.valueEnd : "")
  const [valueStep, setValueStep] = useState(variable ? variable.valueStep : "")

  const [valueNumStart, setValueNumStart] = useState(variable ? variable.valueNumStart : null)
  const [valueNumEnd, setValueNumEnd] = useState(variable ? variable.valueNumEnd : null)
  const [valueNumStep, setValueNumStep] = useState(variable ? variable.valueNumStep : null)

  const [endGreaterStart, setEndGreaterStart] = useState(variable ? variable.endGreaterStart : null)
  const [stepAboveZero, setStepAboveZero] = useState(variable ? variable.stepAboveZero : null)

  const [x, setX] = useState(variable ? variable.x : null)
  const [prob, setProb] = useState(variable ? variable.prob : null)

  const [assigned, setAssigned] = useState(variable ? variable.assigned : false)

  useEffect(() => {
    if (valueNumStart && valueNumEnd) {
      Number(valueEnd) > Number(valueStart) ? setEndGreaterStart(true) : setEndGreaterStart(false)
    } else {
      setEndGreaterStart(null)
    }
  }, [valueStart, valueEnd, valueNumStart, valueNumEnd])

  useEffect(() => {
    if (valueNumStep) {
      Number(valueStep) > 0 ? setStepAboveZero(true) : setStepAboveZero(false)
    } else {
      setStepAboveZero(null)
    }
  }, [valueStep, valueNumStep])

  useEffect(() => {
    if (valueNumStart && valueNumEnd && valueNumStep && endGreaterStart && stepAboveZero) {
      setX(calcLinspace(Number(valueStart), Number(valueEnd), Number(valueStep)))
    } else {
      setX("")
    }
  }, [valueStart, valueEnd, valueStep, valueNumStart, valueNumEnd, valueNumStep, endGreaterStart, stepAboveZero])

  useEffect(() => {
    props.setVariables(prevState => ({
      ...prevState, [props.id]: {
        addressSheet: addressSheet, addressCell: addressCell,
        valueStart: valueStart, valueEnd: valueEnd, valueStep: valueStep,
        valueNumStart: valueNumStart, valueNumEnd: valueNumEnd, valueNumStep: valueNumStep,
        endGreaterStart: endGreaterStart, stepAboveZero: stepAboveZero, x: x, prob: prob, assigned: assigned
      }
    }))
  })

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
    setValueNumStart(!isNaN(e.target.value))
  };

  const handleChangeEnd = (e) => {
    setValueEnd(e.target.value)
    setValueNumEnd(!isNaN(e.target.value))
  };

  const handleChangeStep = (e) => {
    setValueStep(e.target.value)
    setValueNumStep(!isNaN(e.target.value))
  };

  const handleClickConn = (e) => {
    axios.get("http://127.0.0.1:8000/get_selection").then((response) => {
      setAddressSheet(response.data.sheet)
      setAddressCell(response.data.range)
    });
  }

  const handleClickProb = (e) => {
    e.preventDefault()
    const url = 'http://127.0.0.1:8000/io_variable';
    const data = { start: Number(valueStart), end: Number(valueEnd), step: Number(valueStep), dist: 'unif' }
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

  const testDupe = () => {
    const possibleDupes = _.filter(props.variables, { addressSheet: addressSheet, addressCell: addressCell })
    return !_.every(possibleDupes, ['assigned', false]) && possibleDupes.length >= 2 && !variable.assigned
  }

  const handleClickAssign = (e) => {
    e.preventDefault()
    if (!assigned) {
      const url = 'http://127.0.0.1:8000/assign_variable';
      const data = { sheet: addressSheet, cell: addressCell, x: x, prob: prob }
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      axios.post(url, data, config).then((response) => {
        setAssigned(true)
      });
    } else {
      const url = 'http://127.0.0.1:8000/unassign_variable';
      const data = { sheet: addressSheet, cell: addressCell }
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      axios.post(url, data, config).then((response) => {
        setAssigned(false)
        setProb()
      });
    }
    testDupe()
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      {addressCell ? <>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">
            Sheet
          </Typography>
          <Typography variant="caption">
            {addressSheet}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Cell
          </Typography>
          <Typography variant="h6">
            {addressCell}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Random variable range
          </Typography>
          <Stack spacing={2} direction="row">
            <TextField
              error={!valueNumStart || endGreaterStart === false}
              helperText={!valueNumStart ? "Start value is not a number." : endGreaterStart === false ? "Start value is greater than End." : ""}
              size="small"
              id="outlined-helperText"
              label="Start"
              value={valueStart}
              onChange={handleChangeStart}
              disabled={assigned}
            />
            <TextField
              error={!valueNumEnd || endGreaterStart === false}
              helperText={!valueNumEnd ? "End value is not a number." : endGreaterStart === false ? "Start value is greater than End." : ""}
              size="small"
              id="outlined-helperText"
              label="End"
              value={valueEnd}
              onChange={handleChangeEnd}
              disabled={assigned}
            />
            <TextField
              error={!valueNumStep || !stepAboveZero}
              helperText={!valueNumStep ? "Step value is not a number." : !stepAboveZero ? "Step value is not above zero." : ""}
              size="small"
              id="outlined-helperText"
              label="Step"
              value={valueStep}
              onChange={handleChangeStep}
              disabled={assigned}
            />
          </Stack>
          <Typography variant="caption" component={'div'}>
            {x ? x.map(k => k.toFixed(2)).join(", ") : ""}
          </Typography>
          <Typography variant="caption" component={'div'}>
            {prob ? prob.map(k => k.toFixed(2)).join(", ") : ""}
          </Typography>
        </CardContent></> : null}
      <CardActions>
        <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClickConn} disabled={assigned}>
          Connect
        </Button>
        <Button variant="outlined" startIcon={<BarChartIcon />} onClick={handleClickProb} disabled={assigned}>
          Probability
        </Button>
        {assigned ?
          <Button variant="outlined" startIcon={<LockIcon />} onClick={handleClickAssign} disabled={!prob}>
            Assigned
          </Button> : ""
        }
        {!assigned ?
          <Button variant="outlined" startIcon={<LockOpenIcon />} onClick={handleClickAssign} disabled={!prob || testDupe()}>
            Assign
          </Button> : ""
        }
      </CardActions>
      {testDupe() ?
        <Alert variant="outlined" severity="warning">
          Possible duplicate — check it out!
        </Alert> : ""
      }
    </Card>
  );
}
