var currentContext = require('../../common/currentContext');
var emailService = require('./email.service');
const moment =  require('moment');
moment.locale('en');
const _ = require('lodash');

var graphService = {
    getEmailCountByTimestamp: getEmailCountByTimestamp
}


function getEmailCountByTimestamp(startDate, endDate){
    return new Promise((resolve,reject) => {
        emailService.groupByKeyAndCountDocumentsWithTimeframe('createdAt', startDate.toISOString(), endDate.toISOString()).then((data)=>{
            let ms = startDate;
            let me = endDate;
            let ss = moment([ms.year(), ms.month(), ms.date()]);
            let ee = moment([me.year(), me.month(), me.date()]);

            let totalDays = ee.diff(ss, 'days') + 1;

            console.log("diff:" +  totalDays);
            var response = {
                'x_axis':{
                    label:[]
                },
                'y_axis':{
                    label: "Email Sent",
                    data: []
                }
            };
            let currentDate = ms;
            for(let i = 0 ; i < totalDays; i++){
                let emailCount = _.find(data, function(o) { return new Date(o._id).getDay() == currentDate.format('D') ? o : undefined; });
                response['x_axis']['label'].push(currentDate.format('ddd'));
                if(emailCount){
                    response['y_axis']['data'].push(emailCount.count);
                }else{
                    response['y_axis']['data'].push(0);
                }
                currentDate.add(1, 'days');
            }
            resolve(response);
        }).catch((err)=>{
            reject(err);
        });
    });
}



module.exports = graphService;

