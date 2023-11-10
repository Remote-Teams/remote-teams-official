var faqModel = require("../models/faq.model");
var currentContext = require('../../common/currentContext');

var faqService = {
    getAllFaqs: getAllFaqs,
    getFaqById: getFaqById,
    addFaq: addFaq,
    updateFaq: updateFaq,
    deleteFaq: deleteFaq,
    getFaqByFaqName: getFaqByFaqName,
    getFaqsByPage: getFaqsByPage,
    getAllFaqsCount: getAllFaqsCount,
    getFaqsByPageWithSort: getFaqsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchFaqs: searchFaqs,
    textSearch: textSearch
}

function addFaq(faqData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        faqData.createdBy = user.email;
        faqData.lastModifiedBy = user.email;
        
        faqModel.create(faqData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}
function updateFaq(id, faqData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        faqData.lastModifiedBy = user.email;

        faqModel.updateById(id, faqData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteFaq(id) {
    return new Promise((resolve, reject) => {
        faqModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllFaqs() {
    return new Promise((resolve, reject) => {
        faqModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFaqById(id) {
    return new Promise((resolve, reject) => {
        faqModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFaqByFaqName(faqName, tenant) {
    return new Promise((resolve, reject) => {
        faqModel.searchOne({ 'faqName': faqName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllFaqsCount(query) {
    return new Promise((resolve, reject) => {
        faqModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFaqsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        faqModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFaqsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        faqModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        faqModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchFaqs(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        faqModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



function textSearch(text) {
    return new Promise((resolve, reject) => {
        faqModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



module.exports = faqService;

