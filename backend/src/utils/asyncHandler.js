const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
    .catch((err) => next(err));
  };
};

export { asyncHandler };

// Example route with async handler
// app.get("/example", asyncHandler(async (req, res, next) => {
     // Asynchronous operation (e.g., database query)
//     const result = await someAsyncFunction();

     // Send response to client
//     res.json(result);
// }));

// const promiseHandler = (handler) => {
//     return (req, res, next) => {
//       handler(req, res, next)
//         .then((result) => {
//           // If the promise resolves successfully, you can send the result back to the client
//           res.status(200).json(result);
//         })
//         .catch((error) => {
//           // If the promise rejects with an error, pass it to the Express error handling middleware
//           next(error);
//         });
//     };
//   };

// Now, you can use the promiseHandler function to wrap your route handler functions that return promises, like so:
// import promiseHandler from "./promiseHandler.js";

// const myRouteHandler = promiseHandler((req, res, next) => {
//   // Your promise-based logic here
//   return new Promise((resolve, reject) => {
//     // Resolve or reject the promise based on your logic
//   });
// });

  

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

// const asyncHandler = (handler) => {
//     return async (req, res, next) => {
//       try {
//         await handler(req, res, next); // Call the original route handler function
//       } catch (error) {
//         next(error); // Pass any caught errors to the Express error handling middleware
//       }
//     };
//   };
  
