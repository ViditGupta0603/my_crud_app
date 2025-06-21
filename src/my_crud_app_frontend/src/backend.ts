import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/my_crud_app_backend';

const canisterId = import.meta.env.VITE_MY_CRUD_APP_BACKEND_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

const agent = new HttpAgent({
  host: import.meta.env.DEV ? 'http://localhost:4943' : 'https://ic0.app',
});

// Fetch root key for certificate validation during development
if (import.meta.env.DEV) {
  agent.fetchRootKey().catch(err => {
    console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
    console.error(err);
  });
}

export const backend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

export type Task = {
  id: bigint;
  title: string;
  description: string;
  completed: boolean;
  created_at: bigint;
  updated_at: bigint;
};

export type CreateTaskInput = {
  title: string;
  description: string;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  completed?: boolean;
};