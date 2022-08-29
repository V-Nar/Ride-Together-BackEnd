const router = require('express').Router();
const User = require('../models/User.model');
const Event = require('../models/Event.model');
const { isAuthenticated } = require('../middleware/middleware')
/** 
 * all routes are prefix by /api/event
*/

// event creation
router.post('/newEvent', isAuthenticated, async (req, res, next) => {
    const { title, date , city } = req.body;
    Date.now()
    try {
        const newEvent = await Event.create(
            {
                title,
                date,
                city,
                promoter: req.user.id
            }
        )
        res.status(201).json({newEvent})
    } catch(error){
        next(error)
    }
})

// event calling


router.get('/event-list', async (req, res, next) => {
    const city = req.query.city
    
    try {
        if(city) {
            const cityEvents = await Event.find({ city })
            return res.json({ cityEvents })
        }
        res.json(await Event.find())
    } catch (error) {
        next(error);
    }
});



module.exports = router;