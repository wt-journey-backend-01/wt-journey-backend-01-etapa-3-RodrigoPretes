const { v4: uuidv4, validate } = require('uuid');
const { createError } = require('../utils/errorHandler')

const cases = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
    
    },

]

function findAllCases() {
    return {
        data: cases,
        msg: "Lista de casos obtida com sucesso",
        status: 200
    }
}

function findByStatus(status) {
	const filtered = cases.filter(c => c.status === status);
	return {
		data: filtered,
		msg: `Casos com status '${status}' encontrados com sucesso`,
		status: 200
	};
}

function findByAgent(agente_id) {
    const filtered = cases.filter(c => c.agente_id === agente_id);
    return {
        data: filtered,
        msg: `Casos para o agente com ID '${agente_id}' encontrados com sucesso`,
        status: 200
    };
}

function getCaseByID(id) {
    const caseFounded = cases.find((caseItem) => caseItem.id === id);

    return caseFounded ? 
        {
            data: caseFounded,
            msg: "Caso encontrado com sucesso",
            status: 200
        } : 
        createError(404, "ID de caso não encontrado");
}

function insertCase(novoCaso){
    cases.push(novoCaso);
    return {
        data: novoCaso,
        msg: "Caso inserido com sucesso",
        status: 201
    };
}

function updateCaseById(caseID, req){
    const indexCase = cases.findIndex((caseItem) => caseID === caseItem.id);

    if(indexCase === -1){
        return createError(404, "ID de caso não encontrado");
    }

    const updatedCase = {
        id: cases[indexCase].id,
        titulo: req.titulo,
        descricao: req.descricao,
        status: req.status,
        agente_id: req.agente_id
    };

    cases[indexCase] = updatedCase;

    return {
            status: 204
        };
}

function patchCaseByID(caseID, req){
    const indexCase = cases.findIndex((caseItem) => caseID === caseItem.id);

    if(indexCase === -1){
        return createError(404, "ID de caso não encontrado")
    }

    if(req.id && req.id !== caseID) {
        return createError(400, "ID não pode ser sobrescrito");
    }

    cases[indexCase] = { ...cases[indexCase], ...req };

    return {
        status: 204
    };
}

function deleteCaseById(caseID){
    const indexCase = cases.findIndex((caseItem) => caseID === caseItem.id);

    if(indexCase === -1){
        return createError(404, "ID de caso não encontrado");
    }

    cases.splice(indexCase, 1);
    return {
        msg: "Caso deletado com sucesso",
        status: 200
    };
}

module.exports = {
    findAllCases, findByStatus, findByAgent, getCaseByID, insertCase, updateCaseById, patchCaseByID, deleteCaseById
}