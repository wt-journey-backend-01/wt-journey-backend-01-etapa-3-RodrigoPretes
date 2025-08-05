const { v4: uuidv4 } = require('uuid');
const { createError } = require('../utils/errorHandler');
const { isValidDate } = require('../utils/formatDate');

const caseModel = (data) => {
  return {
    id: uuidv4(),
    nome: data.nome,
    dataDeIncorporacao: isValidDate(data.dataDeIncorporacao) ? data.dataDeIncorporacao : null,
    cargo: data.cargo
  };
};

const agentes = [
    {
        id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
        nome: "Rommel Carneiro",
        dataDeIncorporacao: "1992-10-04",
        cargo: "delegado"
    }
];

function findAllAgents() {
    return {
        data: agentes,
        msg: "Lista de agentes obtida com sucesso",
        status: 200
    };
}

function getAgentByID(id) { 
    const agent = agentes.find(a => a.id === id);
    return agent
        ? { data: agent, msg: "Agente encontrado com sucesso", status: 200 }
        : createError(404, "ID de agente não encontrado");
}

function findByCargo(cargo) {
    const result = agentes.filter(agent => agent.cargo.toLowerCase() === cargo.toLowerCase());
    return {
        status: 200,
        data: result
    };
}

function sortByIncorporation(sortParam) {
  const asc = sortParam === 'dataDeIncorporacao';
  const desc = sortParam === '-dataDeIncorporacao';

  if (!asc && !desc) {
    return createError(400, "Parâmetro sort inválido. Use 'dataDeIncorporacao' ou '-dataDeIncorporacao'.");
  }

  const sorted = [...agentes].sort((a, b) => {
    const da = new Date(a.dataDeIncorporacao);
    const db = new Date(b.dataDeIncorporacao);

    const aInvalid = isNaN(da);
    const bInvalid = isNaN(db);

    if (aInvalid && bInvalid) return 0;
    if (aInvalid) return 1;
    if (bInvalid) return -1;

    return asc ? (da - db) : (db - da);
  });

  return {
    status: 200,
    data: sorted,
    msg: asc
      ? "Agentes ordenados por dataDeIncorporacao (ascendente: mais antigo primeiro)."
      : "Agentes ordenados por dataDeIncorporacao (descendente: mais recente primeiro)."
  };
}

function insertAgent(req) {

    if(req.dataDeIncorporacao && !isValidDate(req.dataDeIncorporacao)) {
        return createError(400, "Data de incorporação inválida");
    };

    const novoAgente = caseModel(req);


    if (!novoAgente.nome || !novoAgente.dataDeIncorporacao || !novoAgente.cargo) {
        return createError(400, "Campos obrigatórios faltando");
    }

    agentes.push(novoAgente);
    return {
        data: novoAgente,
        msg: "Agente inserido com sucesso",
        status: 201
    };
}

function updateAgentById(agentID, req) {
    const index = agentes.findIndex(a => a.id === agentID);
    if (index === -1) {
        return createError(404, "ID de agente não encontrado");
    }

    if (!isValidDate(req.dataDeIncorporacao)) {
    return createError(400, "Data de incorporação inválida");
    }

    agentes[index] = {
    id: agentes[index].id,
    nome: req.nome,
    dataDeIncorporacao: req.dataDeIncorporacao,
    cargo: req.cargo
    };

    return {
        status: 204
    };
}

function patchAgentByID(agentID, req) {
    const index = agentes.findIndex(a => a.id === agentID);
    if (index === -1) {
        return createError(404, "ID de agente não encontrado");
    }

    if(req.id && req.id !== agentID) {
        return createError(400, "ID não pode ser sobrescrito");
    }

    agentes[index] = { ...agentes[index], ...req };

    return {
        status: 204
    };
}

function deleteAgentById(agentID) {
    const index = agentes.findIndex(a => a.id === agentID);
    if (index === -1) {
        return createError(404, "ID de agente não encontrado");
    }

    agentes.splice(index, 1);
    return {
        msg: "Agente deletado com sucesso",
        status: 200
    };
}

module.exports = {
    findAllAgents,
    findByCargo,
    sortByIncorporation,
    getAgentByID,
    insertAgent,
    updateAgentById,
    patchAgentByID,
    deleteAgentById
};
