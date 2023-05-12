
const getUserThroughEmail = (email) => {
   return `
    SELECT * FROM users WHERE email='${email}';
    `;
 };

 const getUserThroughId = (id) => {
   return `
    SELECT * FROM users WHERE id='${id}';
    `;
 };

 const createUser = (name, companyname, email, encrypPassword) => {
   return `
       INSERT INTO users (name,companyname,email,password) VALUES ('${name}','${companyname}','${email}','${encrypPassword}');
    `;
 };

 export {
   getUserThroughEmail,
   createUser,
   getUserThroughId
 };