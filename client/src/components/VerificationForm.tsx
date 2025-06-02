import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { verificationSchema, type VerificationInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { Shield, AlertTriangle, Clock } from "lucide-react";

interface VerificationFormProps {
  onStepChange: (step: number) => void;
  onResult: (result: any) => void;
  onSuccess: (result: any) => void;
}

export function VerificationForm({ onStepChange, onResult, onSuccess }: VerificationFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const form = useForm<VerificationInput>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      cnic: "",
      letterId: "",
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: VerificationInput) => {
      const response = await apiRequest("POST", "/api/verify-lawyer", data);
      return response.json();
    },
    onSuccess: (result) => {
      setError(null);
      setPendingMessage(null);
      onResult(result);
      
      if (result.verified) {
        onStepChange(5);
        onSuccess(result);
      } else if (result.pending) {
        onStepChange(4);
        setPendingMessage(result.message);
      } else if (result.error) {
        onStepChange(1);
        setError(result.error);
      }
    },
    onError: (error: any) => {
      setError(error.message || "An error occurred during verification");
      onStepChange(1);
    },
  });

  const onSubmit = (data: VerificationInput) => {
    setError(null);
    setPendingMessage(null);
    onStepChange(2);
    
    setTimeout(() => {
      onStepChange(3);
      verifyMutation.mutate(data);
    }, 1500);
  };

  // Format CNIC input
  const formatCnic = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length >= 5 && numbers.length < 12) {
      return numbers.slice(0, 5) + '-' + numbers.slice(5);
    } else if (numbers.length >= 12) {
      return numbers.slice(0, 5) + '-' + numbers.slice(5, 12) + '-' + numbers.slice(12, 13);
    }
    return numbers;
  };

  // Format Letter ID input
  const formatLetterId = (value: string) => {
    const upper = value.toUpperCase();
    if (!upper.startsWith('LTR-') && value.length > 0) {
      const numbers = upper.replace(/[^0-9]/g, '');
      return 'LTR-' + numbers;
    }
    return upper;
  };

  return (
    <>
      <Card className="mb-8">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cnic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        CNIC Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12345-1234567-1"
                          maxLength={15}
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCnic(e.target.value);
                            field.onChange(formatted);
                          }}
                          className="focus:ring-2 focus:ring-[#2D4A52] focus:border-transparent"
                        />
                      </FormControl>
                      <FormDescription>
                        Format: xxxxx-xxxxxxx-x
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="letterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Letter ID <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="LTR-12345"
                          maxLength={9}
                          {...field}
                          onChange={(e) => {
                            const formatted = formatLetterId(e.target.value);
                            field.onChange(formatted);
                          }}
                          className="focus:ring-2 focus:ring-[#2D4A52] focus:border-transparent"
                        />
                      </FormControl>
                      <FormDescription>
                        Format: LTR-xxxxx
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#2D4A52] hover:bg-[#2D4A52]/90 text-white font-semibold py-4"
                disabled={verifyMutation.isPending}
              >
                <Shield className="mr-2 h-4 w-4" />
                {verifyMutation.isPending ? "Verifying..." : "Start Verification"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6 fade-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Pending Message */}
      {pendingMessage && (
        <Alert className="mb-6 fade-in border-yellow-500 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-700">
            <div>
              <p className="font-medium">Verification Pending</p>
              <p className="text-sm">{pendingMessage}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
