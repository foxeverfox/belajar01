const express  = require('express')
const router = express.Router()
const { check , validationResult} = require('express-validator')
const auth = require('../../middleware/auth')

const Post = require('../../models/Post')
const User = require('../../models/Users')
const Profile = require('../../models/Profiles')



router.post('/' , [auth, [
check('text','Text required').not().isEmpty() 
]
], async (req,res) =>  {
    const errors = validationResult(req)
    console.log('check error')
    if (!errors.isEmpty() ) {
        return res.status(400).json ({error:errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text : req.body.text ,
            name: user.name,
            avatar: user.avatar ,
            user: req.user.id

        })

        const post = await newPost.save()
        res.json(post)

        
    } catch (error) {

        res.send(400).json({msg:error.message})
        
    }
});





router.get('/', auth, async (req,res)=> {
    try {
        const allpost = await Post.find().sort({date: -1 }).populate('user', ['name', 'avatar'])
        res.json(allpost)
    
    } catch (error) {
        console.error(error.message)
        res.status(400).send('Server Error')
    }}
)




router.get('/mypost', auth, async (req,res)=> {
        try {
            const allpost = await Post.find({user: req.user.id}).populate('user', ['name', 'avatar'])
            res.json(allpost)
        
        } catch (error) {
            console.error(error.message)
            res.status(400).send('Server Error')
        }})










    router.get('/:id', auth, async (req,res)=> {
        try {
            const post = await Post.findById(req.params.id)
            res.json(post)
            
            } catch (error) {
                console.error(error.message)
        
                if (error.kind == "ObjectId") {
                    return res.status(400).json({ msg: 'Parameter not Object ID' })
                }
                res.status(400).send('Server Error')
            }}
    )
        
    router.delete('/:id', [auth,[
        check('email','Email wajib').not().isEmpty()
    ]], async (req,res)=> {
        try {
            const post = await Post.findOne(req.body.email)

            if (!post){
                return res.status(500).json({err:'Post tidak ada'})
            }
            if (req.user.id !== post.user.toString() ) {
                return res.status(401).json({err:'User error'})
            }

            await post.remove()
            res.status(200).send('Deleted')
            
            } catch (error) {
              console.error(error.message)
                if (error.kind == "ObjectId") {
                      return res.status(400).json({ msg: 'Parameter not Object ID' })
                    }
                    res.status(400).send('Server Error')
                }}
    )    
        
module.exports =  router