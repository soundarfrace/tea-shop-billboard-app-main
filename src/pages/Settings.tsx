import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Info, Palette } from "lucide-react";
import { useTutorial } from "@/hooks/useTutorial";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { resetTutorial } = useTutorial();
  const navigate = useNavigate();

  const handleShowTutorial = () => {
    resetTutorial();
    window.location.reload(); // Reload to trigger tutorial
  };

  const handleLogout = () => {
    sessionStorage.removeItem('logged-in');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground dark:text-black">Settings</h1>
      </div>

      <div className="space-y-4">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark modes
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Help & Tutorial Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Help & Tutorial
            </CardTitle>
            <CardDescription>
              Get help with using the app and view the tutorial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleShowTutorial}
              className="flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Show Tutorial
            </Button>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              About
            </CardTitle>
            <CardDescription>
            Powered By Techies Magnifier Technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>App:</strong> CalBus (Calculate your business)</p>
              <p><strong>Description:</strong> A simple billing and sales tracking application</p>
              <p><strong>Contact:</strong> +91 7397 288 500</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center pt-8">
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
