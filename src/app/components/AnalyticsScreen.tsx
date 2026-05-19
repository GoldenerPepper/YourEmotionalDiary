import { useState } from "react";
import { Calendar, Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "./ui/utils";

const weeklyData = [
  { day: "Mon", intensity: 6 },
  { day: "Tue", intensity: 4 },
  { day: "Wed", intensity: 7 },
  { day: "Thu", intensity: 5 },
  { day: "Fri", intensity: 8 },
  { day: "Sat", intensity: 3 },
  { day: "Sun", intensity: 5 },
];

const emotionDistribution = [
  { name: "Calm", value: 45, color: "#8fbc8f" },
  { name: "Anxiety", value: 30, color: "#9370db" },
  { name: "Joy", value: 25, color: "#daa520" },
];

const moodCalendar = [
  { date: 1, mood: "calm" },
  { date: 2, mood: "joy" },
  { date: 3, mood: "anxiety" },
  { date: 4, mood: "calm" },
  { date: 5, mood: null },
  { date: 6, mood: "sadness" },
  { date: 7, mood: "calm" },
  { date: 8, mood: "joy" },
  { date: 9, mood: "calm" },
  { date: 10, mood: "anxiety" },
  { date: 11, mood: "calm" },
  { date: 12, mood: "joy" },
  { date: 13, mood: "calm" },
  { date: 14, mood: null },
  { date: 15, mood: "anxiety" },
  { date: 16, mood: "calm" },
  { date: 17, mood: "joy" },
];

const moodColors: Record<string, string> = {
  joy: "bg-yellow-500",
  anxiety: "bg-purple-500",
  sadness: "bg-slate-500",
  anger: "bg-orange-600",
  calm: "bg-emerald-500",
  guilt: "bg-stone-500",
};

export function AnalyticsScreen() {
  const [period, setPeriod] = useState<"week" | "month">("week");

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 to-amber-50/50 pb-24">
      {/* Header */}
      <div className="bg-card/90 backdrop-blur-sm border-b border-border shadow-sm px-6 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="size-5 text-primary" />
            <h1 className="text-xl">Your Emotional Insights</h1>
          </div>

          {/* Period Selector */}
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "week" | "month")}>
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="week" className="rounded-lg">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="rounded-lg">
                Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Mood Calendar */}
        <Card className="border-border shadow-md bg-card/90">
          <CardHeader>
            <h3>Mood Calendar</h3>
            <p className="text-sm text-muted-foreground">May 2026</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {moodCalendar.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all",
                    day.mood
                      ? cn(moodColors[day.mood], "text-white shadow-sm hover:scale-105")
                      : "bg-muted/30 text-muted-foreground"
                  )}
                >
                  {day.date}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border/50">
              {Object.entries(moodColors).map(([mood, color]) => (
                <div key={mood} className="flex items-center gap-1.5">
                  <div className={cn("size-3 rounded-full", color)} />
                  <span className="text-xs text-muted-foreground capitalize">{mood}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mood Dynamics Chart */}
        <Card className="border-border shadow-md bg-card/90">
          <CardHeader>
            <h3>Mood Dynamics</h3>
            <p className="text-sm text-muted-foreground">
              Track your emotional intensity over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="intensity"
                    stroke="#8b7355"
                    strokeWidth={3}
                    dot={{ fill: "#8b7355", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emotion Distribution */}
        <Card className="border-border shadow-md bg-card/90">
          <CardHeader>
            <h3>Emotion Distribution</h3>
            <p className="text-sm text-muted-foreground">
              Breakdown of your logged emotions
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-48 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {emotionDistribution.map((emotion) => (
                  <div key={emotion.name} className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: emotion.color }}
                    />
                    <div>
                      <p className="text-sm font-medium">{emotion.name}</p>
                      <p className="text-xs text-muted-foreground">{emotion.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button
          variant="outline"
          className="w-full rounded-xl border-dashed border-2 h-12 hover:bg-muted/60 bg-card/60 border-primary/30"
        >
          <Download className="size-4 mr-2" />
          Export Data to Text/PDF
        </Button>
      </div>
    </div>
  );
}
