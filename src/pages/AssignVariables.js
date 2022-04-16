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
      {console.log([...Array(Object.keys(assignedVars).length + 1)])}
      {[...Array(Object.keys(assignedVars).length + 1)].map((v, i) => <VariableCard key={i} id={i} assignedVars={assignedVars} setAssignedVars={setAssignedVars} />)}
    </>
  )
}
