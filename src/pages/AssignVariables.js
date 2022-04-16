import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import VariableCard from '../components/VariableCard'

export default function AssignVariables() {
  const [assignedVars, setAssignedVars] = useState({})

  return (
    <>
      <Typography variant="h6">
        Assign Variables
      </Typography>
      {[...Array(Object.keys(assignedVars).length + 1).keys()].map((k) => <VariableCard key={k} setAssignedVars={setAssignedVars} />)}
    </>
  )
}
