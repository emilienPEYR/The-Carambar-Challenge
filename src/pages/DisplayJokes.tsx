import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Joke = {
  id: string;
  text: string;
  created_at: string;
};

const DisplayJokes = () => {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchJokes();

    const channel = supabase
      .channel("display-jokes")
      .on("postgres_changes", { event: "*", schema: "public", table: "jokes" }, () => {
        fetchJokes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (jokes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % jokes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [jokes.length]);

  const fetchJokes = async () => {
    const { data } = await supabase
      .from("jokes")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setJokes(data as Joke[]);
  };

  const currentJoke = jokes[currentIndex];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <img
        src="/carambar-foot.png"
        alt="Carambar football"
        className="pointer-events-none absolute right-0 top-1/2 w-[50vw] max-w-[420px] -translate-y-1/2 opacity-25 mix-blend-multiply"
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 py-16 text-center">
        <div className="mb-10 flex items-center justify-center gap-3 text-2xl font-semibold scale-[1.5]">
          <span>The</span>
          <img src="/carambar-logo.png" alt="Carambar" className="h-16 w-auto" />
          <span>challenge</span>
        </div>
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-semibold carambar-gradient-text">Live laughter</h1>

          {jokes.length === 0 ? (
            <div className="space-y-4">
              <div className="text-8xl">🦗</div>
              <p className="text-2xl text-muted-foreground">
                No jokes yet... Scan the QR code to send one!
              </p>
            </div>
          ) : currentJoke ? (
            <div
              key={currentJoke.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <div className="bg-white rounded-[2.5rem] px-10 py-12 md:px-16 md:py-14 carambar-shadow">
                <p className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  {currentJoke.text}
                </p>
              </div>
            </div>
          ) : null}

          {jokes.length > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {jokes.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayJokes;
