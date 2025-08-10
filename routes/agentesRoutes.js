const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');

/**
 * @swagger
 * tags:
 *   name: Agentes
 *   description: Endpoints relacionados aos agentes policiais
 */

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Lista todos os agentes
 *     tags: [Agentes]
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *         required: false
 *         description: "Filtra os agentes pelo cargo (ex: 'delegado')"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [dataDeIncorporacao, -dataDeIncorporacao]
 *         required: false
 *         description: Ordena os agentes pela data de incorporação
 *     responses:
 *       200:
 *         description: Lista de agentes retornada com sucesso
 */

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Retorna um agente pelo ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Agente encontrado
 *       404:
 *         description: Agente não encontrado
 */

/**
 * @swagger
 * /agentes/{id}/casos:
 *   get:
 *     summary: Retorna todos os casos do agente informado
 *     description: Lista os casos associados ao agente via `agente_id`.
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Lista de casos do agente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseCases'
 *             examples:
 *               sucesso:
 *                 value:
 *                   status: 200
 *                   msg: "Casos do agente retornados com sucesso."
 *                   data:
 *                     - id: 10
 *                       titulo: "Roubo ao mercado"
 *                       descricao: "Ocorrido no bairro Centro às 21h."
 *                       status: "aberto"
 *                       agente_id: 1
 *                     - id: 11
 *                       titulo: "Fraude bancária"
 *                       descricao: "Transações suspeitas em conta PJ."
 *                       status: "solucionado"
 *                       agente_id: 1
 *       404:
 *         description: Agente não encontrado ou sem casos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseCases'
 *             examples:
 *               naoEncontrado:
 *                 value:
 *                   status: 404
 *                   msg: "Agente de id 8 não foi encontrado na nossa base de dados."
 *                   data: null
 *       400:
 *         description: Parâmetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               idInvalido:
 *                 value:
 *                   status: 400
 *                   msg: "ID inválido, deve ser número inteiro positivo."
 *                   data: null
 */

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cria um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataDeIncorporacao
 *               - cargo
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *                 example: "delegado"
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *       400:
 *         description: Parâmetros inválidos
 */

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataDeIncorporacao
 *               - cargo
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *               cargo:
 *                 type: string
 *     responses:
 *       204:
 *         description: Agente atualizado com sucesso
 *       404:
 *         description: Agente não encontrado
 */

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *               cargo:
 *                 type: string
 *     responses:
 *       204:
 *         description: Agente parcialmente atualizado com sucesso
 *       404:
 *         description: Agente não encontrado
 */

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente do sistema
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: id
 *     responses:
 *       200:
 *         description: Agente deletado com sucesso
 *       404:
 *         description: Agente não encontrado
 */

router.get('/agentes', agentesController.getAllAgentes);
router.get('/agentes/:id', agentesController.getAgenteByID);
router.get('/agentes/:id/casos', agentesController.getAllAgentCases);
router.post('/agentes', agentesController.insertAgente);
router.put('/agentes/:id', agentesController.updateAgenteById);
router.patch('/agentes/:id', agentesController.patchAgenteByID);
router.delete('/agentes/:id', agentesController.deleteAgenteById);

module.exports = router;
