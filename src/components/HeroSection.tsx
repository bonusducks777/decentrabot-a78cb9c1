
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden py-24 grid-pattern animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl glow animate-pulse">
              Power the Future. Control the Bot.
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
              Stake DOT. Outbid. Take command of real-world robotics.
            </p>
          </div>
          <div className="w-full max-w-sm hover-scale">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button 
                  onClick={openConnectModal} 
                  className="w-full neo-button transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  Connect Wallet
                </Button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-2/3 h-96 bg-orange-500/20 blur-[100px] rounded-full opacity-60 animate-pulse"></div>
    </div>
  );
};
