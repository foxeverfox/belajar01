const express  = require('express')
const router = express.Router() ;
const auth  = require('../../middleware/auth')
const User  = require('../../models/Users')

router.get('/' , auth,  async (req,res) =>  {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }
    catch (err)  {
        res.status(500).send('Keasalahan Server')
    }

 

});

module.exports =  router