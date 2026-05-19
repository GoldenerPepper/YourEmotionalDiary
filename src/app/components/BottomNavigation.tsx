import { Home, BarChart3, User } from "lucide-react";
import { cn } from "./ui/utils";

interface BottomNavigationProps {
  currentPage: "dashboard" | "analytics" | "profile";
  onNavigate: (page: "dashboard" | "analytics" | "profile") => void;
}

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: "dashboard" as const, label: "Home", icon: Home },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-6 py-3 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                isActive
                  ? "text-primary bg-secondary/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("size-5", isActive && "stroke-[2.5px]")} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
