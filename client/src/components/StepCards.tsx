interface StepCardsProps {
  currentStep: number;
}

export function StepCards({ currentStep }: StepCardsProps) {
  const steps = [
    {
      number: 1,
      title: "Enter Details",
      description: "Provide CNIC & Letter ID"
    },
    {
      number: 2,
      title: "Validate",
      description: "Format validation"
    },
    {
      number: 3,
      title: "Verify",
      description: "Database check"
    },
    {
      number: 4,
      title: "Review",
      description: "Manual verification"
    },
    {
      number: 5,
      title: "Complete",
      description: "Registration unlock"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {steps.map((step) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        const isUpcoming = step.number > currentStep;

        return (
          <div
            key={step.number}
            className={`
              bg-white p-4 rounded-lg border-2 shadow-md transition-all duration-300
              ${isActive ? 'step-card-active border-[#2D4A52]' : 'border-gray-200'}
              ${isActive ? 'shadow-lg' : 'shadow-sm'}
            `}
          >
            <div className="flex items-center mb-2">
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2
                  ${isCompleted || isActive ? 'bg-[#2D4A52] text-white' : 'bg-gray-300 text-gray-600'}
                `}
              >
                {step.number}
              </div>
              <span
                className={`
                  text-sm font-medium
                  ${isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'}
                `}
              >
                {step.title}
              </span>
            </div>
            <p
              className={`
                text-xs
                ${isCompleted || isActive ? 'text-gray-600' : 'text-gray-500'}
              `}
            >
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
