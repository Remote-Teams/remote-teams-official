const MongoClient = require('mongodb').MongoClient;
const live_url = 'mongodb://remoteTeamsAdmin:YpEtGvP45x@139.59.77.44:9000?authSource=admin&authMechanism=SCRAM-SHA-1';
const dbName = 'remoteTeams_master';
const url = 'mongodb://localhost:27017';

MongoClient.connect( url,{ useUnifiedTopology: true }, async function( err, client ){
    try{
        // GET THE LIST OF ALL THE ORGANISATIONS 
        const masterDb = client.db( dbName );
        let allOrganisations = await masterDb.collection('organizations').find().toArray();
        // ITERATE THROUGHT EACH ORGANISATION ON DB LEVEL
        allOrganisations.forEach( async ( elem, index ) => {
            try{
                const workspaceId = elem.workspaceId;
                if( workspaceId !== "remoteTeamsadmin"  ){
                    let tenantDb = client.db( workspaceId );
                    let today = new Date();
                    let updateAllDueTasks = await tenantDb.collection('tasks').updateMany({ "endDate": { "$lt" : today }, "status":{ $ne:"COMPLETED" }},{ $set: { "status":"PENDING" } });
                }
            } catch ( err ){
                console.log(err);
                client.close();
            }
        })
        // CHECK THEIR INVOICES FOR 
        // UPDATE THE DATABASE
        client.close();
    } catch ( err ){
        client.close();
        console.log( err );
    }
});