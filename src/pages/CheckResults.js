import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { DataGrid } from '@mui/x-data-grid';

export default function CheckResults() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          Check Results
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            card content
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
