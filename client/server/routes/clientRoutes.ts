import express from 'express';
import { createClient, deleteClient, getClientById, getClients, updateClient } from '../controllers/clientController';
import { validate } from '../middleware/validate';
import { clientSchema, clientUpdateSchema } from '../validators/clientValidator';

const router = express.Router();

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', validate(clientSchema), createClient);
router.put('/:id', validate(clientUpdateSchema), updateClient);
router.delete('/:id', deleteClient);

export default router;
