const cron = require('node-cron');
const Event = require('../models/Event.model')

cron.schedule('0 0 0 * * *', async () => {
    const now = new Date();
    try {
        const eventsToUpdate = await Event.updateMany(
            {date: {$lt: now}, isFinished: false},
            {isFinished: true}
            )
            console.log('Database is up to date!')
    } catch (error) {
        console.error(error)
    }  
},
{
   scheduled: true,
   timezone: "Europe/Paris" 
});

