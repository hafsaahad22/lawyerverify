import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLawyerSchema, type InsertLawyer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { X, Check, XCircle, Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<InsertLawyer>({
    resolver: zodResolver(insertLawyerSchema),
    defaultValues: {
      cnic: "",
      letterId: "",
      fullName: "",
    },
  });

  // Fetch pending verification requests
  const { data: pendingRequests = [], isLoading } = useQuery({
    queryKey: ["/api/admin/verification-requests"],
    enabled: isOpen,
  });

  // Approve verification mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, fullName }: { id: number; fullName: string }) => {
      const response = await apiRequest("POST", `/api/admin/approve-verification/${id}`, { fullName });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification-requests"] });
      setSelectedRequest(null);
      toast({
        title: "Success",
        description: "Lawyer approved and added to database!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve verification",
        variant: "destructive",
      });
    },
  });

  // Reject verification mutation
  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/admin/reject-verification/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification-requests"] });
      toast({
        title: "Success",
        description: "Verification request rejected!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject verification",
        variant: "destructive",
      });
    },
  });

  // Add new lawyer mutation
  const addLawyerMutation = useMutation({
    mutationFn: async (data: InsertLawyer) => {
      const response = await apiRequest("POST", "/api/admin/add-lawyer", data);
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      setShowAddForm(false);
      toast({
        title: "Success",
        description: "Lawyer added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add lawyer",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (request: any) => {
    const fullName = prompt("Enter the lawyer's full name:");
    if (fullName) {
      approveMutation.mutate({ id: request.id, fullName });
    }
  };

  const handleReject = (request: any) => {
    if (confirm("Are you sure you want to reject this verification?")) {
      rejectMutation.mutate(request.id);
    }
  };

  const onSubmit = (data: InsertLawyer) => {
    addLawyerMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2D4A52]">
            Admin Panel - Manual Verification
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] space-y-6">
          {/* Pending Verifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Verifications</h3>
            
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : pendingRequests.length === 0 ? (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>No pending verifications</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request: any) => (
                  <Card key={request.id} className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">CNIC: {request.cnic}</p>
                          <p className="text-gray-600">Letter ID: {request.letterId}</p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(request.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleApprove(request)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                            size="sm"
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(request)}
                            variant="destructive"
                            size="sm"
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add New Lawyer */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Verified Lawyer</h3>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#2D4A52] hover:bg-[#2D4A52]/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                {showAddForm ? "Cancel" : "Add Lawyer"}
              </Button>
            </div>

            {showAddForm && (
              <Card>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="cnic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CNIC</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="12345-1234567-1"
                                  {...field}
                                  className="focus:ring-2 focus:ring-[#2D4A52]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="letterId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Letter ID</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="LTR-12345"
                                  {...field}
                                  className="focus:ring-2 focus:ring-[#2D4A52]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Full Name"
                                  {...field}
                                  className="focus:ring-2 focus:ring-[#2D4A52]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[#2D4A52] hover:bg-[#2D4A52]/90"
                        disabled={addLawyerMutation.isPending}
                      >
                        {addLawyerMutation.isPending ? "Adding..." : "Add Lawyer"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
