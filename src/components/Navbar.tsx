
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from "wagmi";
import { Badge } from "@/components/ui/badge";

export const Navbar = () => {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  
  // Placeholder for user's platform balance
  const platformBalance = "85.0";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-cyber-blue to-cyber-cyan bg-clip-text text-transparent">
              DECENTRABOT
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-cyber-blue/20 text-cyber-cyan">Moonbeam</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`transition-colors ${location.pathname === '/' 
                ? 'text-cyber-cyan font-semibold' 
                : 'text-foreground/80 hover:text-foreground'}`}
            >
              Home
            </Link>
            <Link 
              to="/app" 
              className={`transition-colors ${location.pathname === '/app' 
                ? 'text-cyber-cyan font-semibold' 
                : 'text-foreground/80 hover:text-foreground'}`}
            >
              App
            </Link>
            <a 
              href="#" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Docs
            </a>
            <a 
              href="https://github.com" 
              className="text-foreground/80 hover:text-foreground transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && (
            <Badge variant="outline" className="border-cyber-cyan bg-cyber-blue/10 text-cyber-cyan">
              Balance: {platformBalance} DOT
            </Badge>
          )}
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </nav>
  );
};
