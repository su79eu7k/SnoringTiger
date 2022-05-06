import { useState } from 'react'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles'


function ElemSelection(props) {
  const addressSheet = props.addressSheet
  const addressCell = props.addressCell

  const [selected, setSelected] = useState(false)

  const theme = useTheme()

  const handleClick = (e) => {
    setSelected(!selected)
  }

  return (
    <ButtonBase
      onClick={handleClick}
      sx={{
          color: theme.palette.mode === "light" ? "#2e7d32" : "#aad5aa",
          border: theme.palette.mode === "light" ? "1px solid rgba(46, 125, 50, 0.5)" : "1px solid rgba(170, 213, 170, 0.5)",
          borderRadius: 1,
        "&:hover": {
          backgroundColor: "rgba(46, 125, 50, 0.04)",
          border: "1px solid #2e7d32",
        },
        "&.Mui-disabled": {
          color: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.26)" : "rgba(255, 255, 255, 0.3)",
          border: theme.palette.mode === "light" ? "1px solid rgba(0, 0, 0, 0.12)" : "1px solid rgba(255, 255, 255, 0.12)",
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