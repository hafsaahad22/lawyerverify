import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, HelpCircle, X, Shield, Clock, FileText, UserCheck, Send, Camera } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'faq' | 'chat'>('faq');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setChatMode('faq');
    }
  };

  const handleFAQClick = (faqId: string) => {
    setSelectedFAQ(selectedFAQ === faqId ? null : faqId);
  };

  const switchToChatMode = () => {
    setChatMode('chat');
    if (messages.length === 0) {
      addBotMessage("Hello! I'm here to help with your lawyer verification questions. You can ask me anything or use the scan feature for CNIC recognition.");
    }
  };

  const addBotMessage = (message: string) => {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const addUserMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('cnic') && input.includes('format')) {
      return "CNIC should be in format: 12345-1234567-1 (5 digits, hyphen, 7 digits, hyphen, 1 digit). You can also use the scan feature to automatically extract CNIC from your card image.";
    }
    
    if (input.includes('letter') && (input.includes('id') || input.includes('format'))) {
      return "Letter ID format is: LTR-12345 (LTR- followed by exactly 5 digits). This is provided by the Pakistan Bar Council.";
    }
    
    if (input.includes('verify') || input.includes('verification')) {
      return "Verification ensures only qualified lawyers access our platform. The process involves checking your CNIC and Letter ID against our database of registered lawyers.";
    }
    
    if (input.includes('time') || input.includes('long')) {
      return "Automatic verification is instant if your credentials are in our database. Manual verification by admin takes 24-48 hours.";
    }
    
    if (input.includes('safe') || input.includes('secure') || input.includes('data')) {
      return "Your data is completely secure. We use advanced encryption and follow strict privacy protocols. No personal information is stored beyond what's necessary for verification.";
    }
    
    if (input.includes('scan') || input.includes('upload') || input.includes('camera')) {
      return "You can use the scan feature to upload an image of your CNIC. Our system will automatically extract the CNIC number from the image. Click the camera icon to get started.";
    }
    
    if (input.includes('failed') || input.includes('error') || input.includes('wrong')) {
      return "If verification fails, check your CNIC and Letter ID format. If one is correct but the other isn't, you'll get a specific error message. For persistent issues, your request will be sent for manual review.";
    }
    
    if (input.includes('admin') || input.includes('manual')) {
      return "Manual verification is handled by our admin team when automatic verification cannot confirm your credentials. You'll be notified once the review is complete.";
    }
    
    if (input.includes('help') || input.includes('support')) {
      return "I can help with CNIC/Letter ID formats, verification process, scan features, and general questions. What specific help do you need?";
    }
    
    if (input.includes('register') || input.includes('account')) {
      return "After successful verification, you'll see a 'Register as Lawyer' button to complete your profile setup and start offering legal services.";
    }
    
    return "I understand you're asking about lawyer verification. Could you be more specific? I can help with CNIC formats, Letter IDs, the verification process, scanning features, or any other questions you have.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    addUserMessage(inputMessage);
    const response = getResponse(inputMessage);
    
    setTimeout(() => {
      addBotMessage(response);
    }, 500);
    
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addUserMessage(`Uploaded image: ${file.name}`);
      
      // Simulate CNIC extraction (in real implementation, you'd use OCR)
      setTimeout(() => {
        addBotMessage("I can see your CNIC image. However, to extract text from images, I would need access to an OCR service. For now, please manually enter your CNIC in the format: 12345-1234567-1");
      }, 1000);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Hidden file input for CNIC scanning */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Chatbot Panel */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-96 shadow-2xl slide-up border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg relative">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">Legal Assistant</CardTitle>
                <p className="text-sm opacity-90">
                  {chatMode === 'faq' ? 'Quick answers & chat' : 'AI chat & CNIC scan'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {chatMode === 'faq' && (
                  <Button
                    onClick={switchToChatMode}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 h-8 text-xs"
                  >
                    Chat
                  </Button>
                )}
                {chatMode === 'chat' && (
                  <Button
                    onClick={() => setChatMode('faq')}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 h-8 text-xs"
                  >
                    FAQ
                  </Button>
                )}
                <Button
                  onClick={toggleChatbot}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-1 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 max-h-96 bg-gray-50">
            {chatMode === 'faq' ? (
              // FAQ Mode
              <div className="space-y-1 p-4 max-h-96 overflow-y-auto">
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
            ) : (
              // Chat Mode
              <div className="flex flex-col h-96">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-teal-600 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input Area */}
                <div className="border-t border-gray-200 p-3 bg-white">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={triggerFileUpload}
                      variant="outline"
                      size="sm"
                      className="border-teal-200 text-teal-600 hover:bg-teal-50"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about verification..."
                      className="flex-1 border-gray-200 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      disabled={!inputMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
