export interface ClientPayload {
  id?: number;
  client_code: string;
  client_name: string;
  client_type: string;
  company_name?: string;
  mobile: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gst_number?: string;
  status: string;
  remarks?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getClients() {
  const response = await fetch(`${API_BASE}/clients`);
  if (!response.ok) throw new Error('Failed to load clients');
  return response.json();
}

export async function createClient(payload: ClientPayload) {
  const response = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create client');
  return response.json();
}

export async function updateClient(id: number, payload: ClientPayload) {
  const response = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update client');
  return response.json();
}

export async function deleteClient(id: number) {
  const response = await fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete client');
  return response.json();
}
