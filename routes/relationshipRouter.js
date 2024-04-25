const express = require("express");
const User = require('../models/user')
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send("Relationship Route success");
})
router.get('/all',async(req,res)=>{
    try{
        const users = await User.find()
        res.status(200).send({
            status:"success",
            data: users
        })
    }catch(error){
        res.status(400).send({
            status:"false",
            error
        })
    }
})

router.post('/owner',async(req,res)=>{
    //console.log(req.body)
    try{
        const owner = await User.find({name:req.body.name,email:req.body.email})
        res.status(200).send({
            status:"success",
            data:owner
        })
    }catch(error){
        res.status(400).send({
            status:"false",
            error
        })
    }
})

// 新增好友
router.patch('/addFriend/:id',async(req,res)=>{
    // 對方的id
    const id = req.params.id
    const data = req.body // 自己的資料
    console.log(data)
    try{
        const updateFriend = await User.findByIdAndUpdate(id,{
                friends:[{
                    id:data.id,
                    name:data.name,
                    status:data.status
                }]
            }
        )
        res.status(200).send({
            status:"success",
            data:updateFriend
        })
    }catch(error){
        res.status(400).send(
            {
                ststus:"False",
                error
            }
        )
    }
})
// 確認好友
router.patch('/confirm/:id',async(req,res)=>{
    // 自己的id
    const id = req.params.id
    const data = req.body //對方的id
    console.log(data)
    try{
        const updateFriendStatus = await User.updateOne({_id:id,'friends.id':data.id},{
            $set:{
                'friends.$.status':true
            }
        })
        const updateOppoent = await User.updateOne({_id:data.id},{
            friends:[{
                id:id,
                name:data.myName,
                status:true
            }]
        })
        res.status(200).send({
            status:"success",
            data:updateFriendStatus
        })
    }catch(error){
        res.status(400).send({
            status:"false",
            error
        })
    }
})
module.exports = router