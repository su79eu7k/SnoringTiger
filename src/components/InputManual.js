import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import _ from 'lodash'


export default function InputManual(props) {
  const id = props.id
  const randomCell = props.randomCells[id]
  const setRandomCells = props.setRandomCells
  // const setX = props.setX

  const [inputCount, setInputCount] = useState(randomCell.inputCount ? randomCell.inputCount : 0)

  const [valRandVars, setValRandVars] = useState(randomCell.valRandVars ? randomCell.valRandVars : {})
  const [valLikelihoods, setValLikelihoods] = useState(randomCell.valLikelihoods ? randomCell.valLikelihoods : {})

  const [valNumRandVars, setValNumRandVars] = useState(randomCell.valNumRandVars ? randomCell.valNumRandVars : {})
  const [valNumLikelihoods, setValNumLikelihoods] = useState(randomCell.valNumLikelihoods ? randomCell.valNumLikelihoods : {})

  const handleChangeRandVar = (e) => {
    setValRandVars(prevState => ({...prevState, [e.target.id]: e.target.value}))
    setValNumRandVars(prevState => ({...prevState, [e.target.id]: !isNaN(e.target.value)}))
    props.setProb(null)
  };

  const handleChangeLikelihood = (e) => {
    setValLikelihoods(prevState => ({...prevState, [e.target.id]: e.target.value}))
    setValNumLikelihoods(prevState => ({...prevState, [e.target.id]: !isNaN(e.target.value)}))
    props.setProb(null)
  };

  const handleRemove = (e) => {
    setInputCount(prevState => Math.max(prevState - 1, 0))

    if (inputCount > 0) {
      setValRandVars(prevState => (delete prevState[inputCount], prevState))
      setValNumRandVars(prevState => (delete prevState[inputCount], prevState))
      setValLikelihoods(prevState => (delete prevState[inputCount], prevState))
      setValNumLikelihoods(prevState => (delete prevState[inputCount], prevState))
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
  }, [setRandomCells, id, inputCount, valRandVars, valLikelihoods, valNumRandVars, valNumLikelihoods])

  return (
    <>
      <Typography variant="subtitle2" color="text.secondary">
        Simulation Range
      </Typography>
      <IconButton onClick={() => setInputCount(prevState => prevState + 1)} disabled={props.conn !== 1 || randomCell.assigned}>
        <AddIcon />
      </IconButton>
      <IconButton onClick={handleRemove} disabled={props.conn !== 1 || randomCell.assigned}>
        <RemoveIcon />
      </IconButton>
      {_.range(inputCount + 1).map((_, i) => 
        <Stack key={i.toString()} spacing={2} direction="row">
          <TextField
            id={i.toString()}
            error={!valNumRandVars[i]}
            helperText={!valNumRandVars[i] ? "Value is not a number." : ""}
            size="small"
            label="Random Variable"
            value={valRandVars[i] || ""}
            onChange={handleChangeRandVar}
            disabled={randomCell.assigned}
          />
          <TextField
            id={i.toString()}
            error={!valNumLikelihoods[i]}
            helperText={!valNumLikelihoods[i] ? "Value is not a number." : ""}
            size="small"
            label="Likelihood"
            value={valLikelihoods[i] || ""}
            onChange={handleChangeLikelihood}
            disabled={randomCell.assigned}
          />
        </Stack>
      )}
    </>
  );
}
