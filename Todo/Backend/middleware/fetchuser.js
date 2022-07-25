const jwt= require('jsonwebtoken')
const JWT_SECRET =process.env.REACT_APP_JWT_SECRET

const fetchuser=(req,res,next)=>{
    let success;
    // Get user from jwt token and add id to req
    const token=req.header('auth-token');
    if(!token){
        success=false
        return res.status(401).send({success,error:"Pleaser authenticate using valid token"})
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user
        next();
        success=true
    
    } catch (error) {
        success=false
        return res.status(401).send({success,error:"Please authenticate using valid token"})
    }
}

module.exports=fetchuser