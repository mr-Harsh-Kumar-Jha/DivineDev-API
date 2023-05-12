const getReviews = () => {
   return `
    SELECT * FROM reviews;
    `;
 };

 const createPost = (userId,content,rating) => {
   console.log(userId,content,rating);
   return `
       INSERT INTO reviews (user_id,content,rating) VALUES ('${userId}','${content}','${rating}');
    `;
 };

 export {
   getReviews,
   createPost,
 };