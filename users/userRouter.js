const express = require('express');
const db = require('./userDb');
const router = express.Router();

function validateUserId(req, res, next) {
    if(req.params.id){
        console.log("Enteres middleWare!!")
        
        db.getById(req.params.id)
            .then( user => {
                if(!user.name){
                    res.status(400).json({ message: "invalid user id"})
                } else {
                    req.user = user
                    next();
                }
            })
            .catch(err => {
                res.status(400).json({ message: "invalid user id" })
            })
    } else{
        next()
    }

};

function validateUser(req, res, next) {
    if(!req.body){
        res.status(400).json({ message: "missing user data"})
    } else {
        if(!req.body.name){
            res.status(400).json({message: "missing required name field"})
        } else{
            next()
        }
    }
};


router.post('/',validateUser, (req, res) => {
    const newUser = req.body;
    !newUser.name ? 
    (res.status(400).json({errorMessage: "Error 400, must only send a name"}))
    :
    ( db.insert(newUser)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({errorMessage: "ERROR CODE 500!"})
        }) )
});

router.post('/:id/posts',validateUserId,validateUser, (req, res) => {
    const { id } = req.params;
    const newPost = req.body;
    !newPost.text ? 
    (res.status(400).json({errorMessage: "Error 400, must only send a name"})) 
    : 
    (db.getUserPosts(id)
        .then(posts => {
            posts.push(newPost);
            res.status(201).json(posts)
        })
        .catch(err => {
            res.status(500).json({errorMessage: "ERROR CODE 500!"})
        })
    )
});

router.get('/', (req, res) => {
    db.get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({errorMessage: "ERROR CODE 500!"})
        })
});

router.get('/:id',validateUserId, (req, res) => {
    const id = req.params.id
    db.getById(id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({errorMessage: "ERROR CODE 500!"})
        })
});

router.get('/:id/posts',validateUserId, (req, res) => {
    db.getUserPosts(req.params.id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({errorMessage: "ERROR CODE 500!"})
        })
});

router.delete('/:id',validateUserId, (req, res) => {
    db.remove(req.params.id)
        .then(user => {
            res.status(204).send("deleted")
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({errorMessage: "ERROR CODE 500! Server Error"})
        })
});

router.put('/:id', (req, res) => {
    const newUser = req.body;
    const { id } = req.params
    !newUser.name ? 
    (res.status(400).json({errorMessage: "Error 400, must only send a name"}))
    :
    ( db.update(id,newUser)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({errorMessage: "ERROR CODE 500!"})
        }) )
});

//custom middleware

function validateUser(req, res, next) {
    if(!req.body){
        res.status(400).json({ message: "missing user data"})
    } else {
        if(!req.body.name){
            res.status(400).json({message: "missing required name field"})
        } else{
            next
        }
    }
};

function validatePost(req, res, next) {
    if(!req.body){
        res.status(400).json({ message: "missing post data"})
    } else {
        if(!req.body.text){
            res.status(400).json({message: "missing required text field"})
        } else{
            next()
        }
    }
};

module.exports = router;
