import React from 'react'

const DisplayContacts = (props) => {
    let contacts = [];
    if( props.connectappContact.all_contacts.value ){
        contacts = props.connectappContact.all_contacts.value
    }
    return (
        <div className="display_contacts_main_container">
            <div className="display_table_head">
                <div className="theads" style={{ width:"10%", justifyContent:"center" }}>#</div>
                <div className="theads" style={{ width:"30%" , justifyContent:"center" }}>Name</div>
                <div className="theads" style={{ width:"30%" , justifyContent:"center" }}>Email address</div>
                <div className="theads" style={{ width:"20%" , justifyContent:"center" }}>Phone</div>
                <div className="theads" style={{ width:"10%" }}>-</div>
            </div>
            <div className="display_table_data_container">
            {
                contacts.map( ( data, index ) => (
                    <div key={ index } className="display_table_data">
                        <div className="tbodys" style={{ width:"10%", justifyContent:"center" }}>
                            <div style={{ display:"flex", height:'40px', width:'40px', borderRadius:'50%', backgroundColor:"grey", justifyContent:'center', alignItems:"center" }} ><i className="fa fa-user fa-2x" aria-hidden="true"></i></div>
                        </div>
                        <div className="tbodys" style={{ width:"30%" }}>{ data.displayName }</div>
                        <div className="tbodys" style={{ width:"30%" }}>{ data.emailAddresses[0] ? data.emailAddresses[0].address : "" }</div>
                        <div className="tbodys" style={{ width:"20%" }}>{ data.mobilePhone ? data.mobilePhone : ""  }</div>
                        <div className="tbodys" style={{ width:"10%" }}>
                            <div className="edit_cion" onClick={ props.onEdit( data ) }><i className="fa fa-pencil fa-lg" aria-hidden="true"></i></div>
                            <div className="edit_cion" onClick={ props.onDelete( data ) }><i className="fa fa-trash fa-lg" aria-hidden="true"></i></div>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default DisplayContacts
