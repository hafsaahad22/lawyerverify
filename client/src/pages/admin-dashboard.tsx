import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLawyerSchema, type InsertLawyer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { Check, XCircle, Plus, Clock, Shield, Users, UserPlus, Scale, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
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

  const goHome = () => {
    window.location.href = '/';
  };

  // Fetch pending verification requests
  const { data: pendingRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/admin/verification-requests"],
  });

  // Fetch all lawyers
  const { data: lawyers = [], isLoading: lawyersLoading } = useQuery({
    queryKey: ["/api/admin/lawyers"],
  });

  // Approve verification mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, fullName }: { id: number; fullName: string }) => {
      const response = await apiRequest("POST", `/api/admin/approve-verification/${id}`, { fullName });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lawyers"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/lawyers"] });
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

  const formatCnic = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length >= 5 && numbers.length < 12) {
      return numbers.slice(0, 5) + '-' + numbers.slice(5);
    } else if (numbers.length >= 12) {
      return numbers.slice(0, 5) + '-' + numbers.slice(5, 12) + '-' + numbers.slice(12, 13);
    }
    return numbers;
  };

  const formatLetterId = (value: string) => {
    const upper = value.toUpperCase();
    if (!upper.startsWith('LTR-') && value.length > 0) {
      const numbers = upper.replace(/[^0-9]/g, '');
      return 'LTR-' + numbers;
    }
    return upper;
  };

  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#2D4A52] rounded-full flex items-center justify-center">
                <Scale className="text-white text-sm" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Legal Connect Admin</span>
            </div>
            
            {/* Back Button */}
            <Button 
              onClick={goHome}
              variant="outline"
              className="border-[#2D4A52] text-[#2D4A52] hover:bg-[#2D4A52] hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                  <p className="text-gray-600">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{lawyers.length}</p>
                  <p className="text-gray-600">Verified Lawyers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-gray-600">Security Level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Verifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#2D4A52]">
                Pending Verifications
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {requestsLoading ? (
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
            </CardContent>
          </Card>

          {/* Add New Lawyer */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-[#2D4A52]">Add New Lawyer</CardTitle>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-[#2D4A52] hover:bg-[#2D4A52]/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddForm ? "Cancel" : "Add Lawyer"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddForm && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="cnic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CNIC</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="12345-1234567-1"
                              maxLength={15}
                              {...field}
                              onChange={(e) => {
                                const formatted = formatCnic(e.target.value);
                                field.onChange(formatted);
                              }}
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
                              maxLength={9}
                              {...field}
                              onChange={(e) => {
                                const formatted = formatLetterId(e.target.value);
                                field.onChange(formatted);
                              }}
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

                    <Button
                      type="submit"
                      className="w-full bg-[#2D4A52] hover:bg-[#2D4A52]/90"
                      disabled={addLawyerMutation.isPending}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {addLawyerMutation.isPending ? "Adding..." : "Add Lawyer"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Verified Lawyers List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#2D4A52]">
              Verified Lawyers ({lawyers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {lawyersLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lawyers.map((lawyer: any) => (
                  <Card key={lawyer.id} className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{lawyer.fullName}</p>
                          <p className="text-sm text-gray-600">CNIC: {lawyer.cnic}</p>
                          <p className="text-sm text-gray-600">Letter: {lawyer.letterId}</p>
                          <p className="text-xs text-gray-500">
                            Added: {new Date(lawyer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Shield className="h-5 w-5 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}