import React, { useState } from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function ConnectWorkbook() {
  const [file, setFile] = useState()

  function handleChange(e) {
    setFile(e.target.files[0])
    e.target.value = ''
  }

  return (
    <>
      <Typography variant="h6">
        Connect Workbook
      </Typography>
      <Stack spacing={2} direction="row">
        <Button variant="contained" component="label">
          File
          <input type="file" onChange={handleChange} hidden />
        </Button>
        <Button
          component={Link}
          to="/assign_variables"
          variant="contained">Next</Button>
      </Stack>
    </>

  )
}
