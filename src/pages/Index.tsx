
import { HeroSection } from "@/components/HeroSection";
import { StatusPanel } from "@/components/StatusPanel";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RobotFeedCard } from "@/components/RobotFeedCard";

const Index = () => {
  const robots = [
    { 
      id: "robot-1", 
      title: "Warehouse Bot Alpha", 
      isActive: true, 
      viewerCount: 42,
      thumbnailUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      batteryLevel: 85,
      uptime: "4h 12m",
      operatorCount: 5
    },
    { 
      id: "robot-2", 
      title: "Garden Maintenance Bot", 
      viewerCount: 0,
      batteryLevel: 65,
      uptime: "0h 0m",
      operatorCount: 0
    },
    { 
      id: "robot-3", 
      title: "Security Patrol Bot", 
      viewerCount: 0,
      batteryLevel: 92,
      uptime: "0h 0m",
      operatorCount: 0
    },
    { 
      id: "robot-4", 
      title: "Delivery Bot", 
      viewerCount: 0,
      batteryLevel: 78,
      uptime: "0h 0m",
      operatorCount: 0
    },
    { 
      id: "robot-5", 
      title: "Assembly Line Bot", 
      viewerCount: 0,
      batteryLevel: 45,
      uptime: "0h 0m",
      operatorCount: 0
    },
    { 
      id: "robot-6", 
      title: "Cleaning Bot", 
      viewerCount: 0,
      batteryLevel: 63,
      uptime: "0h 0m",
      operatorCount: 0
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatusPanel />
        <section className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Available Robots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {robots.map((robot) => (
              <RobotFeedCard key={robot.id} {...robot} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
