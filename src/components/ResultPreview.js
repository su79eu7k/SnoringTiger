import { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CableIcon from '@mui/icons-material/Cable';
import axios from 'axios';
import _ from 'lodash'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

export default function ResultPreview(props) {
  const connStatus = props.connStatus
  const randomCells = props.randomCells
  const monitoringCell = props.monitoringCells

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Result Preview
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" startIcon={<CableIcon />} onClick={null} disabled={connStatus !== 1}>
                Preview
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
