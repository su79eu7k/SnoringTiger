import React from 'react'
import Typography from '@mui/material/Typography';
import VariableCard from '../components/VariableCard'
import _ from 'lodash'

export default function AssignVariables(props) {
  return (
    <>
      <Typography variant="h6">
        Assign Variables
      </Typography>
      {[...Array(_.reject(props.variables, { addressSheet: null, addressCell: null }).length + 1)].map(
        (v, i) => <VariableCard key={i.toString()} id={i.toString()} variables={props.variables} setVariables={props.setVariables} />)}
    </>
  )
}
