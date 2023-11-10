const MongoClient = require('mongodb').MongoClient;
const live_url = 'mongodb://dominateAdmin:YpEtGvP45x@139.59.77.44:9000?authSource=admin&authMechanism=SCRAM-SHA-1';
const dbName = 'dominate_master';
const url = 'mongodb://localhost:27017';

MongoClient.connect( url, async function( err, client ){
    try{
        // DOMINATE_MASTER
        const masterDb = client.db( dbName );
        const adminDb = client.db(dbName).admin();
        let allOrganisations = await masterDb.collection('organizations').find().toArray();
        console.log( allOrganisations );
        // ITERATE THROUGH EACH ORGANISATION AND DELETE
        let allOrganisationArray = [];
        allOrganisations.forEach( async elem => {
            try{
                const workspaceName = elem.workspaceId;
                if( workspaceName !== "dominateadmin" && workspaceName !== "dominate_master" ){
                    let deleteOrganisation = await masterDb.collection('organizations').findOneAndDelete({ workspaceId: workspaceName});
                    if( deleteOrganisation ){
                        allOrganisationArray.push( workspaceName );
                        console.log("Deleted Organisation", workspaceName);
                    }
                }
            } catch ( errr ){
                console.log( errr );
            }
        });
        // DELETE ALL THE DATABASE
        let allDBS = await adminDb.listDatabases();
        let allDatabase = allDBS.databases;
        console.log( allDatabase );
        allDatabase.forEach( async element => {
            if(element.name!="admin" && element.name!="local" && element.name!="config" && element.name !== "dominate_master" && element.name !== "dominateadmin" ){
                try{
                    let deleteOrg = await client.db( element.name ).dropDatabase();
                    if( deleteOrg ){
                        client.close();
                    }
                } catch( err ){
                    console.log( err );
                }
            }
        });
        client.close();
    } catch ( err ){
        console.log( err );
    }
})