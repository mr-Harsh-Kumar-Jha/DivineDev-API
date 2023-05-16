import express from "express";
import pool from "../../db.js";
import {getUserThroughEmail,getUserThroughId} from '../query/user.js'
import fetchuser from '../middleware/fetchuser.js';
import { createPost, getReviews } from "../query/reviews.js";
const reviewRouter = express.Router();

reviewRouter.post('/postreview',fetchuser,async(req,res)=>{
   try{
      const {description, rating} = req.body;
      const user = await pool.query(getUserThroughEmail(req.user.email));
      if(!user.rowCount){
         let error = new Error("please login with correct credentials !!");
         error.code = 404;
        throw error;
      }
      await pool.query(createPost(user.rows[0].id,description,rating));
      res.status(201).json({success:true});
   }catch(err){
      const message = err.message || "internal server Error !!!";
      const code = err.code || 500;
      res.status(code).json({success:false,message});
   }
})

reviewRouter.get('/getreview',async (req,res)=>{
   try{
      const posts = await pool.query(getReviews());
      // console.log(posts);
      if(!posts.rowCount){
         let error = new Error("Internal Server Error");
         error.code = 500;
        throw error;
      }
      const post = [];
      for(let i=0;i<posts.rowCount;i++){
         const content=posts.rows[i].content;
         const rating = posts.rows[i].rating;
         const user = await pool.query(getUserThroughId(posts.rows[i].user_id));
         const name = user.rows[0].name;
         const companyname = user.rows[0].companyname;
         post.push({name,companyname,content,rating});
      }
      // post=JSON.stringify(post);
     return res.status(200).json({success:true,post});
   }catch(err){
      const message = err.message || 'Internal server Error!!';
      const code = err.code || 500;
      res.status(code).json({success:false, message});
   }
})

export default reviewRouter;