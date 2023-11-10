import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withRouter } from 'react-router-dom';
import Emails from '../Emails/Email';
import Contacts from '../Contacts/Contacts';
import Events from '../Events/Events';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,

  },
  tabsroot:{
      flexGrow:4,
      color:"grey",
      fontFamily:'Poppins-Medium',
      fontSize:"20px"
  },
  menuButton:{
      backgroundColor:"grey"
  },
  approot:{
    backgroundColor:"white"
  }
}));

function SimpleTabs( props ) {
  const classes = useStyles();
  let init_value = 0;
  if( localStorage.getItem('tabvalue') ){
    init_value = parseInt(localStorage.getItem('tabvalue'));
  }
  const [value, setValue] = React.useState(init_value);
  const handleChange = (event, newValue) => {
    localStorage.setItem('tabvalue',newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar className={ classes.approot } position="static">

        <Toolbar>
        <Tabs className={classes.tabsroot} value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Emails" {...a11yProps(0)} />
          <Tab label="Contacts" {...a11yProps(1)} />
          <Tab label="Events" {...a11yProps(2)} />
        </Tabs>
            <IconButton edge="start" onClick={() => props.history.push('/mailbox/setting')} className={classes.menuButton} color="inherit" aria-label="menu">
                <AccountCircle />
            </IconButton>
        </Toolbar>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Emails/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Contacts/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Events/>
      </TabPanel>
    </div>
  );
}

export default ( withRouter( SimpleTabs ) );

