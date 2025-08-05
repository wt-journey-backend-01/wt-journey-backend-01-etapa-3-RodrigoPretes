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
 *           format: uuid
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Agente encontrado
 *       404:
 *         description: Agente não encontrado
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
 *           format: uuid
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
 *           format: uuid
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
 *           format: uuid
 *     responses:
 *       200:
 *         description: Agente deletado com sucesso
 *       404:
 *         description: Agente não encontrado
 */

router.get('/agentes', agentesController.getAllAgentes);
router.get('/agentes/:id', agentesController.getAgenteByID);
router.post('/agentes', agentesController.insertAgente);
router.put('/agentes/:id', agentesController.updateAgenteById);
router.patch('/agentes/:id', agentesController.patchAgenteByID);
router.delete('/agentes/:id', agentesController.deleteAgenteById);

module.exports = router;
