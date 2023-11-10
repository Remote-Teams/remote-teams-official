const MongoClient = require('mongodb').MongoClient;
const live_url = 'mongodb://remoteTeamsAdmin:YpEtGvP45x@139.59.77.44:9000?authSource=admin&authMechanism=SCRAM-SHA-1';
const dbName = 'remoteTeams_master';
const url = 'mongodb://127.0.0.1:27017';

let invoiceDueDateJob = ()=>{
    return new Promise((resolve,reject)=>{
        MongoClient.connect( url,{ useUnifiedTopology: true }, async function( err, client ){
            try{
                const masterDb = client.db( dbName );
                let allOrganisations = await masterDb.collection('organizations').find().toArray();
                allOrganisations.forEach( async ( elem, index ) => {
                    try{
                        const workspaceId = elem.workspaceId;
                        if( workspaceId !== "remoteTeamsadmin"  ){
                            let tenantDb = client.db( workspaceId );
                            let today = new Date();
                            
                            await tenantDb.collection('invoices')
                                            .updateMany(
                                                {"due_date": { "$lt" : today }, "status":{"$nin":["PAID","OVERDUE"]}},
                                                {$set:{"status":"OVERDUE"}}
                                                );
                            
                        }
                    } catch ( err ){
                        console.log(err);
                        client.close();
                    }
                })
                client.close();
                return resolve();
            } catch ( err ){
                client.close();
                console.log( err );
                return reject(err);
            }
        });
    });
};



let expenseSubscriptionJob = ()=>{
    return new Promise((resolve,reject)=>{
        MongoClient.connect( url,{ useUnifiedTopology: true}, async function( err, client ){
            try{
                const masterDb = client.db( dbName );
                let allOrganisations = await masterDb.collection('organizations').find().toArray();
                allOrganisations.forEach( async ( elem, index ) => {
                    try{
                        const workspaceId = elem.workspaceId;
                        if( workspaceId !== "remoteTeamsadmin"  ){
                            let tenantDb = client.db( workspaceId );
                            let today = new Date();
                            
                            let expSubList = await tenantDb.collection('expensesubscriptions')
                                                            .find({"billingType":"MONTHLY","status":"ACTIVE"})
                                                            .toArray();
                            let list = [];
                            expSubList.forEach(async (each, i)=>{
                                list.push(expenseRequestMapping(each));
                            });
                            await tenantDb.collection('expenses').insertMany(list);
                            
                        }
                    } catch ( err ){
                        console.log(err);
                        client.close();
                    }
                })
                // client.close();
                return resolve();
            } catch ( err ){
                client.close();
                console.log( err );
                return reject(err);
            }
        });
    });
};

function expenseRequestMapping(obj){
    if(obj && Object.keys(obj).length){
        return {
            "expenseTitle": `${obj.name} ${obj.billingType.toLowerCase()} subscription`,
            "expenseType": "MISCELLANEOUS",
            "BillingType": "UNBILLABLE",
            "paynee_name": "" ,
            "payee_name": "",
            "expenseItems":[],
            "notes": "",
            "subTotal": `${obj.price}`,
            "totalTax": 0,
            "total": `${obj.price}`,
            "documents":[],
            "status": "APPROVED"
        }
    }
}

module.exports = {
    invoiceDueDateJob,
    expenseSubscriptionJob
}
