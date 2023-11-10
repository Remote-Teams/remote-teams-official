import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
    inputField:{
        fontSize:"20px"
    }
  },
}));

export default function BasicTextFields( props ) {
  const classes = useStyles();

  return (
    <TextField
        error={ props.error }
        fullWidth={ true }
        size={"medium"}
        name={ props.name }
        onChange={ props.onChange }
        label={ props.label }
        value={ props.value }
        placeholder={ props.placeholder }
        helperText={ props.helperText }
        required={props.required }
        {...props}
/>
  );
}
