import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { verificationSchema, insertLawyerSchema, insertVerificationRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Verify lawyer credentials
  app.post("/api/verify-lawyer", async (req, res) => {
    try {
      // First check individual field formats before full validation
      const { cnic, letterId } = req.body;
      
      // Check CNIC format
      const cnicPattern = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
      const letterPattern = /^LTR-[0-9]{5}$/;
      
      if (cnic && !cnicPattern.test(cnic)) {
        return res.status(400).json({
          error: "CNIC format is incorrect. Please use format: 12345-1234567-1",
          step: 1
        });
      }
      
      if (letterId && !letterPattern.test(letterId)) {
        return res.status(400).json({
          error: "Letter ID format is incorrect. Please use format: LTR-12345",
          step: 1
        });
      }
      
      // Now validate with full schema
      const validatedData = verificationSchema.parse(req.body);
      
      // Check if lawyer exists with both credentials
      const lawyer = await storage.getLawyerByCnicAndLetterId(validatedData.cnic, validatedData.letterId);
      
      if (lawyer) {
        return res.json({ 
          verified: true, 
          fullName: lawyer.fullName,
          step: 5
        });
      }
      
      // Check for partial matches to provide specific feedback
      const cnicMatch = await storage.getLawyerByCnic(validatedData.cnic);
      const letterMatch = await storage.getLawyerByLetterId(validatedData.letterId);
      
      if (cnicMatch && !letterMatch) {
        return res.json({ 
          verified: false, 
          error: "CNIC is correct, but Letter ID is incorrect. Please verify your Letter ID and try again.",
          step: 1
        });
      }
      
      if (letterMatch && !cnicMatch) {
        return res.json({ 
          verified: false, 
          error: "Letter ID is correct, but CNIC is incorrect. Please verify your CNIC and try again.",
          step: 1
        });
      }
      
      // No match found - create verification request for manual review
      await storage.createVerificationRequest({ cnic: validatedData.cnic, letterId: validatedData.letterId });
      
      return res.json({ 
        verified: false, 
        pending: true,
        message: "Your credentials are not in our database. Your request has been submitted for manual verification by our admin team.",
        step: 4
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: error.errors[0].message,
          step: 1
        });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all pending verification requests (Admin)
  app.get("/api/admin/verification-requests", async (req, res) => {
    try {
      const requests = await storage.getVerificationRequests();
      const pendingRequests = requests.filter(r => r.status === "pending");
      res.json(pendingRequests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Approve verification request (Admin)
  app.post("/api/admin/approve-verification/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { fullName } = req.body;
      
      if (!fullName) {
        return res.status(400).json({ error: "Full name is required" });
      }

      const requests = await storage.getVerificationRequests();
      const request = requests.find(r => r.id === id);
      
      if (!request) {
        return res.status(404).json({ error: "Verification request not found" });
      }

      // Create lawyer record
      await storage.createLawyer({
        cnic: request.cnic,
        letterId: request.letterId,
        fullName
      });

      // Update request status
      await storage.updateVerificationRequestStatus(id, "approved", "admin");
      
      // Delete the request since it's been processed
      await storage.deleteVerificationRequest(id);

      res.json({ success: true, message: "Lawyer approved and added to database" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reject verification request (Admin)
  app.post("/api/admin/reject-verification/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const requests = await storage.getVerificationRequests();
      const request = requests.find(r => r.id === id);
      
      if (!request) {
        return res.status(404).json({ error: "Verification request not found" });
      }

      // Update request status
      await storage.updateVerificationRequestStatus(id, "rejected", "admin");
      
      // Delete the request since it's been processed
      await storage.deleteVerificationRequest(id);

      res.json({ success: true, message: "Verification request rejected" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Add new lawyer directly (Admin)
  app.post("/api/admin/add-lawyer", async (req, res) => {
    try {
      const lawyerData = insertLawyerSchema.parse(req.body);
      
      // Check if lawyer already exists
      const existingLawyer = await storage.getLawyerByCnicAndLetterId(
        lawyerData.cnic, 
        lawyerData.letterId
      );
      
      if (existingLawyer) {
        return res.status(400).json({ error: "Lawyer with these credentials already exists" });
      }

      const lawyer = await storage.createLawyer(lawyerData);
      res.json({ success: true, lawyer });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all lawyers (Admin)
  app.get("/api/admin/lawyers", async (req, res) => {
    try {
      const lawyers = await storage.getAllLawyers();
      res.json(lawyers);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
