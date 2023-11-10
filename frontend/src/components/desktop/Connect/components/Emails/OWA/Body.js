import React from 'react';
import CKEditor from 'ckeditor4-react';


const Body = ( props ) => {
    return (
        <div className="email_body">
            <CKEditor
              onBeforeLoad={ ( CKEDITOR ) => ( 
                  CKEDITOR.disableAutoInline = true ,
                  CKEDITOR.removePlugins = 'cloudservices'
                )}
                config={ {
                    toolbar: [
                        { name:"basicstyles", items:['Bold','Italic','Strike','-','RemoveFormat'] },
                        { name:"links", items:['Link',"Unlink",'Anchor'] },
                        // { name:"styles", items:['Styles','Format'] },
                        { name:'insert', items:['Image'] },
                        { name:'paragraph', items:["NumberedList","BulletedList","-","Indent", "-", "Blockquote"] }
                    ],
                    width:'100%',
                    height:'250'
                } }
              data={props.body}
              type="classic"
              onChange={ props.onChange }
            />
        </div>
    )
}

export default Body
