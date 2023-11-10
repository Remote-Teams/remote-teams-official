use remoteTeams_master;
db.organizations.drop();
db.createCollection("organizations");
db.organizations.ensureIndex({ "workspaceId": 1 }, { unique: true });
db.organizations.ensureIndex({ "billingId": 1 }, { unique: true });
remoteTeamsadmin = {
	_id:'c5bdfd84-217f-11e9-ab14-d663bd873d93',
	organizationName: 'Remote Teams Internal Admin',
	workspaceId: 'remoteTeamsadmin',
	workspaceUrl: 'remote-teams.io',
	billingId: '46c7d61c-2215-11e9-ab14-d663bd873d93',
	billingType: 'INTERNAL',
	organizationType: 'INTERNAL',
	status: 'ACTIVE',
	createdBy: 'init script',
	lastModifiedBy: 'init script',
	expirationDate : ISODate("2099-12-31T23:59:59.096Z"),
	defaultUserEmailId: 'remoteteamsadmin@remoteteams.io',
	createdAt: new Date(),
	updatedAt: new Date()
};

db.organizations.insert(remoteTeamsadmin);

use remoteTeamsadmin;
db.users.drop();
db.roles.drop();
db.createCollection("users");
db.createCollection("roles");


//role - superadmin
superAdminRole = {
	_id:'9e5b41de-217f-11e9-ab14-d663bd873d93',
	name :"SuperAdmin",
	status:"ACTIVE",
	permissions:["*"],
	category:"SuperAdmin",
	createdBy: 'init script',
	lastModifiedBy: 'init script',
	createdAt: new Date(),
	updatedAt: new Date()
};

db.roles.insert(superAdminRole);

//user - 
superAdminUser = {
	_id:'bdcdc99c-217f-11e9-ab14-d663bd873d93',
	email :"remoteteamsadmin@remoteteams.io",
	status:"ACTIVE",
	password:"$2a$10$ff8xCRcNr4bfuct/BHmxLeNzm5kR7H.BtkHVNlNhbsQPEtMqSaaAm",
	role:'9e5b41de-217f-11e9-ab14-d663bd873d93',
	createdBy: 'init script',
	lastModifiedBy: 'init script',
	createdAt: new Date(),
	updatedAt: new Date()
};
//Password: 7u4Qu@F~j;?j4rxP

db.users.insert(superAdminUser);


//command: mongo < init_script.js