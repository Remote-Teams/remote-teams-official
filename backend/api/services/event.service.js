var eventModel = require("../models/event.model");
const EventSource = require('../../common/constants/EventSource');

var eventService = {
    addEvent: addEvent,
    deleteEvent: deleteEvent,
    generateId: generateId,
    exist: exist
}

function generateId(eventData) {
    return eventData.account_id +
        eventData.event +
        eventData.payload.subscription.entity.id +
        eventData.created_at;
}

function addEvent(eventData) {
    const event = {
        eventId: generateId(eventData),
        eventSource: EventSource.RAZOR_PAY,
        eventPayload: eventData
    };

    return new Promise((resolve, reject) => {
        eventModel.create(event).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
}

function deleteEvent(id) {
    return new Promise((resolve, reject) => {
        eventModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function exist(eventData) {
    return new Promise((resolve, reject) => {
        const eventId = generateId(eventData);

        eventModel.searchOne({ 'eventId': eventId }).then((data) => {
            if (data) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = eventService;

