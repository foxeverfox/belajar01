const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profiles')
const User = require('../../models/Users')
const { check, validationResult } = require('express-validator')




//@route    GET api/profile/me
//@route    mendapatkan aktif  profile 
//@access   Publik

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user', ['name', 'avatar']
        )

        if (profile) {
            res.status(200).json(profile)
        }
        else {
            res.status(400).json({ msg: 'Tidak ada profile untuk user ini ' })
        }

    }
    catch (err) {
        console.error(err.message)
        res.status(400).send('Server Error')
    }


})


//@route    POST api/profile/
//@route    menambahkan profile pada user aktif
//@access   Private


router.post('/', auth, [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skill is mandatory').not().isEmpty()
]
],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })

        }


        const { company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            linkedin,
            instagram
        } = req.body

        const profileFields = {}

        profileFields.user = req.user.id
        if (company) profileFields.company = company
        if (website) profileFields.website = website
        if (location) profileFields.location = location
        if (bio) profileFields.bio = bio
        if (status) profileFields.status = status
        if (githubusername) profileFields.githubusername = githubusername

        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        try {

            let profile = await Profile.findOne({ user: req.user.id })

            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true })
                return res.json(profile)

            }

            profile = new Profile(profileFields)
            await profile.save();
            res.json(profile)



        }
        catch (err) {
            res.status(400).send('Server error')
        }



    }
)

//@route    GET api/profile/
//@route    mendapatkan semua  profile 
//@access   Publik

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)

    } catch (error) {
        console.error(error.message)

    }
})

//@route    GET api/profile/
//@route    mendapatkan spesifik profile bedasarkan user id
//@access   Publik

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        if (!profile) return res.status(400).json({ msg: 'Error!! Profile not found ' })



        res.json(profiles)

    } catch (error) {
        console.error(error.message)

        if (error.kind == "ObjectId") {
            return res.status(400).json({ msg: 'Parameter not Object ID' })
        }
        res.status(500).send("Server Error")
    }
})

//@route    DELETE api/profile/
//@route    hapus User dan Profile
//@access   Private

router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({ user: req.user.id })

        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: 'User Removed' })
    } catch (error) {
        console.error(error.message)

        if (error.kind == "ObjectId") {
            return res.status(400).json({ msg: 'Parameter not Object ID' })
        }
        res.status(500).json({ msg: error.message })
    }
})




// --------------------- Experience  -----------------------------------------


//@route    PUT api/profile/experience
//@route    menambahkan  experience ke profile
//@access   Private

router.put("/experience", [auth, [
    check('title', "Title is required").not().isEmpty(),
    check('company', "Company is required").not().isEmpty(),
    check('from', "From Date is required").not().isEmpty()]
], async (req, res) => {

    const { title, company, location, from, to, current, description } = req.body
    const newExp = {
        title, company, location, from, to, current, description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.experience.unshift(newExp);
        await profile.save()
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Error Server")

    }

})



//@route    DELETE api/profile/experience
//@route    delete spesifc experience from profile
//@access   Private


router.delete("/experience/:exp_id", auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const indexToRemove = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(indexToRemove, 1)
        await profile.save()
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Error Server')

    }
})




// --------------------- Education  -----------------------------------------


//@route    PUT api/profile/education
//@route    menambahkan  experience ke profile
//@access   Private

router.put("/experience", [auth, [
    check('title', "Title is required").not().isEmpty(),
    check('company', "Company is required").not().isEmpty(),
    check('from', "From Date is required").not().isEmpty()]
], async (req, res) => {

    const { title, company, location, from, to, current, description } = req.body
    const newExp = {
        title, company, location, from, to, current, description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.experience.unshift(newExp);
        await profile.save()
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Error Server")

    }

})



//@route    DELETE api/profile/experience
//@route    delete spesifc experience from profile
//@access   Private


router.delete("/experience/:exp_id", auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id })
        const indexToRemove = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(indexToRemove, 1)
        await profile.save()
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Error Server')

    }
})






















module.exports = router