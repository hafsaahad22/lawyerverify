import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, HelpCircle, X, Shield, Clock, FileText, UserCheck } from "lucide-react";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);

  const faqs = [
    {
      id: "cnic",
      question: "What is CNIC format?",
      answer: "CNIC should be in the format: 12345-1234567-1. This is a 13-digit number with dashes after the 5th and 12th digits.",
      icon: FileText
    },
    {
      id: "letter",
      question: "What is Letter ID format?",
      answer: "Letter ID should start with 'LTR-' followed by exactly 5 digits. Example: LTR-12345",
      icon: FileText
    },
    {
      id: "verify",
      question: "Why do I need to verify?",
      answer: "Verification ensures that only qualified and registered lawyers can access our platform, maintaining trust and quality of legal services.",
      icon: UserCheck
    },
    {
      id: "safety",
      question: "Is my data safe?",
      answer: "Yes, your data is completely safe. We use advanced encryption and follow strict privacy protocols to protect your information.",
      icon: Shield
    },
    {
      id: "after",
      question: "What happens after verification?",
      answer: "After successful verification, you can register as a lawyer on our platform and start offering legal services to clients.",
      icon: UserCheck
    },
    {
      id: "time",
      question: "How long does verification take?",
      answer: "Automatic verification is instant. If manual review is needed, it typically takes 24-48 hours for admin approval.",
      icon: Clock
    },
    {
      id: "rejected",
      question: "What if my verification is rejected?",
      answer: "You can contact our support team to understand the reason and resubmit with correct information if needed.",
      icon: HelpCircle
    },
    {
      id: "multiple",
      question: "Can I verify multiple credentials?",
      answer: "Each CNIC and Letter ID combination represents one lawyer profile. Contact support for multiple credential management.",
      icon: UserCheck
    }
  ];

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedFAQ(null);
    }
  };

  const handleFAQClick = (faqId: string) => {
    setSelectedFAQ(selectedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chatbot Panel */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-96 shadow-2xl slide-up border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg relative">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Legal Assistant</CardTitle>
                <p className="text-sm opacity-90">Get instant help with verification</p>
              </div>
              <Button
                onClick={toggleChatbot}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-96 overflow-y-auto bg-gray-50">
            <div className="space-y-1 p-4">
              {faqs.map((faq) => {
                const IconComponent = faq.icon;
                return (
                  <div key={faq.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left p-3 bg-white hover:bg-teal-50 border border-gray-200 hover:border-teal-200 h-auto rounded-lg shadow-sm"
                      onClick={() => handleFAQClick(faq.id)}
                    >
                      <IconComponent className="text-teal-600 mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{faq.question}</span>
                    </Button>
                    
                    {selectedFAQ === faq.id && (
                      <div className="mt-2 mb-3 bg-teal-50 border border-teal-200 p-4 rounded-lg fade-in">
                        <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toggle Button */}
      <Button
        onClick={toggleChatbot}
        className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-full shadow-xl transform transition-all hover:scale-105 border-2 border-white"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    </div>
  );
}
