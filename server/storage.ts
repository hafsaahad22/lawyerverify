import { 
  users, 
  lawyers, 
  verificationRequests,
  type User, 
  type InsertUser,
  type Lawyer,
  type InsertLawyer,
  type VerificationRequest,
  type InsertVerificationRequest
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lawyer operations
  getLawyerByCnic(cnic: string): Promise<Lawyer | undefined>;
  getLawyerByLetterId(letterId: string): Promise<Lawyer | undefined>;
  getLawyerByCnicAndLetterId(cnic: string, letterId: string): Promise<Lawyer | undefined>;
  createLawyer(lawyer: InsertLawyer): Promise<Lawyer>;
  getAllLawyers(): Promise<Lawyer[]>;
  
  // Verification request operations
  createVerificationRequest(request: InsertVerificationRequest): Promise<VerificationRequest>;
  getVerificationRequests(): Promise<VerificationRequest[]>;
  updateVerificationRequestStatus(id: number, status: string, reviewedBy?: string): Promise<VerificationRequest | undefined>;
  deleteVerificationRequest(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private lawyers: Map<number, Lawyer>;
  private verificationRequests: Map<number, VerificationRequest>;
  private currentUserId: number;
  private currentLawyerId: number;
  private currentVerificationRequestId: number;

  constructor() {
    this.users = new Map();
    this.lawyers = new Map();
    this.verificationRequests = new Map();
    this.currentUserId = 1;
    this.currentLawyerId = 1;
    this.currentVerificationRequestId = 1;
    
    // Initialize with some demo lawyers
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoLawyers = [
      {
        cnic: "12345-1234567-1",
        letterId: "LTR-12345",
        fullName: "Advocate Ayesha Siddiqi",
        verified: true,
        createdAt: new Date(),
      },
      {
        cnic: "98765-7654321-9",
        letterId: "LTR-54321",
        fullName: "Barrister Khalid Mehmood",
        verified: true,
        createdAt: new Date(),
      },
      {
        cnic: "11111-1111111-1",
        letterId: "LTR-11111",
        fullName: "Advocate Sarah Khan",
        verified: true,
        createdAt: new Date(),
      }
    ];

    demoLawyers.forEach(lawyer => {
      const id = this.currentLawyerId++;
      this.lawyers.set(id, { ...lawyer, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLawyerByCnic(cnic: string): Promise<Lawyer | undefined> {
    return Array.from(this.lawyers.values()).find(
      (lawyer) => lawyer.cnic === cnic && lawyer.verified
    );
  }

  async getLawyerByLetterId(letterId: string): Promise<Lawyer | undefined> {
    return Array.from(this.lawyers.values()).find(
      (lawyer) => lawyer.letterId === letterId && lawyer.verified
    );
  }

  async getLawyerByCnicAndLetterId(cnic: string, letterId: string): Promise<Lawyer | undefined> {
    return Array.from(this.lawyers.values()).find(
      (lawyer) => lawyer.cnic === cnic && lawyer.letterId === letterId && lawyer.verified
    );
  }

  async createLawyer(insertLawyer: InsertLawyer): Promise<Lawyer> {
    const id = this.currentLawyerId++;
    const lawyer: Lawyer = { 
      ...insertLawyer, 
      id, 
      verified: true,
      createdAt: new Date() 
    };
    this.lawyers.set(id, lawyer);
    return lawyer;
  }

  async getAllLawyers(): Promise<Lawyer[]> {
    return Array.from(this.lawyers.values());
  }

  async createVerificationRequest(insertRequest: InsertVerificationRequest): Promise<VerificationRequest> {
    const id = this.currentVerificationRequestId++;
    const request: VerificationRequest = { 
      ...insertRequest, 
      id,
      status: "pending",
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null
    };
    this.verificationRequests.set(id, request);
    return request;
  }

  async getVerificationRequests(): Promise<VerificationRequest[]> {
    return Array.from(this.verificationRequests.values());
  }

  async updateVerificationRequestStatus(id: number, status: string, reviewedBy?: string): Promise<VerificationRequest | undefined> {
    const request = this.verificationRequests.get(id);
    if (!request) return undefined;

    const updatedRequest: VerificationRequest = {
      ...request,
      status,
      reviewedAt: new Date(),
      reviewedBy: reviewedBy || null
    };
    
    this.verificationRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteVerificationRequest(id: number): Promise<boolean> {
    return this.verificationRequests.delete(id);
  }
}

export const storage = new MemStorage();
