import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calculator, TrendingUp, X, ArrowRight, ArrowLeft } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Your Business App!",
    description: "Let's take a quick tour of the features",
    icon: <Calculator className="w-8 h-8 text-blue-600" />,
    content: "This app helps you manage billing and track sales efficiently. Let's explore the main features together."
  },
  {
    title: "Billing Calculator",
    description: "Create and manage your bills",
    icon: <Calculator className="w-8 h-8 text-green-600" />,
    content: "Use the calculator to create bills, add items, apply discounts, and manage different payment modes. You can save bills and generate receipts."
  },
  {
    title: "Sales Analytics",
    description: "Track your business performance",
    icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
    content: "View detailed sales reports, analyze payment modes, and track your business growth over time with interactive charts."
  }
];

export const AppTutorial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('calbus-hasSeenTutorial');
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('calbus-hasSeenTutorial', 'true');
    setIsOpen(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    localStorage.setItem('calbus-hasSeenTutorial', 'true');
    setIsOpen(false);
    setCurrentStep(0);
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {currentTutorialStep.icon}
              {currentTutorialStep.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {currentTutorialStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                {currentTutorialStep.content}
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {tutorialSteps.length}
            </span>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < tutorialSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>

          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip Tutorial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
