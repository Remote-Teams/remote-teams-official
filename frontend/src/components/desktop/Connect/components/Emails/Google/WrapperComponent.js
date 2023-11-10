import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog( props ) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>{
        props.name === "createEmails"  ? 
        <Button variant="outlined" color="primary" onClick={props.onModalToggler( true )}>
            Compose Email
        </Button>
        : null
    }
      <Dialog fullScreen open={props.emailModal} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.onModalToggler( false )} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Compose  Email
            </Typography>
            {
              !props.showSave ?
                 <Button autoFocus variant="outlined" color="inherit" onClick={ props.onSaveHandler }>
                  Save and close
                </Button>
                : null
            }
            &emsp;
            <Button autoFocus variant="outlined" color="inherit" onClick={ props.onSendHandler }>
              Send
            </Button>
          </Toolbar>
        </AppBar>
        {
            props.children
        }
      </Dialog>
    </div>
  );
}
