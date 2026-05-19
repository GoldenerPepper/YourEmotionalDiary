import { ChevronRight, Lock, Shield, Bell, User2, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";

interface SettingsItemProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  danger?: boolean;
  rightElement?: React.ReactNode;
}

function SettingsItem({ icon: Icon, title, subtitle, onClick, danger, rightElement }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-muted/50 transition-colors text-left",
        danger && "hover:bg-destructive/5"
      )}
    >
      <div
        className={cn(
          "size-10 rounded-full flex items-center justify-center",
          danger ? "bg-destructive/10" : "bg-primary/10"
        )}
      >
        <Icon className={cn("size-5", danger ? "text-destructive" : "text-primary")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium", danger && "text-destructive")}>{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {rightElement || <ChevronRight className="size-5 text-muted-foreground flex-shrink-0" />}
    </button>
  );
}

export function ProfileScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50/40 to-amber-50/40 pb-24">
      {/* Header with User Info */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-border shadow-sm px-6 py-8">
        <div className="max-w-md mx-auto flex flex-col items-center text-center space-y-3">
          <Avatar className="size-20 ring-4 ring-primary/10">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl">
              AS
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl">Alex Smith</h2>
            <p className="text-sm text-muted-foreground">alex.smith@email.com</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Account Settings */}
        <Card className="border-border shadow-md bg-card/90">
          <CardHeader>
            <h3>Account Settings</h3>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingsItem
              icon={User2}
              title="Edit Personal Info"
              subtitle="Update your profile details"
            />
            <SettingsItem
              icon={Bell}
              title="Notification Settings"
              subtitle="Manage your alerts and reminders"
            />
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="border-border shadow-md bg-card/90">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <h3>Security & Privacy</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingsItem
              icon={Lock}
              title="Change Password"
              subtitle="Update your account password"
            />
          </CardContent>
        </Card>

        {/* Data Control */}
        <Card className="border-border shadow-md bg-card/90">
          <CardHeader>
            <h3>Data Control</h3>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingsItem
              icon={AlertTriangle}
              title="Clear All Records"
              subtitle="Permanently delete all diary entries"
              danger
              rightElement={
                <div className="flex-shrink-0">
                  <ChevronRight className="size-5 text-destructive" />
                </div>
              }
            />

            <Separator className="my-2" />

            <SettingsItem
              icon={Trash2}
              title="Delete Account"
              subtitle="Permanently remove your account and data"
              danger
              rightElement={
                <div className="flex-shrink-0">
                  <ChevronRight className="size-5 text-destructive" />
                </div>
              }
            />
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center space-y-1 pt-4">
          <p className="text-sm text-muted-foreground">Emotion Diary</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
