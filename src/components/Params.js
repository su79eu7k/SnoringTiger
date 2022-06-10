import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';


export default function Params(props) {
  const id = props.id
  const randomCell = props.randomCell
  const setRandomCells = props.setRandomCells
  const setProb = props.setProb

  const [labelLoc, setLabelLoc] = useState(randomCell.labelLoc ? randomCell.labelLoc : "Loc")
  const [labelScale, setLabelScale] = useState(randomCell.labelScale ? randomCell.labelScale : "Scale")

  const [valueLoc, setValueLoc] = useState(randomCell.valueLoc ? randomCell.valueLoc : "")
  const [valueScale, setValueScale] = useState(randomCell.valueScale ? randomCell.valueScale : "")

  const [valueNumLoc, setValueNumLoc] = useState(randomCell.valueNumLoc ? randomCell.valueNumLoc : null)
  const [valueNumScale, setValueNumScale] = useState(randomCell.valueNumScale ? randomCell.valueNumScale : null)

  // Hyper-parameters for beta distribution
  const [valueA, setValueA] = useState(randomCell.valueA ? randomCell.valueA : "")
  const [valueB, setValueB] = useState(randomCell.valueB ? randomCell.valueB : "")

  const [valueNumA, setValueNumA] = useState(randomCell.valueNumA ? randomCell.valueNumA : null)
  const [valueNumB, setValueNumB] = useState(randomCell.valueNumB ? randomCell.valueNumB : null)

  const [valueGtZeroA, setValueGtZeroA] = useState(randomCell.valueGtZeroA ? randomCell.valueGtZeroA : null)
  const [valueGtZeroB, setValueGtZeroB] = useState(randomCell.valueGtZeroB ? randomCell.valueGtZeroB : null)

  useEffect(() => {
    setRandomCells(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        labelLoc: labelLoc, labelScale: labelScale,
        valueLoc: valueLoc, valueScale: valueScale,
        valueNumLoc: valueNumLoc, valueNumScale: valueNumScale,
        valueA: valueA, valueB: valueB,
        valueNumA: valueNumA, valueNumB: valueNumB,
      }
    }))
  }, [setRandomCells, id, labelLoc, labelScale, valueLoc, valueScale, valueNumLoc, valueNumScale, valueA, valueB, valueNumA, valueNumB])

  useEffect(() => {
    const _valid = randomCell.valueNumStart && randomCell.valueNumEnd && randomCell.valueNumStep && randomCell.endGtStart && randomCell.stepEgtTwo

    if (_valid) {
      if (randomCell.dist === "unif") {
        setLabelLoc("Loc")
        setLabelScale("Scale")

        setValueLoc(randomCell.valueStart)
        setValueScale(randomCell.valueEnd - randomCell.valueStart)
      } else if (randomCell.dist === "norm") {
        setLabelLoc("Loc(μ)")
        setLabelScale("Scale(σ)")
        
        const _x = calcLinspace(Number(randomCell.valueStart), Number(randomCell.valueEnd), Number(randomCell.valueStep) + 1)
        const _n = _x.length
        const _mean = _x.reduce((a, b) => a + b) / _n
        const _stdv = Math.sqrt(_x.map(x => Math.pow(x - _mean, 2)).reduce((a, b) => a + b) / _n)

        setValueLoc(_mean)
        setValueScale(_stdv)
      } else if (randomCell.dist === "expon") {
        setLabelLoc("Loc")
        setLabelScale("Scale(1 / λ)")

        setValueLoc(randomCell.valueStart)
        setValueScale((randomCell.valueEnd - randomCell.valueStart) / 38.299 * 2)
      } else if (randomCell.dist === "beta") {
        setLabelLoc("Loc")
        setLabelScale("Scale")

        setValueLoc(randomCell.valueStart)
        setValueScale(randomCell.valueEnd - randomCell.valueStart)
      }
    }
  }, [randomCell.dist, randomCell.valueNumStart, randomCell.valueNumEnd, randomCell.valueNumStep, randomCell.endGtStart, randomCell.stepEgtTwo, randomCell.valueStart, randomCell.valueEnd, randomCell.valueStep])

  useEffect(() => {
    setValueNumLoc(!(isNaN(valueLoc) || valueLoc === ""))
    setValueNumScale(!(isNaN(valueScale) || valueScale === ""))
  }, [valueLoc, valueScale])

  useEffect(() => {
    setValueGtZeroA(valueA > 0)
    setValueGtZeroB(valueB > 0)
  }, [valueA, valueB, valueNumA, valueNumB])

  const handleChangeLoc = (e) => {
    e.preventDefault()
    setValueLoc(e.target.value)
    setValueNumLoc(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeScale = (e) => {
    e.preventDefault()
    setValueScale(e.target.value)
    setValueNumScale(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeA = (e) => {
    e.preventDefault()
    setValueA(e.target.value)
    setValueNumA(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  const handleChangeB = (e) => {
    e.preventDefault()
    setValueB(e.target.value)
    setValueNumB(!(isNaN(e.target.value) || e.target.value === ""))
    setProb(null)
  };

  function calcLinspace(start, end, step) {
    const result = [];
    const scale = (end - start) / (step - 1);
    for (let i = 0; i < step; i++) {
      result.push(start + (scale * i));
    }
    return result;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="flex-start">
            <TextField
              error={!valueNumLoc}
              helperText={!valueNumLoc ? labelLoc + " is not a number." : ""}
              size="small"
              id="outlined-helperText"
              label={labelLoc}
              value={valueLoc}
              onChange={handleChangeLoc}
              disabled={randomCell.assigned}
            />
            <TextField
              error={!valueNumScale}
              helperText={!valueNumScale ? labelScale + " is not a number." : ""}
              size="small"
              id="outlined-helperText"
              label={labelScale}
              value={valueScale}
              onChange={handleChangeScale}
              disabled={randomCell.assigned}
            />
            {randomCell.dist === "beta" ?
              <>
                <TextField
                  error={!valueNumA || !valueGtZeroA}
                  helperText={!valueNumA ? "α is not a number." : !valueGtZeroA ? "α > 0" : ""}
                  size="small"
                  id="outlined-helperText"
                  label="α"
                  value={valueA}
                  onChange={handleChangeA}
                  disabled={randomCell.assigned}
                />
                <TextField
                  error={!valueNumB || !valueGtZeroB}
                  helperText={!valueNumB ? "β is not a number." : !valueGtZeroB ? "α > 0" : ""}
                  size="small"
                  id="outlined-helperText"
                  label="β"
                  value={valueB}
                  onChange={handleChangeB}
                  disabled={randomCell.assigned}
                />
              </> : ""
            }
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
