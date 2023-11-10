let workspaceName = window.location.host.split(".")[0];
// console.log(workspaceName);

let stripeTestKey =
  "pk_test_51HmAm5FHfcG4tGd9aohTVm82AnYxKw99gt6MT15UgLAhwdqLAFf9dYmmqrSAHXa1KusgT2kpaof66piYsmXP821y00c3qGAgqo";

let straipeLiveKey =
  "pk_live_51HmAm5FHfcG4tGd9YVzI7auPaN9TYLy4CXf82en94LYae589k2JFgzODQHJPUkssTo4vKRT52SSGut3itBP0YCVL00tQFlrT30";

module.exports = {
  workspaceId:
    process.env.NODE_ENV === "development" ? "remotedemo10" : workspaceName,

  stripeApiKey:
    process.env.NODE_ENV === "development" ? stripeTestKey : stripeTestKey,

  url:
    process.env.NODE_ENV === "development"
      ? "https://login.remote-teams.io"
      : `https://${workspaceName}.remote-teams.io`,
};
//? "http://localhost:9010"

// database credentials
//

// Ip :159.89.165.123
// Port : 9002
// Username : qaremoteadmin
// Password :remote%40qaDominatee

/*==========================
  Superadmin Credentials
===========================*/

// workspaceId:"remoteTeamsadmin"
// "email":"remoteteamsadmin@remoteteams.io",
// "password":"7u4Qu@F~j;?j4rxP"
//
