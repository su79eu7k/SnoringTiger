import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import axios from 'axios';
import _ from 'lodash'
import HistGroup from '../components/HistGroup';

export default function CheckResults() {
  const [histData, setHistData] = useState();
  const [histGroupData, setHistGroupData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/get_hist").then((response) => {
      

      const _groups = _.groupBy(response.data, 'filename')
      const _groupKeys = _.keys(_groups)

      setHistData(_groups)
      setHistGroupData(_.map(_groupKeys, (k) => _groups[k][_groups[k].length - 1]))
    })
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          History
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <List dense>
              {histGroupData.map((el, i) => (
                <HistGroup key={i.toString()} el={el} histData={histData[el.filename]}/>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
