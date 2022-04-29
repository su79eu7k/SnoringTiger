import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
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
    setValRandVars(prevState => ({...prevState, [inputCount]: e.target.value}))
    setValNumRandVars(prevState => ({...prevState, [inputCount]: !isNaN(e.target.value)}))
    props.setProb(null)
  };

  const handleChangeLikelihood = (e) => {
    setValLikelihoods(prevState => ({...prevState, [inputCount]: e.target.value}))
    setValNumLikelihoods(prevState => ({...prevState, [inputCount]: !isNaN(e.target.value)}))
    props.setProb(null)
  };

  const handleClickAdd = (e) => {
    setInputCount(prevState => prevState + 1)
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
      {_.range(inputCount + 1).map((_, i) => 
        <Stack key={"stack-" + i} spacing={2} direction="row">
          <TextField
            key={"valRandVar-" + i}
            error={!valNumRandVars[i]}
            helperText={!valNumRandVars[i] ? "Value is not a number." : ""}
            size="small"
            id="outlined-helperText"
            label="Start"
            value={valRandVars[i] || ""}
            onChange={handleChangeRandVar}
            disabled={randomCell.assigned}
          />
          <TextField
            key={"valLikelihood-" + i}
            error={!valNumLikelihoods[i]}
            helperText={!valNumLikelihoods[i] ? "Value is not a number." : ""}
            size="small"
            id="outlined-helperText"
            label="End"
            value={valLikelihoods[i] || ""}
            onChange={handleChangeLikelihood}
            disabled={randomCell.assigned}
          />
        </Stack>
      )}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickAdd} disabled={props.conn !== 1 || randomCell.assigned}>
          Add
      </Button>
    </>
  );
}
