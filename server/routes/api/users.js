const express  = require('express')
const router = express.Router() 
const {check , validationResult } = require('express-validator/check')
const User = require('../../models/Users')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')


router.post('/' , [
    check('email','Must be a valid email').isEmail(),
    check('name','Name cannot be empty').not().isEmpty() ,
    check('password','Password min Length 6').isLength({min:6})
] , 
async (req,res) =>  {
    const errors = validationResult(req)
    if (!errors.isEmpty() ) {
        return res.status(400).json({errors:errors.array()})
    }    


    const {name , email , password} = req.body    
    try  {

        console.log('1')

        let user = await User.findOne({email})
        if (user) {
            res.status(400).json({errors:[{msg:'User sudah ada'}]})
        }
        console.log('1b')

        const avatar = gravatar.url(email,{
            s:200,
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,email,avatar ,password
        })
        
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password,salt)
        
        await user.save()

        const payload = { 
            user: {
                id:user.id
            }
        }

        jwt.sign(payload  , 
            config.get('jwtSecret') ,
            { expiresIn:360000 } , 
            (err ,token ) =>{
                if (err) throw err ;
                res.json({token})
            } )


    }
    catch (err) {

    }
 

});

module.exports =  router;