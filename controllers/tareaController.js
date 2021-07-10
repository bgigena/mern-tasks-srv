const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require ('express-validator');

exports.crearTarea = async (req,res) => {
        //revisar si hay errores
        const errores = validationResult(req);
        if(!errores.isEmpty() ){
            return res.status(400).json({errores:errores.array()})
        }

        try {
            const {proyecto} = req.body;

            const existeProyecto = await Proyecto.findById(proyecto);
            if(!existeProyecto){
                return res.status(404).json({msg: 'Proyecto no encontrado'})
            }

            //revisa si el proyecto actual pertenece al usuario autenticado
            if(existeProyecto.creador.toString() !== req.usuario.id ){
                return res.status(401).json({msg:'No autorizado'});
            }

            const tarea = new Tarea(req.body);
            await tarea.save();
            res.json({tarea});

        }catch(error){
            console.log(error)
            res.status(500).send('Hubo un error')
        }
}

exports.obtenerTareas = async (req,res) => {

    try {
        const {proyecto} = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }
    
        //revisa si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg:'No autorizado'});
        }

        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json ({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }

}

exports.actualizarTareas = async (req,res) => {
    try {
        const {proyecto, nombre, estado} = req.body;

        //revisa si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'Tarea no encontrada'})
        }

        const existeProyecto = await Proyecto.findById(proyecto);

    
        //revisa si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg:'No autorizado'});
        }

        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //guardar tarea
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, {new: true});

        res.json({tarea})


    } catch(error) {
        console.log(object);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req,res) => {
    try {
        const {proyecto } = req.query;

        //revisa si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea){
            return res.status(404).json({msg: 'Tarea no encontrada'})
        }

        const existeProyecto = await Proyecto.findById(proyecto);

    
        //revisa si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg:'No autorizado'});
        }

        //eliminar

        await Tarea.findByIdAndRemove({_id: req.params.id});
        res.json ({msg: 'Tarea eliminada'});

    } catch(error) {
        console.log(object);
        res.status(500).send('Hubo un error');
    }
}