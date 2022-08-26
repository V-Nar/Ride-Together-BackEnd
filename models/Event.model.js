const { Schema, model } = require('mongoose');
const User = require('./User.model');

const eventSchema = new Schema (
    {
        title: {
            type: Schema.Types.String,
            required: true,
            maxlength: 50,
        },
        date: {
            type: Schema.Types.Date,
            required: true,
        },
        city: {
            type: Schema.Types.String,
            required: true,
            // temp enum while Google Places API not implemented
            enum: ['Lille', 'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nantes'],
        },
        promoter: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        attendees: {
            type: [Schema.Types.ObjectId],
            ref: 'User'
        },
    },
    {
        timestamps: true,
    }
);

const Event = model('Event', eventSchema);

module.exports = Event;
