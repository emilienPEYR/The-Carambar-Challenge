import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Archive, Check, LogIn, LogOut, Shield, X } from "lucide-react";

const ADMIN_CODE = "251163";

type Joke = {
  id: string;
  text: string;
  status: string;
  created_at: string;
};

const AdminJokes = () => {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "archived">("pending");

  useEffect(() => {
    if (!authenticated) return;
    fetchJokes();

    const channel = supabase
      .channel("admin-jokes")
      .on("postgres_changes", { event: "*", schema: "public", table: "jokes" }, () => {
        fetchJokes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authenticated, filter]);

  const fetchJokes = async () => {
    const { data } = await supabase
      .from("jokes")
      .select("*")
      .eq("status", filter)
      .order("created_at", { ascending: false });
    if (data) setJokes(data as Joke[]);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected" | "archived") => {
    const { error } = await supabase.from("jokes").update({ status }).eq("id", id);
    if (error) {
      toast.error("Update failed");
      return;
    }

    if (status === "approved") {
      const { data: approved } = await supabase
        .from("jokes")
        .select("id, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      if (approved && approved.length > 5) {
        const toArchive = approved.slice(0, approved.length - 5);
        for (const joke of toArchive) {
          await supabase.from("jokes").update({ status: "archived" }).eq("id", joke.id);
        }
        if (toArchive.length > 0) {
          toast.info(`${toArchive.length} joke(s) archived`);
        }
      }
    }

    const labels: Record<string, string> = {
      approved: "Joke approved ✅",
      rejected: "Joke rejected ❌",
      archived: "Joke archived 📦",
    };
    toast.success(labels[status]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setAuthenticated(true);
    } else {
      toast.error("Wrong code");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCode("");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-transparent relative overflow-hidden">
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
          <form
            onSubmit={handleLogin}
            className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-5 carambar-shadow"
          >
            <div className="text-center space-y-2">
              <img src="/carambar-logo.png" alt="Carambar" className="mx-auto h-10 w-auto" />
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h1 className="text-2xl font-bold">Admin</h1>
              </div>
              <p className="text-sm text-muted-foreground">Enter the access code</p>
            </div>
            <Input
              type="password"
              placeholder="Access code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-full text-center text-lg tracking-widest"
              required
            />
            <Button type="submit" className="w-full rounded-full carambar-gradient-bg border-0 text-primary-foreground gap-2">
              <LogIn className="w-4 h-4" /> Sign in
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const actionButtons = (joke: Joke) => {
    const buttons: JSX.Element[] = [];

    if (filter !== "approved") {
      buttons.push(
        <Button
          key="approve"
          size="icon"
          onClick={() => updateStatus(joke.id, "approved")}
          className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/80"
          title="Approve"
        >
          <Check className="w-5 h-5" />
        </Button>
      );
    }
    if (filter !== "rejected") {
      buttons.push(
        <Button
          key="reject"
          size="icon"
          variant="destructive"
          onClick={() => updateStatus(joke.id, "rejected")}
          className="rounded-xl"
          title="Reject"
        >
          <X className="w-5 h-5" />
        </Button>
      );
    }
    if (filter !== "archived") {
      buttons.push(
        <Button
          key="archive"
          size="icon"
          variant="outline"
          onClick={() => updateStatus(joke.id, "archived")}
          className="rounded-xl"
          title="Archive"
        >
          <Archive className="w-5 h-5" />
        </Button>
      );
    }

    return <div className="flex gap-2 shrink-0">{buttons}</div>;
  };

  return (
    <div className="min-h-screen bg-transparent px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <img src="/carambar-logo.png" alt="Carambar" className="h-10 w-auto mb-3" />
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Moderation</p>
            <h1 className="text-3xl font-bold carambar-gradient-text">Control the flow</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="rounded-full gap-2 bg-white">
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["pending", "approved", "rejected", "archived"] as const).map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              onClick={() => setFilter(s)}
              className={`rounded-full px-5 ${
                filter === s ? "carambar-gradient-bg border-0 text-primary-foreground" : "bg-white"
              }`}
            >
              {s === "pending"
                ? "⏳ Pending"
                : s === "approved"
                ? "✅ Approved"
                : s === "rejected"
                ? "❌ Rejected"
                : "📦 Archived"}
            </Button>
          ))}
        </div>

        {jokes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground rounded-[2.5rem] bg-white">
            No jokes in {filter}.
          </div>
        ) : (
          <div className="space-y-4">
            {jokes.map((joke) => (
              <div key={joke.id} className="bg-white rounded-[2.5rem] p-5 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <p className="text-foreground text-lg font-medium">{joke.text}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(joke.created_at).toLocaleString("en-US")}
                  </p>
                </div>
                {actionButtons(joke)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJokes;
