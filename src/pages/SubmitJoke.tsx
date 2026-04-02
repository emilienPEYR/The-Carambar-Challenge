import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SubmitJoke = () => {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Write your joke first! 😄");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("jokes").insert({ text: text.trim() });
    setSubmitting(false);
    if (error) {
      toast.error("Oops, something went wrong!");
    } else {
      setSubmitted(true);
      setText("");
      setTimeout(() => setSubmitted(false), 3000);
      toast.success("Joke sent! 🎉");
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <div className="relative z-10 px-5 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold scale-[1.15]">
              <span>The</span>
              <img
                src="/carambar-logo.png"
                alt="Carambar"
                className="h-10 w-auto"
              />
              <span>challenge</span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] px-6 py-8 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.45)]">
            <h1 className="text-3xl font-extrabold leading-tight text-center">
              Roast your opponent with your best joke.
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              France vs Senegal
            </p>

            {submitted ? (
              <div className="mt-6 rounded-[2rem] bg-[#ffe600] px-5 py-6 text-center">
                <p className="text-lg font-semibold">Thanks!</p>
                <p className="text-sm mt-2">Your joke is waiting for approval.</p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 w-full rounded-full bg-white text-foreground hover:bg-white/90"
                >
                  Send another joke
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-[2rem] bg-[#f9f9f2] p-4 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.05)]">
                  <Textarea
                    placeholder="Write your joke here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[180px] text-base rounded-[1.75rem] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    maxLength={500}
                  />
                  <div className="mt-2 text-right text-xs text-muted-foreground">{text.length}/500</div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !text.trim()}
                  className="w-full rounded-full py-6 text-lg font-semibold carambar-gradient-bg text-primary-foreground shadow-[0_16px_32px_-20px_rgba(181,0,96,0.7)] transition-transform hover:scale-[0.98]"
                >
                  {submitting ? "Sending..." : "Send"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitJoke;
