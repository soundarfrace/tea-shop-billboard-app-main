import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Info, Palette, LogOut } from "lucide-react";
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
    <div className="p-6 space-y-6 bg-background dark:bg-background">
      <div className="space-y-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400"
        >
          <LogOut className="w-6 h-6" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Theme Settings */}
        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription className="dark:text-zinc-300">
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium dark:text-white">Theme</p>
                <p className="text-sm text-muted-foreground dark:text-zinc-400">
                  Switch between light and dark modes
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Help & Tutorial Section */}
        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <HelpCircle className="w-5 h-5" />
              Help & Tutorial
            </CardTitle>
            <CardDescription className="dark:text-zinc-300">
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
        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Info className="w-5 h-5" />
              About
            </CardTitle>
            <CardDescription className="dark:text-zinc-300">
            Powered By Techies Magnifier Technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground dark:text-zinc-400">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>App:</strong> CalBus (Calculate your business)</p>
              <p><strong>Description:</strong> A simple billing and sales tracking application</p>
              <p><strong>Contact:</strong> +91 7397 288 500</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
