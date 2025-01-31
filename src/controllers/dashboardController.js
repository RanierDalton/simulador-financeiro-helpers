var dashboardModel = require("../models/dashboardModel");

const getMaquina = async (req, res) => {
    const {idSetor} = req.params
    try {
        const maquinas = await dashboardModel.getMaquinas(idSetor);

        if(!maquinas){
            res.status(404).json({
                message: "Nenhuma maquina encontrada"
            })
        }else{
            res.status(200).json({
                data: maquinas
            })
        }
    } catch (error) {
        return error;
    }

}

const criarGrafico3 = async (req, res) => {
    const {idMaquina} = req.params;

    try {
        const registros = await dashboardModel.grafico2(idMaquina);

        if(!registros){
            res.status(404).json({
                message: "Nenhum registro encontrado"
            })
        }else{
            res.status(200).json({
                data: registros
            })
        }

    } catch (error) {
        return error
    }
}

const criarGrafico1 = async (req, res) => {
    const {opcao} = req.params;
    const {setor} = req.params;
    try {
        const registros = await dashboardModel.grafico1(opcao, setor);

        if(!registros){
            res.status(404).json({
                message: "Nenhum registro encontrado"
            })
        }else{
            res.status(200).json({
                data: registros
            })
        }

    } catch (error) {
        return error
    }
}

const criarGrafico2 = async (req, res) => {
    const {idSetor} = req.params;

    try {
        const registros = await dashboardModel.getGrafico2(idSetor);
        
        if(!registros){
            res.status(404).json({
                message: "Nenhum registro encontrado"
            })
        }else{
            res.status(200).json({
                data:registros
            })
        }
    } catch (error) {
        return error
    }
}

const getSetores = async (req, res) => {
    const {idEmpresa} = req.params;

    try {
        const setores = await dashboardModel.getSetores(idEmpresa)

        if(!setores){
            res.status(404).json({
                message: "Nenhum setor encontrado"
            })
        }else{
            res.status(200).json({
                data: setores
            })
        }
    } catch (error) {
        return error
    }
}

const getKPI1 = async (req, res) => {
    const {idEmpresa} = req.params;

    try {
        const aquecido = await dashboardModel.getKPI1(idEmpresa)

        if(!aquecido){
            res.status(404).json({
                message: "Nenhum evento encontrado"
            })
        }else{
            res.status(200).json({
                data: aquecido
            })
        }
    } catch (error) {
        return error
    }
}

const getKPI2 = async (req, res) => {
    const {idEmpresa} = req.params;

    try {
        const resfriado = await dashboardModel.getKPI2(idEmpresa)

        if(!resfriado){
            res.status(404).json({
                message: "Nenhum evento encontrado"
            })
        }else{
            res.status(200).json({
                data: resfriado
            })
        }
    } catch (error) {
        return error
    }
}

const getKPI1data = async (req, res) => {
    const {idEmpresa} = req.params;

    try {
        const aquecido = await dashboardModel.getDataKPI1(idEmpresa)

        if(!aquecido){
            res.status(404).json({
                message: "Nenhum evento encontrado"
            })
        }else{
            res.status(200).json({
                data: aquecido
            })
        }
    } catch (error) {
        return error
    }
}

const getKPI2data = async (req, res) => {
    const {idEmpresa} = req.params;

    try {
        const aquecido = await dashboardModel.getDataKPI2(idEmpresa)

        if(!aquecido){
            res.status(404).json({
                message: "Nenhum evento encontrado"
            })
        }else{
            res.status(200).json({
                data: aquecido
            })
        }
    } catch (error) {
        return error
    }
}

module.exports = {
    criarGrafico1,
    criarGrafico3,
    criarGrafico2,
    getMaquina,
    getSetores,
    getKPI1,
    getKPI1data,
    getKPI2data,
    getKPI2
}