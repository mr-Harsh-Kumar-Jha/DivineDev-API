import RestWave from "restwave";
import pool from "../../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from "validator";
import {getUserThroughEmail,createUser} from '../query/user.js'
const userRouter = RestWave.router();

userRouter.post('/createuser',async(req,res)=>{
   try{
      const {name,companyname,email,password} = req.data;
      console.log("Email: " + email);
      console.log("company name: " + companyname);
      console.log("name: " + name);
      if(!email || !validator.isEmail(email)){
         let error = new Error(`please provide valid email ${email}`);
         error.code = 400;
         throw error;
      }

      const User = await pool.query(getUserThroughEmail(email));
      if(User.rowCount!=0){
         let error = new Error("User with this Email addess exist");
         error.code = 404;
         throw error;
      }
      const salt = await bcrypt.genSalt(10);
      const encrypPassword = await bcrypt.hash(password, salt);
      await pool.query(createUser(name,companyname,email,encrypPassword));

   //  console.log(user.rows[0]);

      const data = {
         user: {
            email: email
         }
      }

      const authtoken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ success: true, email:email, authtoken:authtoken},201);
   }catch(err){
      const message = err.message || "internal server Error !!!";
      const code = err.code || 500;
      res.json({success:false,message},code);
   }
})

userRouter.post('/login',async (req,res)=>{
   try{
   const {email,password} = req.data;
   if(!email || !validator.isEmail(email)){
      let error = new Error("please provide valid email");
      error.code = 400;
      throw error;
   }
   const User = await pool.query(getUserThroughEmail(email));
   if(!User.rowCount!=0){
      let error = new Error("User not found please create account !!");
      error.code = 404;
      throw error;
   }

   const UserPassword = User.rows[0].password;
   const passwordcompare = await bcrypt.compare(password, UserPassword);

   if(!passwordcompare){
      let error = new Error("please try to login with correct credentials");
      error.code = 400;
     throw error;
   }

   const data = {
      user: {
         email:email
      }
   }

   const authtoken = jwt.sign(data, process.env.JWT_SECRET);
   const {name,companyname} = User.rows[0];
   res.json({ success: true, authtoken: authtoken,user:{companyname, name,email}});

   }catch(err){
      const message = err.message || 'Internal server Error!!';
      const code = err.code || 500;
      res.json({success:false, message},code);
   }
})

export default userRouter;