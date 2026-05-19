import { useState } from "react";
import { Plus, Smile, Frown, Angry, Heart, Wind, AlertCircle, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "./ui/utils";

interface Emotion {
  id: string;
  name: string;
  color: string;
  icon: typeof Smile;
}

const emotions: Emotion[] = [
  { id: "joy", name: "Joy", color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: Smile },
  { id: "anxiety", name: "Anxiety", color: "bg-purple-100 text-purple-800 border-purple-300", icon: AlertCircle },
  { id: "sadness", name: "Sadness", color: "bg-slate-200 text-slate-700 border-slate-300", icon: Frown },
  { id: "anger", name: "Anger", color: "bg-orange-200 text-orange-900 border-orange-300", icon: Angry },
  { id: "calm", name: "Calm", color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: Wind },
  { id: "guilt", name: "Guilt", color: "bg-stone-200 text-stone-700 border-stone-300", icon: Heart },
];

interface DiaryEntry {
  id: string;
  date: Date;
  emotion: string;
  intensity: number;
  notes: string;
  trigger: string;
  color: string;
}

export function DashboardScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState("");
  const [trigger, setTrigger] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: "1",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      emotion: "Calm",
      intensity: 7,
      notes: "Had a peaceful morning walk in the park",
      trigger: "Nature, Exercise",
      color: "bg-emerald-600",
    },
    {
      id: "2",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      emotion: "Anxiety",
      intensity: 6,
      notes: "Presentation at work made me nervous",
      trigger: "Work, Public Speaking",
      color: "bg-purple-600",
    },
  ]);

  const handleSave = () => {
    if (!selectedEmotion) return;

    const emotion = emotions.find((e) => e.id === selectedEmotion);
    if (!emotion) return;

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date(),
      emotion: emotion.name,
      intensity: intensity[0],
      notes,
      trigger,
      color: emotion.color.split(" ")[0].replace("bg-", "bg-").replace("100", "600").replace("200", "600"),
    };

    setEntries([newEntry, ...entries]);
    setSelectedEmotion("");
    setIntensity([5]);
    setNotes("");
    setTrigger("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 to-yellow-50/40 pb-24">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-border shadow-sm px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl">Hello!</h1>
            <p className="text-sm text-muted-foreground">How are you feeling today?</p>
          </div>
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* New Entry Button */}
        {!showForm && (
          <Card
            className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-amber-50/80 to-yellow-50/60 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all shadow-sm"
            onClick={() => setShowForm(true)}
          >
            <CardContent className="flex items-center justify-center gap-3 py-8">
              <div className="size-12 rounded-full bg-primary/15 flex items-center justify-center border border-primary/20">
                <Plus className="size-6 text-primary" />
              </div>
              <div>
                <h3>New Diary Entry</h3>
                <p className="text-sm text-muted-foreground">Capture your emotions</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entry Form */}
        {showForm && (
          <Card className="border-primary/30 shadow-lg bg-card/95">
            <CardHeader>
              <h3>How are you feeling?</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Emotion Tags */}
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">Select emotion</label>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                  {emotions.map((emotion) => {
                    const Icon = emotion.icon;
                    return (
                      <button
                        key={emotion.id}
                        onClick={() => setSelectedEmotion(emotion.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all whitespace-nowrap",
                          selectedEmotion === emotion.id
                            ? emotion.color + " shadow-md"
                            : "bg-card text-muted-foreground border-border hover:border-primary/40"
                        )}
                      >
                        <Icon className="size-5" />
                        <span className="text-xs">{emotion.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Intensity Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Intensity</label>
                  <span className="text-lg font-medium text-primary">{intensity[0]}/10</span>
                </div>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  min={1}
                  max={10}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Thoughts & Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What happened? How do you feel?"
                  className="min-h-24 resize-none rounded-xl bg-input-background"
                />
              </div>

              {/* Triggers */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Tag className="size-4" />
                  Triggers / Context
                </label>
                <Input
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="Work, Relationships, Health..."
                  className="rounded-xl bg-input-background"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!selectedEmotion}
                  className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                >
                  Save Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Entries */}
        <div className="space-y-4">
          <h3 className="text-muted-foreground">Your Recent Notes</h3>
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-border bg-card/80 shadow-sm"
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className={cn("size-3 rounded-full mt-1.5", entry.color)} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1">{entry.emotion}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {entry.notes}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">
                        Intensity: {entry.intensity}/10
                      </span>
                      {entry.trigger && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Tag className="size-3" />
                          {entry.trigger}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
