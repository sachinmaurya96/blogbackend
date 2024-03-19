// const AsyncHandler =(fn)=> async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code||500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

const AsyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
     return res.status(err.code || 500).json({
        success: false,
        message: err.message,
      });
    });
  };
};

export { AsyncHandler };
