import Typography from '@mui/material/Typography';
import RandomCellCard from '../components/RandomCellCard'
import Grid from '@mui/material/Grid';
import _ from 'lodash'

export default function AddRandomCells(props) {
  const connStatus = props.connStatus
  const randomCells = props.randomCells
  const setRandomCells = props.setRandomCells

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            Add Random Cells
          </Typography>
        </Grid>
        {[...Array(_.reject(randomCells, { addressSheet: null, addressCell: null }).length + 1)].map(
          (v, i) => (
            <Grid item xs={12} key={i.toString()}>
              <RandomCellCard id={i.toString()} connStatus={connStatus} randomCells={randomCells} setRandomCells={setRandomCells} />
            </Grid>
          )
        )}
      </Grid>
    </>
  )
}
