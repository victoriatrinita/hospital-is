const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const confiq=require('../config/config').get(process.env.NODE_ENV);
const salt=10;

const uri = process.env.DB_URI

const userSchema=mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        maxlength: 100
    },
    lastname:{
        type: String,
        required: true,
        maxlength: 100
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type:String,
        required: true,
        minlength:8
    },
    password2:{
        type:String,
        required: true,
        minlength:8

    },
    token:{
        type: String
    }
});

userSchema.methods.comparepassword=function(password,cb){
    bcrypt.compare(password,this.password,function(err,isMatch){
        if(err) return cb(next);
        cb(null,isMatch);
    });
}

// generate token
userSchema.methods.generateToken=function(cb){
    var user =this;
    var token=jwt.sign(user._id.toHexString(),confiq.SECRET);

    user.token=token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

// find by token
userSchema.statics.findByToken=function(token,cb){
    var user=this;

    jwt.verify(token,confiq.SECRET,function(err,decode){
        user.findOne({"_id": decode, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
};

//delete token
userSchema.methods.deleteToken=function(token,cb){
    var user=this;

    user.update({$unset : {token :1}},function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

const User = mongoose.model(
    'User',
    userSchema,
    'Users'
)
mongoose.connect(
    uri,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false},
    function(error) { if (error) console.log("Error!" + error); }
);

userSchema.pre('save',function(next){
    var user=this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(salt,function(err,salt){
            if(err)return next(err);

            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password=hash;
                user.password2=hash;
                next();
            })

        })
    }
    else{
        next();
    }
});

module.exports = function (req, res) {
  if (req.method === 'GET') {
    Person.find()
        .then(people => {
            res.status(200).json(people);
        })
        .catch((error) => res.status(500).json(error.message))
  } else if (req.method === 'POST') {
    const newPerson = new Person(req.body);
    newPerson.save()
        .then(newPerson => {
            res.status(200).json(newPerson)
        })
        .catch((error) => res.status(500).json(error.message))
  } else if (req.method === 'PUT') {
//     const {person, _id} = req.body;
//     Person.findByIdAndUpdate(_id, person, {returnOriginal: false})
//         .then(updatedPerson => {
//             res.status(200).json(updatedPerson)
//         })
//         .catch((error) => res.status(500).json(error.message))
  } else if (req.method === 'DELETE') {
//     const {_id} = req.body;
//     Person.findByIdAndDelete(_id)
//         .then(deletedPerson => {
//             res.status(200).json(deletedPerson)
//         }).catch((error) => res.status(500).json(error.message))
    }
};

// mongodb+srv://admin:<password>@hospital-is.kru3j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
