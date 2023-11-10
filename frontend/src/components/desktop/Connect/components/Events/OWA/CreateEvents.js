import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { create_new_events } from '../../../store/actions/eventAction';
import WrapperComponent from './WrapperComponent';
import TextInput from '../../Contacts/ReusableComponent/TextInput';
import mtimeZone from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export class CreateEvents extends Component {
    constructor(){
        super();
        this.state = {
            eventModal:false,
            summary: "",
            description: "",
            location:"",
            start:{ 
                dateTime:new Date().toISOString(),
                timeZone:mtimeZone.tz.guess(true)
             },
            end:{ 
                dateTime:new Date().toISOString(),
                timeZone:mtimeZone.tz.guess(true)
            },
            attendees:[{ email:"" }]
        }
    }

    onClose = e => {
        this.setState({
            eventModal:false,
            summary: "",
            description: "",
            location:"",
            start:{ 
                dateTime:new Date().toISOString(),
                timeZone:mtimeZone.tz.guess(true)
             },
            end:{ 
                dateTime:new Date().toISOString(),
                timeZone:mtimeZone.tz.guess(true)
            },
            attendees:[{ email:"" }]
        })
    }

    onModalToggler = value => e => {
        if( value == false ){
            this.onClose();
        }
        this.setState({
            eventModal:value
        });
    }
    onDateTimeChangeHandler = ( type, name ) => e => {
        let fulldate = e.toISOString();
        let newdate = fulldate.split("T")[0];
        let newtime = fulldate.split("T")[1];
        let obj = this.state[name];
        if( type === "date" ){
            obj.dateTime = obj.dateTime.replace( obj.dateTime.split("T")[0],newdate);
        } else {
            // time
            obj.dateTime = obj.dateTime.replace( obj.dateTime.split("T")[1],newtime);
        }
        console.log( mtimeZone.tz.guess(true) );
        this.setState({
            [name]:obj
        });
    }
    onSaveHandler = e => {
        console.log( this.props.connectappAuth.active_accounts[0].integrated_email ); 
        let formData = {
            subject:this.state.summary,
            body: {
                contentType: "TEXT",
                "content": this.state.description
              },
            start:this.state.start,
            end:this.state.end,
            location:{
                "displayName":this.state.location
            },
            "attendees": [{ "emailAddress": { "address":this.props.connectappAuth.active_accounts[0].integrated_email , "name": this.props.connectappAuth.active_accounts[0].integrated_email  }, "type": "required" }]
        }
        this.onClose();
        this.props.create_new_events( formData );
    }
    onChangeHandler = e => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    localProps = {
        onModalToggler:this.onModalToggler,
        onSaveHandler:this.onSaveHandler,
        onDateTimeChangeHandler:this.onDateTimeChangeHandler,
        onChangeHandler:this.onChangeHandler
    }
    render() {
        this.localProps.state = this.state;
        return (
            <div>
                <WrapperComponent  { ...this.localProps }>
                    <div className="form_group_main_container">
                        <BasicInformation   { ...this.localProps }/>
                        <DateTimePicker   { ...this.localProps }/>
                    </div>
                </WrapperComponent>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    connectappAuth : state.connectapp.auth,
    connectappEvent:state.connectapp.event,
});

export default connect( mapStateToProps, {
    create_new_events
})( withRouter( CreateEvents ) );


export const BasicInformation = ( props ) => {
    return (
        <>
        <div className="form_group_row mb-1">
            <div className="icon_events">
                <i className="fa fa-calendar-o fa-2x" aria-hidden="true"></i>
            </div>
            <div className="events_input">
                <TextInput name="summary" value={ props.state.summary } onChange={ props.onChangeHandler } placeholder="Event Name" label="Event Name" required={ true } />
            </div>
        </div>
        <div className="form_group_row mb-1">
            <div className="icon_events">
                <i className="fa fa-file-text fa-2x" aria-hidden="true"></i>
            </div>
            <div className="events_input">
                <TextInput label="Description" name="description" value={ props.state.description } onChange={ props.onChangeHandler } placeholder="Description" label="Description" required={ true }  multiline={ true } rows={ 4 } />
            </div>
        </div>
        <div className="form_group_row mb-1">
            <div className="icon_events">
                <i className="fa fa-map-marker fa-2x" aria-hidden="true"></i>
            </div>
            <div className="events_input">
                <TextInput label="Location"  name="location" value={ props.state.location } onChange={ props.onChangeHandler } placeholder="Location" required={ true }  />
            </div>
        </div>
    </>
    )
}

export const DateTimePicker = ( props ) => {
    let startDateTime = props.state.start.dateTime;
    let endDateTime = props.state.end.dateTime;
    // const startDateValue = 
    // const starteTimeValue = props.state.start.da
    return (
        <>
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className="form_group_row">
                <div className="icon_events">
                    <i className="fa fa-clock-o fa-2x" aria-hidden="true"></i>
                </div>
                <div className="time_events">
                <KeyboardDatePicker
                    fullWidth={ true }
                    format="MMMM Do YYYY"
                    margin="normal"
                    name="start"
                    label="Start Date"
                    value={startDateTime}
                    onChange={props.onDateTimeChangeHandler('date','start')}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                </div>
                <div className="time_events">
                <KeyboardTimePicker
                fullWidth={ true }
                    margin="normal"
                    name="start"
                    label="Time picker"
                    value={ startDateTime }
                    onChange={props.onDateTimeChangeHandler('time','start')}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
                </div>
            </div>
            <div className="form_group_row">
                <div className="icon_events">
                    <i className="fa fa-clock-o fa-2x" aria-hidden="true"></i>
                </div>
                <div className="time_events">
                <KeyboardDatePicker
                fullWidth={ true }
                    disableToolbar
                    variant="inline"
                    format="MMMM Do YYYY"
                    margin="normal"
                    name="end"
                    label="End Date"
                    value={endDateTime}
                    onChange={props.onDateTimeChangeHandler('date','end')}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                </div>
                <div className="time_events">
                <KeyboardTimePicker
                fullWidth={ true }
                    margin="normal"
                    label="End Time"
                    name="end"
                    value={endDateTime}
                    onChange={props.onDateTimeChangeHandler('time','end')}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
                </div>
            </div>
        </MuiPickersUtilsProvider>
        </>
    )
}