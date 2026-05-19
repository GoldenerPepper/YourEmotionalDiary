import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Archive, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { cn } from "./ui/utils";
import { api } from "../../api";

type MoodColor = "red" | "orange" | "lightblue" | "green";

interface RowData {
  action: string;
  emotions: string;
  bodyReaction: string;
  result: string;
}

interface DailyEntry {
  date: string;
  mood: MoodColor | null;
  rows: RowData[];
}

const moodOptions = [
  { id: "red" as const, label: "Плохой день", color: "bg-red-500", border: "border-red-500" },
  { id: "orange" as const, label: "Напряженный день", color: "bg-orange-500", border: "border-orange-500" },
  { id: "lightblue" as const, label: "Нормальный день", color: "bg-blue-500", border: "border-blue-500" },
  { id: "green" as const, label: "Отличный день", color: "bg-green-500", border: "border-green-500" },
];

const pastelBackgroundStyles: Record<MoodColor, string> = {
  red: "rgba(239, 68, 68, 0.45)",
  orange: "rgba(249, 115, 22, 0.45)",
  lightblue: "rgba(59, 130, 246, 0.45)",
  green: "rgba(34, 197, 94, 0.45)",
};

const createEmptyRows = (): RowData[] => 
  Array(4).fill(null).map(() => ({ action: "", emotions: "", bodyReaction: "", result: "" }));

interface DiaryWorkspaceProps {
  onLogout?: () => void;
}

