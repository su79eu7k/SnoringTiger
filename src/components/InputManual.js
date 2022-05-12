import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import _ from 'lodash'
import Grid from '@mui/material/Grid';


export default function InputManual(props) {
  const connStatus = props.connStatus
  const id = props.id
  const randomCell = props.randomCells[id]
  const setRandomCells = props.setRandomCells
  const setX = props.setX
  const setProb = props.setProb

  const [inputCount, setInputCount] = useState(randomCell.inputCount ? randomCell.inputCount : 0)

  const [valRandVars, setValRandVars] = useState(randomCell.valRandVars ? randomCell.valRandVars : {})
  const [valLikelihoods, setValLikelihoods] = useState(randomCell.valLikelihoods ? randomCell.valLikelihoods : {})

  const [valNumRandVars, setValNumRandVars] = useState(randomCell.valNumRandVars ? randomCell.valNumRandVars : {})
  const [valNumLikelihoods, setValNumLikelihoods] = useState(randomCell.valNumLikelihoods ? randomCell.valNumLikelihoods : {})

  const handleChangeRandVar = (e) => {
    e.preventDefault()
    setValRandVars(prevState => ({ ...prevState, [e.target.id]: e.target.value }))
    setValNumRandVars(prevState => ({ ...prevState, [e.target.id]: !(isNaN(e.target.value) || e.target.value === "") }))
    setProb(null)
  };

  const handleChangeLikelihood = (e) => {
    e.preventDefault()
    setValLikelihoods(prevState => ({ ...prevState, [e.target.id]: e.target.value }))
    setValNumLikelihoods(prevState => ({ ...prevState, [e.target.id]: !(isNaN(e.target.value) || e.target.value === "") }))
    setProb(null)
  };

  const handleRemove = (e) => {
    e.preventDefault()
    setInputCount(prevState => Math.max(prevState - 1, 0))

    if (inputCount > 0) {
      setValRandVars(prevState => _.omit(prevState, inputCount))
      setValNumRandVars(prevState => _.omit(prevState, inputCount))
      setValLikelihoods(prevState => _.omit(prevState, inputCount))
      setValNumLikelihoods(prevState => _.omit(prevState, inputCount))
    }
  }

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        inputCount: inputCount,
        valRandVars: valRandVars, valLikelihoods: valLikelihoods,
        valNumRandVars: valNumRandVars, valNumLikelihoods: valNumLikelihoods,
      }
    }))

    if (_.values(valNumRandVars).length === _.values(valNumLikelihoods).length &&
      _.values(valNumRandVars).every(v => v === true) && _.values(valNumLikelihoods).every(v => v === true)) {
      setX(_.values(valRandVars).map(v => Number(v)))
      const _total = _.sum(_.values(valLikelihoods).map(v => Number(v)))
      setProb(_.values(valLikelihoods).map(v => Number(v) / _total))
    } else {
      setX(null)
      setProb(null)
    }

  }, [setRandomCells, id, inputCount, valRandVars, valLikelihoods, valNumRandVars, valNumLikelihoods, setX, setProb])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Random Variables
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="flex-end" justifyContent="flex-end">
            <IconButton onClick={() => setInputCount(prevState => prevState + 1)} disabled={connStatus !== 1 || randomCell.assigned}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleRemove} disabled={connStatus !== 1 || randomCell.assigned}>
              <RemoveIcon />
            </IconButton>
          </Stack>
        </Grid>
        <Grid item xs={12} container spacing={2}>
        {_.range(inputCount + 1).map((_, i) =>
            <Grid key={"Input-M-" + i} item xs={12} justifyContent="flex-end" container spacing={2}>
              <Grid item>
              <TextField
                id={i.toString()}
                value={valRandVars[i] || ""}
                onChange={handleChangeRandVar}
                size="small"
                label={"Random Variable " + (i + 1).toString()}
                error={!valNumRandVars[i]}
                helperText={!valNumRandVars[i] ? "Value is not a number." : ""}
                disabled={randomCell.assigned}
              /></Grid>
              <Grid item>
              <TextField
                id={i.toString()}
                value={valLikelihoods[i] || ""}
                onChange={handleChangeLikelihood}
                size="small"
                label={"Likelihood " + (i + 1).toString()}
                error={!valNumLikelihoods[i]}
                helperText={!valNumLikelihoods[i] ? "Value is not a number." : ""}
                disabled={randomCell.assigned}
              /></Grid>
            </Grid>
        )}
        </Grid>
      </Grid>
    </>
  );
}
