import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import VariableCard from '../components/VariableCard'
import _ from 'lodash'

export default function AssignVariables() {
  const [assignedVars, setAssignedVars] = useState({})

  return (
    <>
      <Typography variant="h6">
        Assign Variables
      </Typography>
      {[...Array(_.reject(assignedVars, { address: { sheet: null, cell: null } }).length + 1)].map((v, i) => <VariableCard key={i} id={i} assignedVars={assignedVars} setAssignedVars={setAssignedVars} />)}
    </>
  )
}
