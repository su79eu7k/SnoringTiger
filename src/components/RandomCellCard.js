import React, { useState, useEffect } from 'react'
import InputAuto from './InputAuto';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CableIcon from '@mui/icons-material/Cable';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import _ from 'lodash'
import InputManual from './InputManual';
import ProbPreview from './ProbPreview';


export default function RandomCellCard(props) {
  const id = props.id
  const randomCell = props.randomCells[id]
  const setRandomCells = props.setRandomCells

  const [addressSheet, setAddressSheet] = useState(randomCell ? randomCell.addressSheet : null)
  const [addressCell, setAddressCell] = useState(randomCell ? randomCell.addressCell : null)

  const [cellTypeAuto, setCellTypeAuto] = useState(randomCell ? randomCell.cellTypeAuto : true)
  
  const [assigned, setAssigned] = useState(randomCell ? randomCell.assigned : false)

  const [x, setX] = useState(randomCell ? randomCell.x : null)
  const [prob, setProb] = useState(randomCell ? randomCell.prob : null)

  const [coords, setCoords] = useState([])

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        addressSheet: addressSheet, addressCell: addressCell,
        cellTypeAuto: cellTypeAuto, 
        x: x, prob: prob,
        assigned: assigned
      }
    }))
  }, [setRandomCells, id, addressSheet, addressCell, cellTypeAuto, x, prob, assigned])

  useEffect(() => {
    if (x && prob) {
      setCoords(_.values(x).map((v, i) => ({x: v, y: _.values(prob)[i]})))
    } else {
      setCoords([])
    }
  }, [x, prob, setCoords])
  

  const handleClickConn = (e) => {
    axios.get("http://127.0.0.1:8000/get_selection").then((response) => {
      setAddressSheet(response.data.sheet)
      setAddressCell(response.data.range)
    });
  }

  const handleClickCellTypeAuto = (e) => {
    setCellTypeAuto(!cellTypeAuto)
    setProb()
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

          {cellTypeAuto ?
            <InputAuto id={id} conn={props.conn} randomCells={props.randomCells} setRandomCells={props.setRandomCells} setX={setX} setProb={setProb} /> :
            <InputManual id={id} conn={props.conn} randomCells={props.randomCells} setRandomCells={props.setRandomCells} setX={setX} setProb={setProb} />
          }

          <Typography variant="caption" component={'div'}>
            {x ? x.map(k => k.toFixed(2)).join(", ") : ""}
          </Typography>
          <Typography variant="caption" component={'div'}>
            {prob ? prob.map(k => k.toFixed(2)).join(", ") : ""}
          </Typography>
          <ProbPreview x={x} prob={prob} coords={coords} cellTypeAuto={cellTypeAuto} />
        </CardContent></> : null}
      <CardActions>
        <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClickConn} disabled={props.conn !== 1 || assigned}>
          Connect
        </Button>
        {cellTypeAuto ?
          <Button variant="outlined" startIcon={<AccountTreeIcon />} onClick={handleClickCellTypeAuto} disabled={props.conn !== 1 || assigned}>
            Manual
          </Button> : ""
        }
        {!cellTypeAuto ?
          <Button variant="outlined" startIcon={<AutoGraphIcon />} onClick={handleClickCellTypeAuto} disabled={props.conn !== 1 || assigned}>
            Auto
          </Button> : ""
        }
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
