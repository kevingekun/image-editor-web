
export interface User {
  id: number;
  username: string;
  points: number;
}

export type OrderStatus = 'pending' | 'completed' | 'failed';

export interface Order {
  id: number;
  amount: number;
  pointsEarned: number;
  stripe_payment_id: string | null;
  status: OrderStatus;
  createdAt: string;
}

export interface ImageEdit {
  id: number;
  pointsDeducted: number;
  modelResult?: string | null;
  createdAt: string;
}

export interface PromptTemplate {
  id: number;
  templateType: string;
  imgOriginal: string;
  imgEdited: string; // comma-separated URLs
  prompt: string | null;
  description: string | null;
  createdAt: string | null;
}
