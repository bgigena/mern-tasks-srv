const jwt = require('jsonwebtoken');

module.exports = function (req,res, next) {
    //leer el token del header
    const token = req.header('x-auth-token');

    //revisar si no hay token
    if(!token){
        return res.status(401).json({msj: 'No hay Token. Permisos inválidos'})
    }

    //validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET);
        req.usuario = cifrado.usuario;
        next();
        
    }catch (error){
        res.status(401).json({msg: 'Token no válido'});
    }
}