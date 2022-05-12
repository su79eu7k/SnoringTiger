import { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CableIcon from '@mui/icons-material/Cable';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import _ from 'lodash'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import AddressInfo from './AddressInfo';


export default function MonitoringCellCard(props) {
  const id = props.id
  const connStatus = props.connStatus
  const monitoringCell = props.monitoringCells[id]
  const setMonitoringCells = props.setMonitoringCells

  const [addressSheet, setAddressSheet] = useState(monitoringCell ? monitoringCell.addressSheet : null)
  const [addressCell, setAddressCell] = useState(monitoringCell ? monitoringCell.addressCell : null)

  const [assigned, setAssigned] = useState(monitoringCell ? monitoringCell.assigned : false)

  useEffect(() => {
    setMonitoringCells(prevState => ({
      ...prevState, [id]: {
        addressSheet: addressSheet, addressCell: addressCell, assigned: assigned
      }
    }))
  }, [id, addressSheet, addressCell, assigned, setMonitoringCells])

  const handleClickConn = (e) => {
    axios.get("http://127.0.0.1:8000/get_selection").then((response) => {
      setAddressSheet(response.data.sheet)
      setAddressCell(response.data.range)
    });
  }

  const testDupe = () => {
    const possibleDupes = _.filter(props.monitoringCells, { addressSheet: addressSheet, addressCell: addressCell })
    return !_.every(possibleDupes, ['assigned', false]) && possibleDupes.length >= 2 && !monitoringCell.assigned
  }

  const handleClickAssign = (e) => {
    e.preventDefault()
    if (!assigned) {
      const url = 'http://127.0.0.1:8000/add_monitoring_cell';
      const data = { sheet: addressSheet, cell: addressCell }
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      axios.post(url, data, config).then((response) => {
        setAssigned(true)
      });
    } else {
      const url = 'http://127.0.0.1:8000/remove_monitoring_cell';
      const data = { sheet: addressSheet, cell: addressCell }
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      axios.post(url, data, config).then((response) => {
        setAssigned(false)
      });
    }
    testDupe()
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      {addressCell ? <>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <AddressInfo connStatus={connStatus} addressSheet={addressSheet} addressCell={addressCell} />
            </Grid>
            <Grid item xs={10}></Grid>
          </Grid>
        </CardContent></> : null}
      <CardActions>
        <Grid container spacing={0}>
          <Grid item xs={2}></Grid>
          <Grid item xs={10}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClickConn} disabled={connStatus !== 1 || assigned}>
                Connect
              </Button>
              {assigned ?
                <Button variant="outlined" startIcon={<LockIcon />} onClick={handleClickAssign} disabled={connStatus !== 1}>
                  Assigned
                </Button> : ""
              }
              {!assigned ?
                <Button variant="outlined" startIcon={<LockOpenIcon />} onClick={handleClickAssign} disabled={connStatus !== 1 || !addressCell || testDupe()}>
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
