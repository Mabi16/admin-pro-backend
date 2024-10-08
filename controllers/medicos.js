const { response } = require("express");
const Medico = require("../models/medico");

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find().populate("usuario","nombre email")
                                       .populate("hospital","nombre");


    res.json({
        ok: true,
        medicos
    })

}


const crearMedico = async(req, res = response) => {

    const medico = new Medico({
        usuario: req.uid,
        hospital: req.hospital,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

            res.json({
                ok: true,
                medico:medicoDB
            })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con el administrador."
        })
    }


}

const actualizarMedico = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.params.uid;

    try {

        const medico = await Medico.findById( id );

        if( !medico ){
            return res.status(404).json({
                ok: false,
                msg: "Medico no encontrado por id"
            });
        }

        // hospital.nombre = req.body.nombre;
        const cambiosMedico = {
            ...req.body,
            usuario:uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new:true});


        res.json({
            ok: true,
            medico: medicoActualizado
        });
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con el administrador."
        });
    }


}


const borrarMedico = async(req, res = response) => {
    const id = req.params.id;

    try {

        const medico = await Medico.findById( id );

        if( !medico ){
            return res.status(404).json({
                ok: false,
                msg: "Medico no encontrado por id"
            });
        }

        await Medico.findByIdAndDelete( id );


        res.json({
            ok: true,
            msg:"Medico eliminado."
        });
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con el administrador."
        });
    }

}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}