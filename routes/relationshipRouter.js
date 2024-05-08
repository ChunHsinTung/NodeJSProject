const express = require("express");
const User = require("../models/user");
const Club = require("../models/club2");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Relationship Route success");
});

// 使用者登入
router.post("/owner", async (req, res) => {
  //console.log(req.body)
  try {
    const owner = await User.find({
      name: req.body.name,
      email: req.body.email,
    });
    res.status(200).send({
      status: "success",
      data: owner,
    });
  } catch (error) {
    res.status(400).send({
      status: "false",
      error,
    });
  }
});
// 查找所有使用者
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({
      status: "success",
      data: users,
    });
  } catch (error) {
    res.status(400).send({
      status: "false",
      error,
    });
  }
});
// 新增好友
router.patch("/addFriend/:id", async (req, res) => {
  // 對方的id
  const id = req.params.id;
  const data = req.body; // 自己的資料
  console.log(data);
  try {
    const updateFriend = await User.findByIdAndUpdate(id, {
      $push: {
        friends: {
          id: data.id,
          name: data.name,
          status: data.status,
        },
      },
      // friends:[{
      //     id:data.id,
      //     name:data.name,
      //     status:data.status
      // }]
    });
    res.status(200).send({
      status: "success",
      data: updateFriend,
    });
  } catch (error) {
    res.status(400).send({
      ststus: "False",
      error,
    });
  }
});
// 確認好友
router.patch("/confirm/:id", async (req, res) => {
  // 自己的id
  const id = req.params.id;
  const data = req.body; //對方的id
  console.log(data);
  try {
    const updateFriendStatus = await User.updateOne(
      { _id: id, "friends.id": data.id },
      {
        $set: {
          "friends.$.status": true,
        },
      }
    );
    const updateOppoent = await User.findByIdAndUpdate(data.id, {
      $push: {
        friends: {
          id: id,
          name: data.myName,
          status: true,
        },
      },
    });
    res.status(200).send({
      status: "success",
      data: updateFriendStatus,
    });
  } catch (error) {
    res.status(400).send({
      status: "false",
      error,
    });
  }
});
// 刪除好友
router.patch("/deleteFriend/:id", async (req, res) => {
  // 自己的id
  const id = req.params.id;
  const data = req.body; //對方的id
  try {
    const deleteMyFriend = await User.findByIdAndUpdate(id, {
      $pull: { friends: { id: data.id } },
    });
    const deleteMe = await User.findByIdAndUpdate(data.id, {
      $pull: { friends: { id: id } },
    });
    res.status(200).send({
      status: "success",
      deleteMyFriend,
    });
  } catch (error) {
    res.ststus(400).send({
      status: "false",
      error,
    });
  }
});
// 查找所有社團
router.get("/club/all", async (req, res) => {
    try {
      const clubs = await Club.find();
      res.status(200).send({
        status: "success",
        data: clubs,
      });
    } catch (error) {
      res.status(400).send({
        status: "false",
        error,
      });
    }
  });
// 新增社團
router.post("/club", async (req, res) => {
  const data = req.body;
  try {
    const newClub = await Club.create({
      name: data.name,
      description: data.description,
      members: [
        {
          id: data.id,
          name: data.userName,
          status: true,
          isManager: true,
        },
      ],
    });
    const updateClub = await User.findByIdAndUpdate(data.id, {
      $push: {
        clubs: {
          id: newClub._id,
          name: newClub.name,
        },
      },
    });
    res.status(200).send({
      status: "success",
      data: newClub,
    });
  } catch (err) {
    res.status(400).send({
        status:"Failure",
        message:err
    })
  }
});
// 刪除社團
router.delete("/club/:id", async(req,res)=>{
    const id = req.params.id; // 社團ID
    try{
        await Club.findByIdAndDelete(id)
        res.status(200).send({
            status:"success",
            data:{
                message:"delete"
            }
        })
        await User.updateMany({},{
          $pull:{
            clubs:{id:id}
          }
        })
    }catch(err){
        res.status(400).send({
            status:"Failure",
            message:err
        })
    }
})
// 修改社團內容
router.patch("/club/:id",async(req,res)=>{
  const id = req.params.id
  const data = req.body
  try{
    const updateClub = await Club.findByIdAndUpdate(id,{
      name: data.name,
      description: data.description
    })
    res.status(200).send({
      status:"success",
      data:updateClub
    }
  )
  }catch(err){
    res.status(400).send(
      {
        status:"success",
        message:err
      }
    )
  }
})
// 加入社團
router.patch("/addClub/:clubId",async(req,res)=>{
    const id = req.params.clubId; // 社團id
    const data = req.body; // 自己的資料
    try{
        const updateMembers = await Club.findByIdAndUpdate(id,{
            $push:{
                members:{
                    id:data.id,
                    name:data.name,
                    status:false,
                    isManager:false
                }
            }
        })
        res.status(200).send({
            status:"success",
            data:updateMembers
        })
    }catch(err){
        res.status(400).send({
            ststus:"Failure",
            message:err
        })
    }
})
// 同意加入社團
router.patch("/agree-club/:userId",async(req,res)=>{
    const id = req.params.userId; // 要同意的使用者id
    const data = req.body; // 社團的資料
    try{
        const updateMember = await Club.updateOne(
            { _id: data.id, "members.id": id },
            {
                $set:{
                    "members.$.status":true
                }
            },
            {
                new:true
            }
        )
        await User.findByIdAndUpdate(id,{
            $push:{
                clubs:{
                    id:data.id,
                    name:data.name
                }
            }
        })
        res.status(200).send({
            status:"success",
            data:updateMember
        })
    }catch(err){
        res.status(400).send({
            status:"Failure",
            message:err
        })
    }
})
// 從社團中剔除成員
router.patch("/deleteMember/:userId",async(req,res)=>{
    const id = req.params.userId; // 成員id
    const data = req.body; //社團的id
    try{
        const deleteClubMember = await Club.findByIdAndUpdate(data.id, {
            $pull: { members: { id: id } },
        });
        await User.findByIdAndUpdate(id, {
            $pull: { clubs: { id: data.id } },
        });
        res.status(200).send({
            status:"success",
            data:deleteClubMember
        })
    }catch(err){
        res.status(400).send({
            status:"Failure",
            message:err
        })
    }
})
// 加入社團管理員
router.patch("/add-manager/:userId",async(req,res)=>{
    const id = req.params.userId; // 要同意的使用者id
    const data = req.body; // 社團的資料
    try{
        const updateMember = await Club.updateOne(
            { _id: data.id, "members.id": id },
            {
                $set:{
                    "members.$.isManager":true
                }
            },
            {
                new:true
            }
        )
        await User.findByIdAndUpdate(id,{
            $push:{
                clubs:{
                    id:data.id,
                    name:data.name
                }
            }
        })
        res.status(200).send({
            status:"success",
            data:updateMember
        })
    }catch(err){
        res.status(400).send({
            status:"Failure",
            message:err
        })
    }
})
module.exports = router;
