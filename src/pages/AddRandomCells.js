import Typography from '@mui/material/Typography';
import RandomCellCard from '../components/RandomCellCard'
import _ from 'lodash'

export default function AddRandomCells(props) {
  return (
    <>
      <Typography variant="h6">
        Add Random Cells
      </Typography>
      {[...Array(_.reject(props.randomCells, { addressSheet: null, addressCell: null }).length + 1)].map(
        (v, i) => <RandomCellCard key={i.toString()} id={i.toString()} conn={props.conn} randomCells={props.randomCells} setRandomCells={props.setRandomCells} />)}
    </>
  )
}
