const MongoClient = require('mongodb').MongoClient;
const live_url = 'mongodb://remoteTeamsAdmin:YpEtGvP45x@139.59.77.44:9000?authSource=admin&authMechanism=SCRAM-SHA-1';
const dbName = 'remoteTeams_master';
const url = 'mongodb://localhost:27017';
const roles = require('../config/ootbRoles.json');
const _ = require('lodash');

MongoClient.connect( url, async function( err, client ){
    try{
        const adminDb = client.db(dbName).admin();
        let allDBS = await adminDb.listDatabases();
        let allDatabase = allDBS.databases;
        allDatabase.forEach( async element => {
            if(element.name!="admin" && element.name!="local" && element.name!="config" && element.name !== "remoteTeams_master" && element.name !== "remoteTeamsadmin" ){
                try{
                    let selectDBCollections = await client.db( element.name ).collection('roles').find().toArray();
                    let i = 0;
                    while( i < selectDBCollections.length ){
                        
                    }
                    console.log( selectDBCollections );
                } catch ( err ){
                    console.log( err );
                }
            }
        });
        client.close();
    } catch ( err ){
        console.log( err );
    }
})
