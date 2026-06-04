import { useState } from "react";
import "./AllTasks.css";
import type { ScreenProps } from "../../router/types";
import { ICONS } from "../../config/icons.registry";

// ─── Status colors ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  "В работе":           { bg: "rgba(47,154,255,0.12)",  color: "rgba(47,154,255,1)" },
  "Готово":             { bg: "rgba(13,190,105,0.12)",   color: "rgba(13,190,105,1)" },
  "Ожидание анализа":  { bg: "rgba(105,82,245,0.12)",   color: "rgba(105,82,245,1)" },
  "Приостановлено":    { bg: "rgba(232,235,244,1)",      color: "rgba(68,83,113,1)"  },
  "Беклог":            { bg: "rgba(232,235,244,1)",      color: "rgba(68,83,113,1)"  },
};

// ─── Priority icons ───────────────────────────────────────────────────────────

const PRIORITY_ICON: Record<string, string> = {
  high:   ICONS.priorityHighFill,
  normal: ICONS.priorityNormalFill,
  low:    ICONS.priorityLowFill,
};

// ─── Hardcoded tasks ──────────────────────────────────────────────────────────

const ALL_TASKS = [
  {
    id: "STP-105",
    name: "Стратегия мультитенантности",
    status: "Приостановлено",
    priority: "high",
    project: { letter: "S", color: "#F5820D" },
    mine: false,
  },
  {
    id: "ARCH-1033",
    name: "Анализ и проектирование гибридной схемы хранения данных (Hot/Warm/Cold) для оптимизации затрат и производительност...",
    status: "В работе",
    priority: "normal",
    project: { letter: "A", color: "#2EAA6E" },
    mine: true,
  },
  {
    id: "TEO-1470",
    name: "Service Mesh внедрение и миграция модуля отчетности для авторизация на ABAC",
    status: "Ожидание анализа",
    priority: "low",
    project: { letter: "T", color: "#5C8FF5" },
    mine: false,
  },
  {
    id: "STP-169",
    name: "Оптимизация стратегии кеширования многоуровневой архитектуры (L1/L2/L3) для снижения p95-латентности ключевых API-...",
    status: "Готово",
    priority: "high",
    project: { letter: "S", color: "#F5820D" },
    mine: false,
  },
  {
    id: "ARCH-1042",
    name: "Проектирование отказоустойчивой event-driven архитектуры",
    status: "Беклог",
    priority: "normal",
    project: { letter: "A", color: "#2EAA6E" },
    mine: true,
  },
  {
    id: "ARCH-1020",
    name: "Рефакторинг модуля авторизации на основе ABAC для поддержки динамически изменяемых бизнес-правил",
    status: "Готово",
    priority: "low",
    project: { letter: "A", color: "#2EAA6E" },
    mine: false,
  },
];

// ─── Quick filter chips ───────────────────────────────────────────────────────

const QUICK_FILTERS = ["Мои", "Созданные мной", "Просроченные", "Активные"];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AllTasksScreen({ dispatch }: ScreenProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const tasks = filtersApplied
    ? ALL_TASKS.filter((t) => t.mine)
    : ALL_TASKS;

  return (
    <div className="at">

      {/* ── Header ── */}
      <div className="at-header">
        <h2 className="at-title">Задачи</h2>
        <button
          className="at-search-btn"
          onClick={() => dispatch({ type: "push", to: "search" })}
          aria-label="Поиск"
        >
          <img className="at-search-icon" src={ICONS.actionSearch} alt="" />
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="at-filter-bar">
        <button
          className={`at-icon-btn${filtersApplied ? " at-icon-btn--active" : ""}`}
          onClick={() => dispatch({ type: "push", to: "tasks-filters" })}
          aria-label="Фильтры"
        >
          <img className="at-icon-btn-img" src={ICONS.actionFilterFill} alt="" />
        </button>

        <button
          className="at-icon-btn"
          onClick={() => dispatch({ type: "push", to: "tasks-sort" })}
          aria-label="Сортировка"
        >
          <img className="at-icon-btn-img" src={ICONS.navCaretSort} alt="" />
        </button>

        {QUICK_FILTERS.map((f) => (
          <button
            key={f}
            className={`at-chip${activeFilter === f ? " at-chip--active" : ""}`}
            onClick={() => setActiveFilter(activeFilter === f ? null : f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Task list ── */}
      <div className="at-list">
        {tasks.map((task) => {
          const st = STATUS_STYLE[task.status] ?? STATUS_STYLE["Беклог"];
          return (
            <button
              key={task.id}
              className="at-task-row"
              onClick={() => dispatch({ type: "push", to: "task-card" })}
            >
              <span className="at-task-name">{task.name}</span>
              <div className="at-task-meta">
                <img
                  className="at-priority-icon"
                  src={PRIORITY_ICON[task.priority]}
                  alt=""
                />
                <span
                  className="at-project-avatar"
                  style={{ background: task.project.color }}
                >
                  {task.project.letter}
                </span>
                <span className="at-task-id">{task.id}</span>
                <span
                  className="at-status-chip"
                  style={{ background: st.bg, color: st.color }}
                >
                  {task.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── TabBar ── */}
      <div className="at-tabbar">
        <button className="at-tab" onClick={() => dispatch({ type: "tab_switch", to: "home" })}>
          <img className="at-tab-icon at-tab-icon--inactive" src={ICONS.actionHomeFill} alt="" />
          <span className="at-tab-label at-tab-label--inactive">Главная</span>
        </button>
        <button className="at-tab" onClick={() => dispatch({ type: "tab_switch", to: "all-tasks" })}>
          <img className="at-tab-icon at-tab-icon--active" src={ICONS.documentFolderOpenFill} alt="" />
          <span className="at-tab-label">Задачи</span>
        </button>
        <button className="at-tab" onClick={() => dispatch({ type: "tab_switch", to: "all-spaces" })}>
          <img className="at-tab-icon at-tab-icon--inactive" src={ICONS.actionCatalogFill} alt="" />
          <span className="at-tab-label at-tab-label--inactive">Пространства</span>
        </button>
      </div>

    </div>
  );
}
