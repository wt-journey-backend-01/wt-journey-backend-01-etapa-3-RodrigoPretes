const agentesRepository = require("../repositories/agentesRepository");
const { v4: uuidv4, validate: isUUID } = require('uuid');
const { createError } = require('../utils/errorHandler');
const casosRepository = require('../repositories/casosRepository');


const caseModel = (req) => {
  return {
    id: uuidv4(),
    nome: req.nome,
    dataDeIncorporacao: req.dataDeIncorporacao,
    cargo: req.cargo
  };
};

function validateCaseData(data) {
  if (!data.nome || !data.dataDeIncorporacao || !data.cargo) {
    return { valid: false, message: "Campos obrigatórios faltando" };
  }
  return { valid: true };
}

function validateUUID(id) {
  if (!isUUID(id)) {
    return createError(400, "ID inválido, deve ser UUID");
  }
}

function getAllAgentes(req, res) {
    const { cargo, sort, agente_id } = req.query;

    if (cargo) {
        const result = agentesRepository.findByCargo(cargo);
        return res.status(result.status).json(result.data);
    }

    if (sort && (sort === 'dataDeIncorporacao' || sort === '-dataDeIncorporacao')) {
        const result = agentesRepository.sortByIncorporation(sort);
        return res.status(result.status).json(result.data);
    }

    if (agente_id) {
        if (!isUUID(agente_id)) {
            return createError(400, "ID de agente não fornecido ou inválido");
        }
        const result = casosRepository.findByAgent(agente_id);
        return res.status(result.status).json(result.data);
    }
    const result = agentesRepository.findAllAgents();
    res.status(result.status).json(result.data);
}

function getAgenteByID(req, res) {
    const invalid = validateUUID(req.params.id);
    if (invalid) return res.status(invalid.status).json(invalid);
    const result = agentesRepository.getAgentByID(req.params.id);
    res.status(result.status).json(result.data);
}

function insertAgente(req, res) {
    const validation = validateCaseData(req.body);
    if (!validation.valid) {
        return createError(400, validation.message);
    }
    const novoAgente = caseModel(req.body);
    const result = agentesRepository.insertAgent(novoAgente);
    res.status(result.status).json(result.data);
}

function updateAgenteById(req, res) {
    const invalid = validateUUID(req.params.id);
    if (invalid) return res.status(invalid.status).json(invalid);
    const validation = validateCaseData(req.body);
    if (!validation.valid) {
        return createError(400, validation.message);
    }
    const result = agentesRepository.updateAgentById(req.params.id, req.body);
    res.status(result.status).send();
}

function patchAgenteByID(req, res) {
    const invalid = validateUUID(req.params.id);
    if (invalid) return res.status(invalid.status).json(invalid);
    if(req.body.id) return createError(400, "ID não pode ser sobrescrito");
    const result = agentesRepository.patchAgentByID(req.params.id, req.body);
    res.status(result.status).send();
}

function deleteAgenteById(req, res) {
    const invalid = validateUUID(req.params.id);
    if (invalid) return res.status(invalid.status).json(invalid);
    const result = agentesRepository.deleteAgentById(req.params.id);
    res.status(result.status).json(result.msg);
}

module.exports = {
    getAllAgentes,
    getAgenteByID,
    insertAgente,
    updateAgenteById,
    patchAgenteByID,
    deleteAgenteById
};
