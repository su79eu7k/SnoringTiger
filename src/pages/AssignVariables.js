import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import VariableCard from '../components/VariableCard'
import _ from 'lodash'
import { useLocation } from 'react-router-dom';

export default function AssignVariables(props) {
  const location = useLocation()
  console.log('+++++++++++++++++++++++++++++++++++++++')
  console.log(location)
  console.log('+++++++++++++++++++++++++++++++++++++++')

  return (
    <>
      <Typography variant="h6">
        Assign Variables
      </Typography>
      {[...Array(_.reject(!_.isEmpty(location.state.assignedVars) ? location.state.assignedVars : props.assignedVars, { addressSheet: null, addressCell: null }).length + 1)].map(
        (v, i) => <VariableCard key={i.toString()} id={i.toString()} assignedVars={!_.isEmpty(location.state.assignedVars) ? location.state.assignedVars : props.assignedVars} setAssignedVars={props.setAssignedVars} />)}
    </>
  )
}
