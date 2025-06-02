import { useState } from "react";
import { VerificationForm } from "@/components/VerificationForm";
import { StepCards } from "@/components/StepCards";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, ArrowLeft, IdCard, FileText, Shield, Settings } from "lucide-react";

export default function LawyerVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const goHome = () => {
    window.location.href = '/';
  };

  const registerAsLawyer = () => {
    alert("Registration feature will be implemented. You would be redirected to the registration form.");
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
              <span className="text-xl font-semibold text-gray-900">Legal Connect</span>
            </div>
            
            {/* Back to Home Button */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Verification Section */}
          <div className="lg:col-span-2">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lawyer Verification</h1>
              <p className="text-lg text-gray-600">Verify your credentials to access legal services</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Verification Process</h2>
                <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
              </div>
              
              <StepCards currentStep={currentStep} />
            </div>

            {/* Verification Form */}
            {!showSuccess && (
              <VerificationForm 
                onStepChange={setCurrentStep}
                onResult={setVerificationResult}
                onSuccess={(result) => {
                  setShowSuccess(true);
                  setVerificationResult(result);
                }}
              />
            )}

            {/* Success Panel */}
            {showSuccess && verificationResult && (
              <Card className="fade-in">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Verification Successful!</h3>
                    <p className="text-gray-600 mb-6">
                      Welcome, <span className="font-semibold">{verificationResult.fullName}</span>
                    </p>
                    <Button 
                      onClick={registerAsLawyer}
                      className="bg-[#2D4A52] hover:bg-[#2D4A52]/90 text-white"
                    >
                      Register as Lawyer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Help */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <IdCard className="text-[#2D4A52] mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="font-medium text-gray-900">CNIC Format</p>
                      <p className="text-sm text-gray-600">Use format: 12345-1234567-1</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FileText className="text-[#2D4A52] mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="font-medium text-gray-900">Letter ID</p>
                      <p className="text-sm text-gray-600">Starts with LTR- followed by 5 digits</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="text-[#2D4A52] mt-1 mr-3 h-5 w-5" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Process</p>
                      <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Stories Carousel */}
            <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Successfully Verified Lawyers
                </h3>
                <div className="relative overflow-hidden">
                  <div className="flex animate-slide space-x-4">
                    {/* First set of lawyers */}
                    <div className="flex-shrink-0 bg-white rounded-lg p-4 shadow-sm border border-teal-100 w-64">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">AS</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Advocate Ayesha Siddiqi</p>
                          <p className="text-sm text-gray-600">Family Law Specialist</p>
                          <p className="text-xs text-teal-600">Verified ✓</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 bg-white rounded-lg p-4 shadow-sm border border-teal-100 w-64">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">KM</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Barrister Khalid Mehmood</p>
                          <p className="text-sm text-gray-600">Corporate Law Expert</p>
                          <p className="text-xs text-teal-600">Verified ✓</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 bg-white rounded-lg p-4 shadow-sm border border-teal-100 w-64">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">SK</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Advocate Sarah Khan</p>
                          <p className="text-sm text-gray-600">Criminal Defense</p>
                          <p className="text-xs text-teal-600">Verified ✓</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 bg-white rounded-lg p-4 shadow-sm border border-teal-100 w-64">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">AR</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Advocate Ali Rahman</p>
                          <p className="text-sm text-gray-600">Property Law</p>
                          <p className="text-xs text-teal-600">Verified ✓</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 bg-white rounded-lg p-4 shadow-sm border border-teal-100 w-64">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">MH</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Ms. Maria Hassan</p>
                          <p className="text-sm text-gray-600">Human Rights Law</p>
                          <p className="text-xs text-teal-600">Verified ✓</p>
                        </div>
                      </div>
                    </div>

                    {/* Duplicate set for continuous scroll */}
                    <div className="flex-shrink-0 bg-white rounded-lg p-4 shadow-sm border border-teal-100 w-64">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">AS</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Advocate Ayesha Siddiqi</p>
                          <p className="text-sm text-gray-600">Family Law Specialist</p>
                          <p className="text-xs text-teal-600">Verified ✓</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 bg-white rounded-lg p-4 shadow-sm border border-teal-100 w-64">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">KM</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Barrister Khalid Mehmood</p>
                          <p className="text-sm text-gray-600">Corporate Law Expert</p>
                          <p className="text-xs text-teal-600">Verified ✓</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">Join hundreds of verified legal professionals</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Floating Chatbot */}
      <FloatingChatbot />

      {/* Admin Panel */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </div>
  );
}
