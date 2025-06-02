import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, HelpCircle } from "lucide-react";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);

  const faqs = [
    {
      id: "cnic",
      question: "What is CNIC format?",
      answer: "CNIC should be in the format: 12345-1234567-1. This is a 13-digit number with dashes after the 5th and 12th digits."
    },
    {
      id: "verify",
      question: "Why do I need to verify?",
      answer: "Verification ensures that only qualified and registered lawyers can access our platform, maintaining trust and quality of legal services."
    },
    {
      id: "safety",
      question: "Is my data safe?",
      answer: "Yes, your data is completely safe. We use advanced encryption and follow strict privacy protocols to protect your information."
    },
    {
      id: "after",
      question: "What happens after verification?",
      answer: "After successful verification, you can register as a lawyer on our platform and start offering legal services to clients."
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
        <Card className="absolute bottom-16 right-0 w-80 shadow-xl slide-up">
          <CardHeader className="bg-[#2D4A52] text-white rounded-t-lg">
            <CardTitle className="text-sm font-semibold">FAQ Assistant</CardTitle>
            <p className="text-xs opacity-90">Click any question below</p>
          </CardHeader>
          <CardContent className="p-4 max-h-80 overflow-y-auto">
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left p-3 bg-gray-50 hover:bg-gray-100 h-auto"
                    onClick={() => handleFAQClick(faq.id)}
                  >
                    <HelpCircle className="text-[#2D4A52] mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{faq.question}</span>
                  </Button>
                  
                  {selectedFAQ === faq.id && (
                    <div className="mt-2 bg-[#2D4A52]/5 border-l-4 border-[#2D4A52] p-3 rounded fade-in">
                      <p className="text-sm text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toggle Button */}
      <Button
        onClick={toggleChatbot}
        className="w-14 h-14 bg-[#2D4A52] hover:bg-[#2D4A52]/90 text-white rounded-full shadow-lg transform transition-all hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
