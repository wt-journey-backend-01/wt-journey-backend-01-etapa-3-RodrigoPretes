const { v4: uuidv4 } = require('uuid');
const { createError } = require('../utils/errorHandler');
const { isValidDate } = require('../utils/formatDate');
const db = require('../db/db');

async function findAllAgents() {
    try{
        const agentes = await db.select().from('agentes');

        if(!agentes.length){
            return createError(404, 'Não foram encontrados agentes na base de dados.');
        }
    
        return {
            status: 200,
            data: agentes,
            msg: "Lista de agentes obtida com sucesso",
        };
    }catch(e){
        return createError(400, 'Erro ao realizar a consulta na base de dados.');
    }
}

async function getAgentByID(id) {
    try{
        const agente = await db.select().from('agentes').where('agentes.id', id);

        if(!agente.length){ 
            return createError(404, `Não foi encontrado nenhum agente com o id: ${id}, na nossa base de dados.`);
        };
        
        return {
            status: 200,
            data: agente[0],
            msg: "Agente encontrado com sucesso",
        };
    }catch(e){
        return createError(400, `Erro ao realizar a consulta do agente de id: ${id}.`);
    }
}

async function findAllAgentCases(agentID) {
    try{
        const agente = await db('casos as c')
                            .join('agentes as a', 'a.id', 'c.agente_id')
                            .select('c.*') 
                            .where('c.agente_id', agentID);

        if(!agente.length){ 
            return createError(404, `Não foi encontrado nenhum caso pertecente ao agente com o id: ${agentID}, na nossa base de dados.`);
        };
        
        return {
            status: 200,
            data: agente,
            msg: "Agente encontrado com sucesso",
        };
    }catch(e){
        return createError(400, `Erro ao realizar a consulta do agente de id: ${agentID}.`);
    }
}

async function findByCargo(cargo) {
    try{
        const agente = await db.select('*').from('agentes').where('agentes.cargo', cargo);

        if(!agente.length){
            return createError(404, `Não foi encontrado nenhum agente com o cargo ${cargo}, na nossa base de dados.`);
        };

        return {
            status: 200,
            data: agente, 
            msg: 'Agente(s) encontrado(s) com sucesso.'
        };
    }catch(e){
        return createError(400, `Erro ao realizar a consulta do cargo: ${cargo}`);
    }
}

async function sortByIncorporation(sortParam) {
    try{
        const sorted = await db.select('*').from('agentes').orderBy("dataDeIncorporacao", sortParam === "dataDeIncorporacao" ? 'asc' : 'desc');

        if(!sorted.length){
            return createError(404, "Não foram encontrados nenhum agente, não sendo possível fazer sua ordenação.");
        }
        
        return {
            status: 200,
            data: sorted,
            msg: "Busca de agentes ordenados por dataDeIncorporacao realizada com sucesso."
        };
    }catch(e){
        return createError(400, "Erro ao realizar a ordenação dos agentes.");
    }
}

async function insertAgent(newAgent) {
    try{
        const [agentInsertedID] = await db.insert(newAgent).into('agentes').returning("*");
        
        return {
            status: 201,
            data: {
                ...agentInsertedID,
                dataDeIncorporacao: new Date(agentInsertedID.dataDeIncorporacao).toISOString().split('T')[0]
            },
            msg: "Agente inserido com sucesso",
        };
    }catch(e){
        return createError(400, 'Erro ao realizar a inserção de um novo agente.')
    }
}

async function updateAgentById(agentID, agentToBeUpdated) {
    try{
        const hasAgentWithID = await db.select('*').from('agentes').where('agentes.id', agentID);

        if(!hasAgentWithID.length){
            return createError(404, `Não existe um agente com esse ID ${agentID}`);
        }

        let updatedAgent = await db('agentes')
                                .where('agentes.id', agentID)
                                .update(agentToBeUpdated)
                                .returning(['id', 'nome', 'dataDeIncorporacao', 'cargo']);

        if(!updatedAgent.length){
            return createError(400, `Não foi possível realizar a atualização do agente de ID: ${agentID}`);
        }

        const updatedAgentObject = Object.assign({}, updatedAgent[0]);

        return {
            status: 200,
            data:{
                ...updatedAgentObject,
                dataDeIncorporacao: new Date(updatedAgentObject.dataDeIncorporacao).toISOString().split('T')[0]
            },
            msg: `Agente de ID ${agentID} atualizado com sucesso.`
        }

    }catch(e){
        return createError(400, `Erro ao atualizar agente.`)
    }
}

async function patchAgentByID(agentID, req) {
    try{

        const hasAgentWithID = await db.select('*').from('agentes').where('agentes.id', agentID);
        
        if(!hasAgentWithID.length){
            return createError(404, `Não existe um agente com esse ID: ${agentID}`);
        }
    
        let patchedAgent = await db('agentes')
            .where('agentes.id', agentID)
            .update(req)
            .returning(['id', 'nome', 'dataDeIncorporacao', 'cargo']);
        
        if(!patchedAgent.length){
           return createError(400, `Não foi possível realizar a atualização do agente de ID: ${agentID}`);
        }

        const patchedAgentObject = Object.assign({}, patchedAgent[0]);

        return {
            status: 200,
            data:{
                ...patchedAgentObject,
                dataDeIncorporacao: new Date(patchedAgentObject.dataDeIncorporacao).toISOString().split('T')[0]
            },
            msg: `Agente parcialmente atualizado com sucesso.`
        }

    }catch(e){
        return createError(400, `Erro ao atualizar agente.`)
    }
}

async function deleteAgentById(agentID) {
    try{
        const hasAgentWithID = await db.select('*').from('agentes').where('agentes.id', agentID);
        
        if(!hasAgentWithID.length){
            return createError(404, `Não existe um agente com esse ID ${agentID}`);
        }

        const deletedAgent = await db('agentes')
                            .where('agentes.id', agentID)
                            .del();

        if(deletedAgent === 0){
            return createError(400, `Não foi possível realizar a exclusão do agente com ID: ${agentID}`);
        }

        return {
            status: 204, 
            data: null,
            msg: "Agente excluído com sucesso!"
        };
    }
    catch(e){
        return createError(400, `Erro ao excluir agente.`);
    }
}

module.exports = {
    findAllAgents,
    findByCargo,
    findAllAgentCases,
    sortByIncorporation,
    getAgentByID,
    insertAgent,
    updateAgentById,
    patchAgentByID,
    deleteAgentById
};
