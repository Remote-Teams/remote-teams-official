const MongoClient = require('mongodb').MongoClient;
const live_url = 'mongodb://dominateAdmin:YpEtGvP45x@139.59.77.44:9000?authSource=admin&authMechanism=SCRAM-SHA-1';
const dbName = 'dominate_master';
const url = 'mongodb://localhost:27017';

MongoClient.connect( url, async function( err, client ){
    try{
        // DOMINATE_MASTER
        const masterDb = client.db( dbName );
        const adminDb = client.db(dbName).admin();
        var deleteName = "kspjs";
        let deleteOrganisation = await masterDb.collection('organizations').findOneAndDelete({ workspaceId: deleteName});
        let deleteOrg = await client.db(deleteName).dropDatabase();
        console.log("deltered")
        client.close();
    } catch ( err ){
        console.log( err );
    }
})