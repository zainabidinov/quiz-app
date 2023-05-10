// const jwt = require("jsonwebtoken");

// // we get tokens in header i.e req
// // what we send to frontend is via res
// // if token and logic are fine we will call the next method
// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decodedToken.userId;
//     req.body.userId = userId;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).send({ message: "Not authorized" });
//   }

//   if (!token) {
//     res.status(401).json({ message: "Not authorized, no token found" });
//   }
// };

// res.send({
//     message: "You are not authenticated",
//     data: error,
//     success: false,
//   });



// const jwt = require("jsonwebtoken");

// // we get tokens in header i.e req
// // what we send to frontend is via res
// // if token and logic are fine we will call the next method
// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decodedToken.userId;
//     req.body.userId = userId;
//     next();
//   } catch (error) {
//     res.send({
//       message: "You are not authenticated",
//       data: error,
//       success: false,
//     });
//   }
// };
