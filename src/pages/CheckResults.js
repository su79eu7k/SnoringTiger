import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import _ from 'lodash';
import { DateTime } from "luxon";
import ListFile from '../components/ListFile';
import ControlButton from '../components/ControlButton';
import { API_SERVER } from '../helpers/url';

export default function CheckResults() {
  const [snapshotHist, setSnapshotHist] = useState();
  const [snapshotHistParams, setSnapshotHistParams] = useState();
  const [lastUpdated, setLastUpdated] = useState(DateTime.now().toUnixInteger())

  useEffect(() => {
    axios.get(API_SERVER + "/get_hist_list").then((response) => {
      setSnapshotHist(response.data)
    }).catch(() => { })

    axios.get(API_SERVER + "/get_hist_list_params").then((response) => {
      setSnapshotHistParams(response.data)
    }).catch(() => { })
  }, [lastUpdated])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          History
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ minWidth: 445 }}>
          <CardContent>
          <Stack direction="row" justifyContent="flex-end">
            <ControlButton
              connStatus={1}
              handleClick={() => setLastUpdated(DateTime.now().toUnixInteger())}
              caption={"Refresh"}
              iconComponent={
                <RefreshIcon fontSize="small" sx={{ color: "text.secondary" }} />
              }
            />
            </Stack>
            {
              (snapshotHist !== undefined) && (snapshotHistParams !== undefined) ?
                <List dense>
                  {_.uniq(_.map(snapshotHist, (e) => (e.filename))).map((filename, i) => (
                    <ListFile key={"f-" + i.toString()}
                      groups={_.filter(snapshotHist, { "filename": filename })}
                      groupsParam={_.filter(snapshotHistParams, { "filename": filename })}
                      filename={filename}
                      setLastUpdated={setLastUpdated} />
                  ))}
                </List> : null
            }
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
