import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';

function ElemSelection(props) {
  const addressSheet = props.addressSheet
  const addressCell = props.addressCell

  return (
    <Box component="div">
      <Box component="div">
        <Typography variant="caption">
          {addressSheet}
        </Typography>
        <Typography variant="subtitle2">
          {addressCell}
        </Typography>
      </Box>
      <Box component="div">
        C
      </Box>
    </Box>
  )
}

export default ElemSelection