
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-cyber-blue to-cyber-cyan bg-clip-text text-transparent">
              DECENTRABOT
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/bot" className="text-foreground/80 hover:text-foreground transition-colors">
              Bot
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
          <Button className="neo-button">
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
};
