/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('casos').del();
  const agentes = await knex("agentes").select("id", "nome");
  await knex('casos').insert([
    {
      titulo: "Roubo ao mercado",
      descricao: "Ocorrido no bairro Centro às 21h.",
      status: "aberto",
      agente_id: agentes[0].id
    },
    {
      titulo: "Fraude bancária",
      descricao: "Transações suspeitas em conta PJ.",
      status: "solucionado",
      agente_id: agentes[1].id
    }
  ]);
};
