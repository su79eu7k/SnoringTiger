import { useState } from 'react'
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function BasicCard() {
  const [values, setValues] = useState({
    sheet: "Sheet1",
    cell: "A35",
    start: "",
    end: "",
    step: "",
  })

  const handleChange = (e) => {
    setValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          {values.sheet}
        </Typography>
        <Typography variant="h5" component="div">
        {values.cell}
        </Typography>
        <Stack spacing={2} direction="row">
        <FormControl size='small'>
          <InputLabel htmlFor="component-outlined">Start</InputLabel>
          <OutlinedInput
            id="component-outlined-start"
            name="start"
            onChange={handleChange}
            label="Start"
            value={values.start}
          />
        </FormControl>
        <FormControl size='small'>
          <InputLabel htmlFor="component-outlined">End</InputLabel>
          <OutlinedInput
            id="component-outlined-end"
            name="end"
            onChange={handleChange}
            label="End"
            value={values.end}
          />
        </FormControl>
        <FormControl size='small'>
          <InputLabel htmlFor="component-outlined">Step</InputLabel>
          <OutlinedInput
            id="component-outlined-step"
            name="step"
            onChange={handleChange}
            label="Step"
            value={values.step}
          />
        </FormControl>
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small">Advanced</Button>
      </CardActions>
    </Card>
  );
}
