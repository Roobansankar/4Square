import { pool } from '../config/db';
import type { Request, Response } from 'express';

export const getClients = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clients', error });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    const clients = rows as Array<Record<string, unknown>>;
    if (!clients.length) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(clients[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch client', error });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { client_code, client_name, client_type, company_name, mobile, email, address, city, state, pincode, gst_number, status, remarks } = req.body;
    const [result] = await pool.query(
      'INSERT INTO clients (client_code, client_name, client_type, company_name, mobile, email, address, city, state, pincode, gst_number, status, remarks, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [client_code, client_name, client_type, company_name, mobile, email, address, city, state, pincode, gst_number, status, remarks]
    );
    const insertId = (result as { insertId: number }).insertId;
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [insertId]);
    res.status(201).json((rows as Array<Record<string, unknown>>)[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create client', error });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { client_code, client_name, client_type, company_name, mobile, email, address, city, state, pincode, gst_number, status, remarks } = req.body;
    await pool.query(
      'UPDATE clients SET client_code = ?, client_name = ?, client_type = ?, company_name = ?, mobile = ?, email = ?, address = ?, city = ?, state = ?, pincode = ?, gst_number = ?, status = ?, remarks = ?, updated_at = NOW() WHERE id = ?',
      [client_code, client_name, client_type, company_name, mobile, email, address, city, state, pincode, gst_number, status, remarks, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    res.json((rows as Array<Record<string, unknown>>)[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update client', error });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete client', error });
  }
};
