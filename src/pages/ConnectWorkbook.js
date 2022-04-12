import React from 'react'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ConnectWorkbook() {
  return (
    <>
      <Typography variant="h6">
        Connect Workbook
      </Typography>
      <Stack spacing={2} direction="row">
        <Button variant="contained">Open File</Button>
        <Button variant="contained">Next</Button>
      </Stack>
    </>

  )
}
