const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");
const { createError } = require('../utils/errorHandler');

async function buildCase(data, method){
    const allowed = ['titulo', 'descricao', 'status', 'agente_id'];
    const payload = {};

    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        return { valid: false, message: 'Body inválido: esperado um objeto.' };
    }

    if(method !== 'patch'){
        for (const k of allowed) {
            if (data[k] === undefined || data[k] === null || (typeof data[k] === 'string' && data[k].trim() === '')) {
                return { valid: false, message: `Parâmetro obrigatório ausente ou vazio: ${k}` };
            }
        }
    }
    else{
        if(data.id){
            return { valid: false, message: `ID não pode ser sobrescrito.`}
        }
    }

	if(data.id){
        return { valid: false, message: `ID não pode ser sobrescrito.`}
    }

    for (const k of allowed) {
        if (Object.prototype.hasOwnProperty.call(data, k) && data[k] !== undefined) {
            payload[k] = data[k];
        }
    }
    
    if (payload.titulo !== undefined) {
        if (typeof payload.titulo !== 'string' || payload.titulo.trim() === '') {
            return { valid: false, message: 'Titulo enviado é invalido, deve ser um texto.' };
        }
    }

    if (payload.descricao !== undefined) {
        if (typeof payload.descricao !== 'string' || payload.descricao.trim() === '') {
            return { valid: false, message: 'Descrição enviada é inválida, deve ser um texto.' };
        }
    }

    if (payload.status !== undefined) {
        if(typeof payload.status !== 'string' || payload.status.trim() === '' 
	      || (payload.status !== 'aberto' && payload.status !== 'solucionado')){
            return { valid: false, message: "Status informado não é valido, deve ser um texto e ser 'aberto' ou 'solucionado'." };
        }
    }

	if (payload.agente_id !== undefined) {
		const validID = validateID(payload.agente_id)
		if (validID) {
			return { valid: false, message: validID.msg }
		}
		const hasAgentWithID = await agentesRepository.getAgentByID(payload.agente_id);
        if(hasAgentWithID.status !== 200){
            return { valid: false, message: hasAgentWithID.msg };
        }
    }

    return { valid: true, payload };
}

function validateID(id) {
    const idNumber = Number(id);
    if (isNaN(idNumber) || !Number.isInteger(idNumber) || idNumber <= 0) {
        return createError(400, "ID inválido, deve ser número.");
    }
	return null;
}

async function getAllCasos(req, res) {
	const { status, agente_id } = req.query;

	if (status) {
		if (status !== "aberto" && status !== "solucionado") {
			const error = createError(400, "Status inválido, deve ser 'aberto' ou 'solucionado'");
			return res.status(error.status).json(error.data);
		}
		const result = await casosRepository.findByStatus(status);
		return res.status(result.status).json(result.data);
	}

	if (agente_id) {
		const validID = validateID(agente_id)
		if (validID) {
			return res.status(validID.status).json(validID);
		}
		const result = await casosRepository.findByAgent(agente_id);
		return res.status(result.status).json(result.data);
	}

	const result = await casosRepository.findAllCases();
	res.status(result.status).json(result.data);
}

async function getCaseByID(req, res) {
	const valid = validateID(req.params.id);
	if (valid){
		return res.status(valid.status).json(valid);
	} 
	const caseID = req.params.id;
	const result = await casosRepository.getCaseByID(caseID);
	res.status(result.status).json(result.data);
}

async function insertCase(req, res) {
	const validCaseData = await buildCase(req.body, 'post');
	if (!validCaseData.valid) {
		const error = createError(400, validCaseData.message);
		return res.status(error.status).json(error.data);
	}
	const existingAgent = await agentesRepository.getAgentByID(req.body.agente_id);
	if (existingAgent.status !== 200) {
		const error = createError(existingAgent.status, existingAgent.msg);
		return res.status(error.status).json(error.data);
	}
	const result = await casosRepository.insertCase(validCaseData.payload);
	return res.status(result.status).json(result.data);
}

async function updateCaseById(req, res){
	const validID = validateID(req.params.id)
	if (validID) {
		return res.status(validID.status).json(validID);
	}
	const validCaseData = await buildCase(req.body, 'put');
	if (!validCaseData.valid) {
		const error = createError(400, validCaseData.message);
		return res.status(error.status).json(error.data);
	}
	const result = await casosRepository.updateCaseById(req.params.id, validCaseData.payload);
	return res.status(result.status).json(result.data);
}

async function patchCaseByID(req, res) {
	const validID = validateID(req.params.id)
	if (validID) {
		return res.status(validID.status).json(validID);
	}
	const validCaseData = await buildCase(req.body, 'patch');
	if (!validCaseData.valid) {
		const error = createError(400, validCaseData.message);
		return res.status(error.status).json(error.data);
	}
	const result = await casosRepository.patchCaseByID(req.params.id, validCaseData.payload);
	return res.status(result.status).json(result.data);
}

async function deleteCaseById(req, res) {
	const invalid = validateID(req.params.id);
	if (invalid){
		return res.status(invalid.status).json(invalid);
	}
	const result = await casosRepository.deleteCaseById(req.params.id);
	res.status(result.status).send();
}


module.exports = {
	getAllCasos,
	getCaseByID,
	insertCase,
	updateCaseById,
	patchCaseByID,
	deleteCaseById
}