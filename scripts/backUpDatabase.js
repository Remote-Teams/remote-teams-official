const MongoClient = require('mongodb').MongoClient;
const live_url = 'mongodb://dominateAdmin:YpEtGvP45x@139.59.77.44:9000?authSource=admin&authMechanism=SCRAM-SHA-1';
const dbName = 'dominate_master';
const url = 'mongodb://localhost:27017';
const fs = require('fs');


MongoClient.connect( live_url, async function( err, client ){
    try{
        const adminDb = client.db(dbName).admin();
        let allDBS = await adminDb.listDatabases();
        let allDatabase = allDBS.databases;

        let jsonData = {};
        let i = 0 ;
        while ( i < allDatabase.length ){
            const db = allDatabase[i];
            if(db.name!="admin" && db.name!="local" && db.name!="config"){
                const dbcon = client.db( db.name );
                const allCollections = await dbcon.listCollections().toArray();
                var dbJSON = {};
                let j = 0;
                while( j < allCollections.length ){
                    const collect = allCollections[j];
                    let collectionList = collect.name;
                    console.log( collectionList );
                    let collectionS = await dbcon.collection(collectionList).find().toArray();
                    var JSONData = JSON.parse( JSON.stringify( collectionS ) );
                    dbJSON[collectionList] = JSONData;
                    j++;
                }
                jsonData[ db.name ] = dbJSON;
            }
            i++;
        }

        console.log( jsonData ); 
        fs.writeFile ("input.json", JSON.stringify(jsonData), function(err) {
            if (err) throw err;
            console.log('complete');
            }
        );


    } catch( err ){
        console.log( err );
    }
});