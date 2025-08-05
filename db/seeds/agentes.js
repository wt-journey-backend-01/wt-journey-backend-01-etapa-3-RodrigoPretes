/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('agentes').del();
  await knex('agentes').insert([
    {   
      nome: "Rommel Carneiro",
      dataDeIncorporacao: "1992-10-04",
      cargo: "delegado"
    },
    {        
      nome: "Rodrigo Pretes",
      dataDeIncorporacao: "2022-10-21",
      cargo: "inspetor"
    },
  ]);
};
