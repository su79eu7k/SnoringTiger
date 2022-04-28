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

export default function RandomCellCard(props) {
  const randomCell = props.randomCells[props.id]

  const [addressSheet, setAddressSheet] = useState(randomCell ? randomCell.addressSheet : null)
  const [addressCell, setAddressCell] = useState(randomCell ? randomCell.addressCell : null)

  const [valueStart, setValueStart] = useState(randomCell ? randomCell.valueStart : "")
  const [valueEnd, setValueEnd] = useState(randomCell ? randomCell.valueEnd : "")
  const [valueStep, setValueStep] = useState(randomCell ? randomCell.valueStep : "")

  const [valueNumStart, setValueNumStart] = useState(randomCell ? randomCell.valueNumStart : null)
  const [valueNumEnd, setValueNumEnd] = useState(randomCell ? randomCell.valueNumEnd : null)
  const [valueNumStep, setValueNumStep] = useState(randomCell ? randomCell.valueNumStep : null)

  const [endGtStart, setEndGtStart] = useState(randomCell ? randomCell.endGtStart : null)
  const [stepEgtTwo, setStepEgtTwo] = useState(randomCell ? randomCell.stepEgtTwo : null)

  const [x, setX] = useState(randomCell ? randomCell.x : null)
  const [prob, setProb] = useState(randomCell ? randomCell.prob : null)

  const [assigned, setAssigned] = useState(randomCell ? randomCell.assigned : false)

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
  }, [valueStep, valueNumStep])

  useEffect(() => {
    if (valueNumStart && valueNumEnd && valueNumStep && endGtStart && stepEgtTwo) {
      setX(calcLinspace(Number(valueStart), Number(valueEnd), Number(valueStep)))
    } else {
      setX("")
    }
  }, [valueStart, valueEnd, valueStep, valueNumStart, valueNumEnd, valueNumStep, endGtStart, stepEgtTwo])

  useEffect(() => {
    props.setRandomCells(prevState => ({
      ...prevState, [props.id]: {
        addressSheet: addressSheet, addressCell: addressCell,
        valueStart: valueStart, valueEnd: valueEnd, valueStep: valueStep,
        valueNumStart: valueNumStart, valueNumEnd: valueNumEnd, valueNumStep: valueNumStep,
        endGtStart: endGtStart, stepEgtTwo: stepEgtTwo, x: x, prob: prob, assigned: assigned
      }
    }))
  }, [addressSheet, addressCell, valueStart, valueEnd, valueStep, valueNumStart, valueNumEnd, valueNumStep, endGtStart, stepEgtTwo, x, prob, assigned])

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
    setProb(null)
  };

  const handleChangeEnd = (e) => {
    setValueEnd(e.target.value)
    setValueNumEnd(!isNaN(e.target.value))
    setProb(null)
  };

  const handleChangeStep = (e) => {
    setValueStep(e.target.value)
    setValueNumStep(!isNaN(e.target.value))
    setProb(null)
  };

  const handleClickConn = (e) => {
    axios.get("http://127.0.0.1:8000/get_selection").then((response) => {
      setAddressSheet(response.data.sheet)
      setAddressCell(response.data.range)
    });
  }

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

  const testDupe = () => {
    const possibleDupes = _.filter(props.randomCells, { addressSheet: addressSheet, addressCell: addressCell })
    return !_.every(possibleDupes, ['assigned', false]) && possibleDupes.length >= 2 && !randomCell.assigned
  }

  const handleClickAssign = (e) => {
    e.preventDefault()
    if (!assigned) {
      const url = 'http://127.0.0.1:8000/add_random_cell';
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
      const url = 'http://127.0.0.1:8000/remove_random_cell';
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
            Simulation Range
          </Typography>
          <Stack spacing={2} direction="row">
            <TextField
              error={!valueNumStart || endGtStart === false}
              helperText={!valueNumStart ? "Start value is not a number." : endGtStart === false ? "Start value is greater than End." : ""}
              size="small"
              id="outlined-helperText"
              label="Start"
              value={valueStart}
              onChange={handleChangeStart}
              disabled={assigned}
            />
            <TextField
              error={!valueNumEnd || endGtStart === false}
              helperText={!valueNumEnd ? "End value is not a number." : endGtStart === false ? "Start value is greater than End." : ""}
              size="small"
              id="outlined-helperText"
              label="End"
              value={valueEnd}
              onChange={handleChangeEnd}
              disabled={assigned}
            />
            <TextField
              error={!valueNumStep || !stepEgtTwo}
              helperText={!valueNumStep ? "Step value is not an integer." : !stepEgtTwo ? "Step value is not 2 or more integer." : ""}
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
        <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClickConn} disabled={props.conn !== 1 || assigned}>
          Connect
        </Button>
        <Button variant="outlined" startIcon={<BarChartIcon />} onClick={handleClickProb} disabled={props.conn !== 1 || assigned}>
          Probability
        </Button>
        {assigned ?
          <Button variant="outlined" startIcon={<LockIcon />} onClick={handleClickAssign} disabled={props.conn !== 1 || !prob}>
            Assigned
          </Button> : ""
        }
        {!assigned ?
          <Button variant="outlined" startIcon={<LockOpenIcon />} onClick={handleClickAssign} disabled={props.conn !== 1 || !prob || testDupe()}>
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
