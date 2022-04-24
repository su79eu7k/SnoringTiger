import { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CableIcon from '@mui/icons-material/Cable';
import BarChartIcon from '@mui/icons-material/BarChart';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import _ from 'lodash'

export default function MonitoringCellCard(props) {
  const monitoringCell = props.monitoringCells[props.id]

  const [addressSheet, setAddressSheet] = useState(monitoringCell ? monitoringCell.addressSheet : null)
  const [addressCell, setAddressCell] = useState(monitoringCell ? monitoringCell.addressCell : null)

  const [assigned, setAssigned] = useState(monitoringCell ? monitoringCell.assigned : false)

  useEffect(() => {
    props.setMonitoringCells(prevState => ({
      ...prevState, [props.id]: {
        addressSheet: addressSheet, addressCell: addressCell, assigned: assigned
      }
    }))
  }, [addressSheet, addressCell, assigned])

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
        </CardContent></> : null}
      <CardActions>
        <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClickConn} disabled={props.conn !== 1 || assigned}>
          Connect
        </Button>
        {assigned ?
          <Button variant="outlined" startIcon={<LockIcon />} onClick={handleClickAssign} disabled={props.conn !== 1}>
            Assigned
          </Button> : ""
        }
        {!assigned ?
          <Button variant="outlined" startIcon={<LockOpenIcon />} onClick={handleClickAssign} disabled={props.conn !== 1 || testDupe()}>
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
