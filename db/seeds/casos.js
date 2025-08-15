/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('casos').del();
  await knex('casos').insert([
    {
      titulo: "Roubo ao mercado",
      descricao: "Ocorrido no bairro Centro às 21h.",
      status: "aberto",
      agente_id: 1
    },
    {
      titulo: "Fraude bancária",
      descricao: "Transações suspeitas em conta PJ.",
      status: "solucionado",
      agente_id: 2
    }
  ]);
};
