import RestWave from "restwave";
import * as dotenv from "dotenv";
// import transporter from "./src/utils/email.js";
import userRouter from "./src/router/user.js";
import reviewRouter from './src/router/reviews.js';
import nodemailer from 'nodemailer';

dotenv.config();
const app = new RestWave();

const transporter = nodemailer.createTransport({
   service: "gmail",
     auth: {
        user:  process.env.EMAIL,
        pass:  process.env.WORD
     },
  });
  transporter.verify((err, success) => {
   err
     ? console.log(err)
     : console.log(`=== Server is ready to take messages: ${success} ===`);
  });

app.post("/send", function (req, res) {
  console.log(req);
  const { name, company, email, phone, projectIdea } = req.data;
  let mailOptions = {
    from: `${email}`,
    to: process.env.EMAIL,
    subject: `Message from: ${email}`,
    text: `
      user-name: ${name},
      company-name: ${company}
      phone: ${phone},
      project idea: ${projectIdea}
     `,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      console.log("== Message Sent ==");
      res.json({
        status: "success",
      });
    }
  });
});

app.use("/v1", userRouter,reviewRouter);

const port = Number(process.env.PORT);
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
