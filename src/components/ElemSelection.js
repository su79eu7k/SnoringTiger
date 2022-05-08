import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles'


function ElemSelection(props) {
  const connStatus = props.connStatus
  const addressSheet = props.addressSheet
  const addressCell = props.addressCell
  const type = props.type
  const setToggledCells = props.setToggledCells

  const [selected, setSelected] = useState(false)

  const theme = useTheme()

  const handleClick = (e) => {
    e.preventDefault()
    setSelected(!selected)
  }

  useEffect(() => {
    setToggledCells(prevState => ({...prevState, [type + "'" + addressSheet + "!" + addressCell]: selected}))  
  }, [setToggledCells, type, addressSheet, addressCell, selected])
  

  return (
    <ButtonBase
      disabled={connStatus !== 1}
      onClick={handleClick}
      sx={{
          borderStyle: 'solid',
          borderWidth: '1px',
          borderRadius: 1,
          backgroundColor: selected ? theme.palette.mode === "light" ? "rgba(46, 125, 50, 0.20)" : "rgba(170, 213, 170, 0.20)" : "none",
          color: theme.palette.mode === "light" ? "#2e7d32" : "#aad5aa",
          borderColor: theme.palette.mode === "light" ? "rgba(46, 125, 50, 0.5)" : "rgba(170, 213, 170, 0.5)",
        "&:hover": {
          backgroundColor: theme.palette.mode === "light" ? "rgba(46, 125, 50, 0.10)" : "rgba(170, 213, 170, 0.08)",
          borderColor: theme.palette.mode === "light" ? "#2e7d32" : "#aad5aa",
        },
        "&.Mui-disabled": {
          color: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.26)" : "rgba(255, 255, 255, 0.3)",
          borderColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)",
        },
      }}>
      <Box
        component='span'
        p={1}
        sx={{
          width: '120px',
          display: 'grid',
          gridTemplateRows: 'repeat(2, 1fr)',
        }}>
        <Typography noWrap variant="caption">
          {addressSheet}
        </Typography>
        <Typography variant="subtitle2">
          {addressCell}
        </Typography>
      </Box>
    </ButtonBase>
  )
}

export default ElemSelection