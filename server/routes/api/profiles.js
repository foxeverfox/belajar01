const express  = require('express')
const router = express.Router() 
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profiles')
const User =  require('../../models/Users')
const {check , validationResult } = require('express-validator')





router.get('/me' ,auth, async (req,res) =>  {
    try {
        const profile = await Profile.findOne({user:req.user.id}).populate(
            'user',['name','avatar']
        )

        if (profile){
        res.status(200).json(profile) 
            }
        else {
            res.status(400).json({msg:'Tidak ada profile untuk user ini '})    
        }

    } 
    catch (err) {
        console.error(err.message)
        res.status(400).send('Server Error')
    }
 

})

router.post('/' ,auth, [auth ,[
                               check('status', 'Status is required').not().isEmpty() ,
                               check('skills', 'Skill is mandatory').not().isEmpty()
                              ]
        ],
        async (req,res) =>    { 
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array() })

            }


            const {company , 
                  website,
                  location ,
                  bio ,
                  status ,
                  githubusername ,
                  skills,
                  youtube ,
                  facebook,
                  twitter ,
                  linkedin ,
                  instagram 
            }= req.body

            const profileFields = {}

            profileFields.user = req.user.id
            if (company) profileFields.company = company
            if (website) profileFields.website = website
            if (location) profileFields.location = location
            if (bio) profileFields.bio = bio
            if (status) profileFields.status = status
            if (githubusername ) profileFields.githubusername  = githubusername 

            if ( skills) {
                profileFields.skills = skills.split(',').map(skill=> skill.trim() )
            }

            console.log(profileFields.skills)

            res.send('Sukses')

         }
        )
      
      
      




module.exports =  router