export function DiaryWorkspace({ onLogout }: DiaryWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"today" | "archive">("today");
  
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});

  const [currentMood, setCurrentMood] = useState<MoodColor | null>(null);
  const [tableRows, setTableRows] = useState<RowData[]>(createEmptyRows());

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const response = await api.get("/diary/all");
        const entriesMap: Record<string, DailyEntry> = {};
        response.data.forEach((entry: any) => {
          entriesMap[entry.date] = {
            date: entry.date,
            mood: entry.mood,
            rows: entry.rows,
          };
        });
        setEntries(entriesMap);
      } catch (error) {
        console.error("Ошибка при загрузке архива:", error);
      }
    };

    fetchArchive();
  }, []);

  useEffect(() => {
    const existingEntry = entries[currentDateStr];
    if (existingEntry) {
      setCurrentMood(existingEntry.mood);
      setTableRows(existingEntry.rows.length ? existingEntry.rows : createEmptyRows());
    } else {
      setCurrentMood(null);
      setTableRows(createEmptyRows());
    }
  }, [currentDateStr, entries]);

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).replace(/^\w/, (c) => c.toUpperCase());
  };

  const handlePageDate = (direction: "prev" | "next") => {
    const date = new Date(currentDateStr);
    date.setDate(date.getDate() + (direction === "prev" ? -1 : 1));
    setCurrentDateStr(date.toISOString().split("T")[0]);
  };

  const handleCellChange = (rowIndex: number, field: keyof RowData, value: string) => {
    const updatedRows = [...tableRows];
    updatedRows[rowIndex][field] = value;
    setTableRows(updatedRows);
  };

  const handleSave = async () => {
    try {
      const payload = {
        date: currentDateStr,
        mood: currentMood,
        rows: tableRows,
      };

      await api.post("/diary/save", payload);

      setEntries((prev) => ({
        ...prev,
        [currentDateStr]: payload,
      }));

      alert("Запись успешно сохранена в базу данных!");
    } catch (error) {
      console.error("Ошибка сохранения записи:", error);
      alert("Не удалось сохранить запись на сервере.");
    }
  };

  const handleSelectArchiveDate = (dateStr: string) => {
    setCurrentDateStr(dateStr);
    setActiveTab("today");
  };

  const savedDates = Object.keys(entries).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="text-xl font-bold px-2 tracking-tight text-gray-900">
            Your Emotional Diary
          </div>
          
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("today")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === "today" 
                  ? "bg-[#0b0c24] text-white" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <BookOpen className="w-4 h-4" />
              Запись на сегодня
            </button>
            
            <button
              onClick={() => setActiveTab("archive")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === "archive" 
                  ? "bg-[#0b0c24] text-white" 
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Archive className="w-4 h-4" />
              Архив
            </button>
          </nav>

          {activeTab === "archive" && (
            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-400 block px-3 mb-2 uppercase tracking-wider">
                Прошлые записи
              </span>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {savedDates.length === 0 ? (
                  <span className="text-xs text-gray-400 px-3 block italic">Нет записей</span>
                ) : (
                  savedDates.map((dateStr) => {
                    const entry = entries[dateStr];
                    const moodOpt = moodOptions.find((m) => m.id === entry.mood);
                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleSelectArchiveDate(dateStr)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded-md text-left"
                      >
                        <span className={cn("w-2 h-2 rounded-full", moodOpt ? moodOpt.color : "bg-gray-300")} />
                        {new Date(dateStr).toLocaleDateString("ru-RU")}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {onLogout && (
          <Button variant="ghost" className="justify-start gap-2 text-gray-500 hover:text-red-600" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            Выйти
          </Button>
        )}
      </aside>

      <main 
        className="flex-1 flex flex-col overflow-y-auto p-8 transition-all duration-500 ease-in-out"
        style={{
          backgroundColor: currentMood ? pastelBackgroundStyles[currentMood] : "#f8f9fa"
        }}
      >
        <div className="flex items-center justify-center gap-8 mb-6">
          <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm" onClick={() => handlePageDate("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-800 min-w-[250px] text-center">
            {formatDisplayDate(currentDateStr)}
          </h2>
          <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm" onClick={() => handlePageDate("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Card className="p-6 mb-6 bg-white border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Настроение дня</h3>
          <div className="flex flex-wrap gap-4">
            {moodOptions.map((opt) => {
              const isSelected = currentMood === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setCurrentMood(opt.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all shadow-sm bg-white",
                    isSelected 
                      ? `${opt.border} ring-2 ring-offset-1 ring-gray-900 text-gray-900 font-semibold` 
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <span className={cn("w-2.5 h-2.5 rounded-full", opt.color)} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-sm font-semibold text-gray-900 border-b border-gray-100">
                  <th className="pb-4 pr-4 w-1/4">Моё действие</th>
                  <th className="pb-4 px-4 w-1/4">Мои эмоции по поводу этого действия</th>
                  <th className="pb-4 px-4 w-1/4">Реакция моего тела</th>
                  <th className="pb-4 pl-4 w-1/4">Результат</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tableRows.map((row, index) => (
                  <tr key={index} className="group">
                    <td className="py-4 pr-4 align-top">
                      <Textarea
                        placeholder="Опишите ваше действие..."
                        value={row.action}
                        onChange={(e) => handleCellChange(index, "action", e.target.value)}
                        className="resize-none min-h-[80px] bg-gray-50/50 focus:bg-white border-0 focus:ring-1 focus:ring-gray-300 rounded-xl text-sm"
                      />
                    </td>
                    <td className="py-4 px-4 align-top">
                      <Textarea
                        placeholder="Какие эмоции вы испытали?"
                        value={row.emotions}
                        onChange={(e) => handleCellChange(index, "emotions", e.target.value)}
                        className="resize-none min-h-[80px] bg-gray-50/50 focus:bg-white border-0 focus:ring-1 focus:ring-gray-300 rounded-xl text-sm"
                      />
                    </td>
                    <td className="py-4 px-4 align-top">
                      <Textarea
                        placeholder="Как отреагировало тело?"
                        value={row.bodyReaction}
                        onChange={(e) => handleCellChange(index, "bodyReaction", e.target.value)}
                        className="resize-none min-h-[80px] bg-gray-50/50 focus:bg-white border-0 focus:ring-1 focus:ring-gray-300 rounded-xl text-sm"
                      />
                    </td>
                    <td className="py-4 pl-4 align-top">
                      <Textarea
                        placeholder="Какой результат?"
                        value={row.result}
                        onChange={(e) => handleCellChange(index, "result", e.target.value)}
                        className="resize-none min-h-[80px] bg-gray-50/50 focus:bg-white border-0 focus:ring-1 focus:ring-gray-300 rounded-xl text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-50">
            <Button 
              onClick={handleSave} 
              className="bg-[#0b0c24] hover:bg-[#151744] text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all"
            >
              Сохранить запись
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}