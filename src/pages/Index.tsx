import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Monitor, Send, Shield, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="relative z-10 container mx-auto px-6 py-16 md:py-20">
        <div className="mx-auto mb-8 flex justify-center">
          <img
            src="/carambar-logo.png"
            alt="Carambar"
            className="h-14 md:h-16 w-auto"
          />
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-medium text-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Live crowd participation
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                The <span className="carambar-gradient-text">Joke Wall</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Collect jokes in seconds, approve them in real time, and display the best
                punchlines on the big screen.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/submit">
                <Button className="rounded-full px-6 py-6 text-lg gap-2 carambar-gradient-bg text-primary-foreground border-0">
                  <Send className="h-5 w-5" /> Submit a joke
                </Button>
              </Link>
              <Link to="/display">
                <Button variant="outline" className="rounded-full px-6 py-6 text-lg gap-2 bg-white">
                  <Monitor className="h-5 w-5" /> Screen mode
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-[2.5rem] px-6 py-8 carambar-shadow space-y-4">
              <h2 className="text-2xl font-semibold">How it works</h2>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <p>Guests scan a QR code and send their jokes.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                  <p>You approve, reject, or archive in one tap.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                  <p>The screen rotates through the best punchlines.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-white px-5 py-5 space-y-3">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">Moderation</p>
                <p className="text-lg font-semibold">Stay in control</p>
                <Link to="/admin">
                  <Button variant="ghost" className="gap-2 rounded-full">
                    <Shield className="h-4 w-4" /> Admin space
                  </Button>
                </Link>
              </div>
              <div className="rounded-[2rem] bg-white px-5 py-5 space-y-3">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">Stage</p>
                <p className="text-lg font-semibold">One-click display</p>
                <Link to="/display">
                  <Button variant="ghost" className="gap-2 rounded-full">
                    <Monitor className="h-4 w-4" /> Open screen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
