import { apiRequest } from "./queryClient";

export interface VerificationResult {
  verified: boolean;
  fullName?: string;
  error?: string;
  pending?: boolean;
  message?: string;
  step: number;
}

export interface VerificationRequest {
  id: number;
  cnic: string;
  letterId: string;
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Lawyer {
  id: number;
  cnic: string;
  letterId: string;
  fullName: string;
  verified: boolean;
  createdAt: string;
}

export const verifyLawyer = async (cnic: string, letterId: string): Promise<VerificationResult> => {
  const response = await apiRequest("POST", "/api/verify-lawyer", { cnic, letterId });
  return response.json();
};

export const getVerificationRequests = async (): Promise<VerificationRequest[]> => {
  const response = await apiRequest("GET", "/api/admin/verification-requests");
  return response.json();
};

export const approveVerification = async (id: number, fullName: string): Promise<void> => {
  await apiRequest("POST", `/api/admin/approve-verification/${id}`, { fullName });
};

export const rejectVerification = async (id: number): Promise<void> => {
  await apiRequest("POST", `/api/admin/reject-verification/${id}`);
};

export const addLawyer = async (lawyer: { cnic: string; letterId: string; fullName: string }): Promise<Lawyer> => {
  const response = await apiRequest("POST", "/api/admin/add-lawyer", lawyer);
  return response.json();
};

export const getAllLawyers = async (): Promise<Lawyer[]> => {
  const response = await apiRequest("GET", "/api/admin/lawyers");
  return response.json();
};
