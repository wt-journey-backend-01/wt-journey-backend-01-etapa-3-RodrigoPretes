const { createError } = require('../utils/errorHandler');
const db = require('../db/db');

async function findAllCases() {
    try{

        const cases = await db.select('*').from('casos')
        
        if(!cases.length){
            return createError(404, `Não foram encontrados casos na base de dados.`)
        }


        return {
            status: 200,
            data: cases,
            msg: "Lista de casos obtida com sucesso"
        }
    }catch(e){
        return createError(400, `Erro ao realizar a busca dos casos na base de dados.`)
    }
}

async function findByStatus(status) {
    try{

        const caseByStatus = await db.select('*').from('casos').where('casos.status', status);

        if(!caseByStatus.length){
            return createError(404, `Não foram encontrados nenhum caso com o status: ${status}`);
        }

        return {
            status: 200,
            data: caseByStatus,
            msg: `Casos com status '${status}' encontrados com sucesso`
        };
    }catch(e){
        return createError(400, `Erro ao realizar a busca dos casos com o status informado.`);
    }
}

async function findByAgent(agente_id) {
    try{
        const casesByAgent = await db.select('*').from('casos').where('casos.agente_id', agente_id);

        if(!casesByAgent.length){
            return createError(404, `Não forma encontrados casos para o agente informado com ID: ${agente_id}`);
        }


        return {
            status: 200,
            data: casesByAgent,
            msg: `Casos para o agente com ID '${agente_id}' encontrados com sucesso`
        };

    }catch(e){
        return createError(400, `Erro ao realizar a busca dos casos para o agente informado.`)
    }
}

async function getCaseByID(id) {
    try{
        const caseByID = await db.select('*').from('casos').where('casos.id', id);

        if(!caseByID.length){
            return createError(404, `Não foram encontrados casos para o ID: ${id}.`)
        }

        return {
                status: 200,
                data: caseByID[0],
                msg: "Caso encontrado com sucesso"
            };
    }catch(e){
        return createError(400, `Erro ao realizar a busca do caso para o ID informado.`)
    }
}

async function insertCase(newCase){
    try{    
        const [caseInsertedID] = await db.insert(newCase).into('casos').returning('*');
        return {
            status: 201,
            data: {
                ...caseInsertedID
            },
            msg: "Caso inserido com sucesso"
        };
    }catch(e){
        return createError(400, `Ocorreu um erro ao realizar a inserção de um novo caso.`)
    }
}

async function updateCaseById(caseID, caseToBeUpdated){
    try{
        const hasCaseWithID = await db.select('*').from('casos').where('casos.id', caseID);

        if(!hasCaseWithID.length){
            return createError(404, `Não foram encontrados casos para o ID: ${caseID}.`)
        }

        let updatedCase = await db('casos')
                                .where('casos.id', caseID)
                                .update(caseToBeUpdated)
                                .returning('*');

        if(!updatedCase.length){
            return createError(400, `Não foi possível realizar a atualização do caso com o ID informado.`)
        }

        const updatedAgentObject = Object.assign({}, updatedCase[0]);

        return {
            status: 200,
            data: {...updatedAgentObject},
            msg: `Caso atualizado com sucesso.`
        }

    }catch(e){
        return createError(400, "Erro ao realizar a atualização do caso informado.")
    }

}

async function patchCaseByID(caseID, caseToBePatched){
    try{

        const hasCaseWithID = await db.select('*').from('casos').where('casos.id', caseID);
        
        if(!hasCaseWithID.length){
            return createError(404, `Não existe um caso com esse ID: ${caseID}`);
        }
    
        let patchedAgent = await db('casos')
            .where('casos.id', caseID)
            .update(caseToBePatched)
            .returning('*');
        
        if(!patchedAgent.length){
            return createError(400, `Não foi possível realizar a atualização do caso de ID: ${caseID}`);
        }

        const patchAgentObject = Object.assign({}, patchedAgent[0]);

        return {
            status: 200,
            data: patchAgentObject,
            msg: `Caso atualizado parcialmente com sucesso.`
        }

    }catch(e){
        return createError(400, `Erro ao atualizar caso.`)
    }
}

async function deleteCaseById(caseID){
    try{
        const hasCaseWithID = await db.select('*').from('casos').where('casos.id', caseID);
        
        if(!hasCaseWithID.length){
            return createError(404, `Não existe um caso com esse ID: ${caseID}`);
        }

        const deletedAgent = await db('casos')
                            .where('casos.id', caseID)
                            .del();

        if(deletedAgent === 0){
            return createError(400, `Não foi possível realizar a exclusão do caso com ID: ${caseID}`);
        }

        return {
            status: 204, 
            data: null,
            msg: "Caso excluído com sucesso!"
        };
    }
    catch(e){
        return createError(400, `Erro ao excluir caso.`);
    }
}

module.exports = {
    findAllCases,
    findByStatus,
    findByAgent,
    getCaseByID,
    insertCase,
    updateCaseById,
    patchCaseByID,
    deleteCaseById
}