const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req,res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ){
        return res.status(400).json({errores:errores.array()})
    }
 
    //extraer email y password
    const {email, password} = req.body;

    try {
        //checkea que el usuario registrado sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        usuario = new Usuario(req.body);

        //hass password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        //crea y firma el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600000
            
        }, (error, token)=> {
            if (error) throw error;

            res.json({token});
        });

    }catch (error){
        console.log(error);
        res.status(400).send('There was an error');
    }
}