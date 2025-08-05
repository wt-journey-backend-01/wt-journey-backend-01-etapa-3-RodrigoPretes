const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4, validate: isUUID } = require('uuid');
const { createError } = require('../utils/errorHandler');

const caseModel = (data) => ({
  id: uuidv4(),
  titulo: data.titulo.trim(),
  descricao: data.descricao.trim(),
  status: data.status,
  agente_id: data.agente_id
});

function validateCaseData(data, isPatch = false) {
  const errors = {};

  if ('id' in data) {
    errors.id = "O campo 'id' não pode ser enviado/alterado.";
  }

  if (!isPatch || 'titulo' in data) {
    if (typeof data.titulo !== 'string' || data.titulo.trim().length === 0) {
      errors.titulo = "O campo 'titulo' é obrigatório e não pode ser vazio.";
    }
  }

  if (!isPatch || 'descricao' in data) {
    if (typeof data.descricao !== 'string' || data.descricao.trim().length === 0) {
      errors.descricao = "O campo 'descricao' é obrigatório e não pode ser vazio.";
    }
  }

  if (!isPatch || 'status' in data) {
    if (typeof data.status !== 'string' || !ALLOWED_STATUS.has(data.status)) {
      errors.status = "O campo 'status' deve ser 'aberto' ou 'solucionado'.";
    }
  }

  if (!isPatch || 'agente_id' in data) {
    if (typeof data.agente_id !== 'string' || !isUUID(data.agente_id)) {
      errors.agente_id = "O campo 'agente_id' deve ser um UUID válido.";
    }
  }

  const valid = Object.keys(errors).length === 0;
  return valid ? { valid: true } : { valid: false, errors };
}

function validateCaseData(data, isPatch) {
  if ((!data.titulo || !data.descricao || !data.status || !data.agente_id) && !isPatch) {
    return { valid: false, message: "Campos obrigatórios faltando" };
  }
  if (data.status && (data?.status !== "aberto" && data?.status !== "solucionado") && isPatch) {
    return { valid: false, message: "Status inválido, deve ser 'aberto' ou 'solucionado'" };
  }
  return { valid: true };
}

function validateUUID(id) {
  if (!isUUID(id)) {
    return createError(400, "ID inválido, deve ser UUID");
  }
}

function getAllCasos(req, res) {
	const { status, agente_id } = req.query;

	if (status) {
		if (status !== "aberto" && status !== "solucionado") {
			return createError(400, "Status inválido, deve ser 'aberto' ou 'solucionado'");
		}
		const result = casosRepository.findByStatus(status);
		return res.status(result.status).json(result.data);
	}

	if (agente_id) {
		if (!isUUID(agente_id)) {
			return createError(400, "ID de agente não fornecido ou inválido");
		}
		const result = casosRepository.findByAgent(agente_id);
		return res.status(result.status).json(result.data);
	}

	const casos = casosRepository.findAllCases();
	res.status(casos.status).json(casos.data);
}

function getCaseByID(req, res) {
	const invalid = validateUUID(req.params.id);
	if (invalid) return res.status(invalid.status).json(invalid);
	const caseID = req.params.id;
	const caso = casosRepository.getCaseByID(caseID);
	res.status(caso.status).json(caso.data);
}

function insertCase(req, res) {
	const validCaseData = validateCaseData(req.body, false);
	if (!validCaseData.valid) {
		return res.status(400).json({
		status: 400,
		message: "Parâmetros inválidos",
		errors: validCaseData.errors
		});
	}
	const agenteExistente = agentesRepository.getAgentByID(req.body.agente_id);
	if (agenteExistente.status === 404) {
		return res.status(404).json({ msg: "Agente não encontrado para o agente_id fornecido" });
	}
	const novoCaso = caseModel(req.body);
	const insertedCase = casosRepository.insertCase(novoCaso);
	return res.status(insertedCase.status).json(insertedCase.data);
}

function updateCaseById(req, res){
	const invalid = validateUUID(req.params.id);
	if (invalid) return res.status(invalid.status).json(invalid);
	const validation = validateCaseData(req.body, false);
	if (!validation.valid) {
		return createError(400, validation.message);
	}
	const caseID = req.params.id;
	const updatedCase = casosRepository.updateCaseById(caseID, req.body);
	return res.status(updatedCase.status).send();
}

function patchCaseByID(req, res) {
	const invalid = validateUUID(req.params.id);
	if (invalid) return res.status(invalid.status).json(invalid);
	const validation = validateCaseData(req.body, true);
	if (!validation.valid) {
		return createError(400, validation.message);
	}
	if(req.body.id) return createError(400, "ID não pode ser sobrescrito");
	const caseID = req.params.id;
	const patchedCase = casosRepository.patchCaseByID(caseID, req.body);
	return res.status(patchedCase.status).send();
}

function deleteCaseById(req, res) {
	const invalid = validateUUID(req.params.id);
	if (invalid) return res.status(invalid.status).json(invalid);
	const caseID = req.params.id;
	const deletedCase = casosRepository.deleteCaseById(caseID);
	return res.status(deletedCase.status).json(deletedCase.msg);
}


module.exports = {
	getAllCasos, getCaseByID, insertCase, updateCaseById, patchCaseByID, deleteCaseById
}