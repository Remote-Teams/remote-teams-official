import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplyAllEmail from './SendOnlyReplyAllForwardReplyEmail';

const options = [
    "Reply",
    "Reply all",
    "Forward"
];

const ITEM_HEIGHT = 48;

export default function LongMenu( props ) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ replyAll, setReplyAll] = React.useState({});
  const [ forward, setForward ] = React.useState({});
  const [ reply, setreply ] = React.useState({});
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (value) => {
      if( value === "Reply all" ){
        setReplyAll( props.message );
        setForward( {} );
        setreply({});
      }
      if( value === "Forward" ){
        setForward( props.message );
        setReplyAll( {} );
        setreply({});
      }
      if( value === "Reply" ){
        setreply( props.message );
        setReplyAll( {} );
        setForward( {} );
      }
  }
  const onCloseModel = e => {
    setReplyAll({});
    setForward( {} );
    setreply({});
  }
  return (
    <div>
        { replyAll.id ?  <ReplyAllEmail  {...props} onCloseModel={ onCloseModel }  type="replyAll" editValue={ replyAll }/> : null }
        { forward.id ?  <ReplyAllEmail {...props} type="forward"   onCloseModel={ onCloseModel } editValue={ forward }/> : null }
        { reply.id ?  <ReplyAllEmail {...props} type="reply"  onCloseModel={ onCloseModel }  editValue={ reply }/> : null }
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} value={option} onClick={e => handleSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
