import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

export default function ResponsiveDialog( props ) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <Button variant="contained" color="primary" onClick={props.onModalToggler(true)}>
        Add Events
      </Button>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={ true }
        open={props.state.eventModal}
        onClose={() => console.log("CAnnot close from here")}
        maxWidth={ "sm" }
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Create New Events"}</DialogTitle>
        <DialogContent>
          {
              props.children
          }
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onModalToggler( false )} color="primary">
            Cancel
          </Button>
          <Button onClick={props.onSaveHandler} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
