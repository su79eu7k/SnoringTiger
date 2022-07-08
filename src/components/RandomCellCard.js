import React, { useState, useEffect } from 'react'
import InputAuto from './InputAuto';
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
import { useTheme } from '@mui/styles'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import AddressInfo from './AddressInfo';


export default function RandomCellCard(props) {
  const id = props.id
  const connStatus = props.connStatus
  const randomCells = props.randomCells
  const randomCell = randomCells[id]
  const setRandomCells = props.setRandomCells

  const [addressSheet, setAddressSheet] = useState(randomCell ? randomCell.addressSheet : null)
  const [addressCell, setAddressCell] = useState(randomCell ? randomCell.addressCell : null)

  const [cellTypeAuto, setCellTypeAuto] = useState(randomCell ? randomCell.cellTypeAuto : true)

  const [assigned, setAssigned] = useState(randomCell ? randomCell.assigned : false)

  const [x, setX] = useState(randomCell ? randomCell.x : null)
  const [prob, setProb] = useState(randomCell ? randomCell.prob : null)
  const [coords, setCoords] = useState([])

  const [decimal, setDecimal] = useState(2)

  const theme = useTheme()

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
      setCoords(_.values(x).map((v, i) => ({ x: v, y: _.values(prob)[i] })))
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
    const possibleDupes = _.filter(randomCells, { addressSheet: addressSheet, addressCell: addressCell })
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
        setProb(null)
      });
    }
    testDupe()
  }

  return (
    <Card sx={{ minWidth: 445 }}>
      {addressCell ? <>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <AddressInfo connStatus={connStatus} addressSheet={addressSheet} addressCell={addressCell} />
            </Grid>
            <Grid item xs={10} container spacing={2}>
              <Grid item xs={12}>
                {cellTypeAuto ?
                  <InputAuto connStatus={connStatus} id={id} randomCells={randomCells} setRandomCells={setRandomCells} setX={setX} setProb={setProb} setDecimal={setDecimal} /> :
                  <InputManual connStatus={connStatus} id={id} randomCells={randomCells} setRandomCells={setRandomCells} setX={setX} setProb={setProb} setDecimal={setDecimal} />
                }</Grid>
              <Grid item xs={12}>
                <ProbPreview addressSheet={addressSheet} addressCell={addressCell} decimal={decimal} setDecimal={setDecimal} connStatus={connStatus} x={x} prob={prob} coords={coords} cellTypeAuto={cellTypeAuto} theme={theme} />
              </Grid>
            </Grid>
          </Grid>
        </CardContent></> : null}
      <CardActions>
        <Grid container spacing={0}>
          <Grid item xs={2}></Grid>
          <Grid item xs={10}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Button data-testid="BtnConnRandCell" variant="outlined" startIcon={<CableIcon />} onClick={handleClickConn} disabled={connStatus !== 1 || assigned}>
                Connect
              </Button>
              {cellTypeAuto ?
                <Button data-testid="BtnManual" variant="outlined" startIcon={<AccountTreeIcon />} onClick={handleClickCellTypeAuto} disabled={connStatus !== 1 || assigned}>
                  Manual
                </Button> : ""
              }
              {!cellTypeAuto ?
                <Button data-testid="BtnAuto" variant="outlined" startIcon={<AutoGraphIcon />} onClick={handleClickCellTypeAuto} disabled={connStatus !== 1 || assigned}>
                  Auto
                </Button> : ""
              }
              {assigned ?
                <Button data-testid="BtnRandAssigned" variant="outlined" startIcon={<LockIcon />} onClick={handleClickAssign} disabled={connStatus !== 1 || !prob}>
                  Assigned
                </Button> : ""
              }
              {!assigned ?
                <Button data-testid="BtnRandAssign" variant="outlined" startIcon={<LockOpenIcon />} onClick={handleClickAssign} disabled={connStatus !== 1 || !prob || testDupe()}>
                  Assign
                </Button> : ""
              }
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
      {testDupe() ?
        <Alert variant="outlined" severity="warning">
          Possible duplicate — check it out!
        </Alert> : ""
      }
    </Card>
  );
}
