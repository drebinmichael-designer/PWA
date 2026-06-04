import { useState, useRef, useCallback } from "react";
import "./HomeScreen.css";
import type { ScreenProps } from "../../router/types";
import { ICONS } from "../../config/icons.registry";
import { AVATARS } from "../../config/assets.registry";

// ─── Hardcoded data ───────────────────────────────────────────────────────────

const STAR_ORANGE = `${import.meta.env.BASE_URL}assets/star-badge-orange.svg`;

const SPACES = [
  { id: "crm",      letter: "C",  color: "#2EAA6E", code: "CRMBTCPT", name: "CRM B2C: проблемы",              starred: true,  iconSrc: null },
  { id: "palitra",  letter: null, color: "#F5820D", code: "TEODNK",   name: "Горыныч",                         starred: false, iconSrc: ICONS.entertainmentPaletteFill },
  { id: "fsokr",    letter: "Ц",  color: "#FB923C", code: "FSOKR",    name: "Центр эксплуатации феде...",      starred: false, iconSrc: null },
  { id: "mis",      letter: "М",  color: "#F472B6", code: "MISSUP",   name: "МИС: централизованная...",        starred: false, iconSrc: null },
];

const FAVORITE_VIEWS = [
  { id: "1", icon: ICONS.actionKanbanBoardFill, name: "Лукоморье Моб. Все",  sub: "Активный спринт" },
  { id: "2", icon: ICONS.actionKanbanBoardFill, name: "Релиз в разработке",   sub: "Тестирование" },
  { id: "3", icon: ICONS.editorList,            name: "Корпоративный портал", sub: "Дефекты" },
];

const RECENT_TASKS = [
  {
    id: "LKMRMOB-720",
    name: "Проектирование отказоустойчивой event-driven архитектуры",
    status: "Беклог",
    statusColor: null,
    project: { letter: "L", color: "#2EAA6E" },
    priority: ICONS.priorityHighFill,
  },
  {
    id: "ARCH-1033",
    name: "Анализ и проектирование гибридной схемы хранения данных (Hot/Warm/Cold) для оптимизации затрат и ...",
    status: "В работе",
    statusColor: "rgba(47,154,255,1)",
    project: { letter: "A", color: "#5C8FF5" },
    priority: ICONS.priorityNormalFill,
  },
  {
    id: "ARCH-1033",
    name: "Service Mesh внедрение и миграция модуля отчетности для авторизация на ABAC",
    status: "В работе",
    statusColor: "rgba(47,154,255,1)",
    project: { letter: "A", color: "#5C8FF5" },
    priority: ICONS.priorityLowFill,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen({ dispatch }: ScreenProps) {
  const [favExpanded, setFavExpanded] = useState(true);
  const [recExpanded, setRecExpanded] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrolled((e.currentTarget.scrollTop ?? 0) > 0);
  }, []);

  return (
    <div className="hs">

      {/* ── Sticky top bar (аватар + поиск) ─────────────────────────────── */}
      <div className={`hs-top-row${scrolled ? " hs-top-row--scrolled" : ""}`}>
        <img className="hs-avatar" src={AVATARS.currentUser} alt="Аватар" />
        <button
          className="hs-search-btn"
          onClick={() => dispatch({ type: "push", to: "search" })}
          aria-label="Поиск"
        >
          <img className="hs-search-icon" src={ICONS.actionSearch} alt="" />
        </button>
      </div>

      {/* ── Скролл-контейнер (пространства + виджеты) ───────────────────── */}
      <div className="hs-content" onScroll={onScroll}>

        {/* Пространства — скроллятся вместе с контентом */}
        <div className="hs-header-scrollable">
          <h2 className="hs-spaces-title">Пространства</h2>
          <div className="hs-spaces-scroll">
            <button
              className="hs-all-spaces-btn"
              onClick={() => dispatch({ type: "tab_switch", to: "all-spaces" })}
              aria-label="Все пространства"
            >
              <img className="hs-all-spaces-icon" src={ICONS.actionCatalogFill} alt="" />
            </button>
            {SPACES.map((sp) => (
              <button
                key={sp.id}
                className="hs-space-card"
                onClick={() => dispatch({ type: "push", to: "project-view" })}
                aria-label={sp.name}
              >
                <div className="hs-space-avatar" style={{ background: sp.color }}>
                  {sp.iconSrc
                    ? <img src={sp.iconSrc} alt="" style={{ width: 28, height: 28, filter: "brightness(0) invert(1)" }} />
                    : sp.letter
                  }
                  {sp.starred && (
                    <img className="hs-space-star" src={STAR_ORANGE} alt="" />
                  )}
                </div>
                <div className="hs-space-info">
                  <span className="hs-space-code">{sp.code}</span>
                  <span className="hs-space-name">{sp.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Виджет: Избранные виды */}
        <div className="hs-widget">
          <div className="hs-widget-header">
            <div className="hs-widget-header-left">
              <img
                className="hs-widget-icon hs-widget-icon--warning"
                src={ICONS.ratingStarFill}
                alt=""
              />
              <span className="hs-widget-title">Избранные виды</span>
              <span className="hs-widget-badge">{FAVORITE_VIEWS.length}</span>
            </div>
            <button
              className="hs-widget-toggle"
              onClick={() => setFavExpanded((v) => !v)}
              aria-label={favExpanded ? "Свернуть" : "Развернуть"}
            >
              <img
                className={`hs-chevron-up${favExpanded ? "" : " hs-chevron-up--down"}`}
                src={favExpanded ? ICONS.navChevronUpMini : ICONS.navChevronDownMini}
                alt=""
              />
            </button>
          </div>

          {favExpanded && (
            <div className="hs-widget-body">
              {FAVORITE_VIEWS.map((v) => (
                <button
                  key={v.id}
                  className="hs-view-row"
                  onClick={() => dispatch({ type: "push", to: "project-view" })}
                >
                  <div className="hs-view-icon-wrap">
                    <img className="hs-view-icon" src={v.icon} alt="" />
                  </div>
                  <div className="hs-view-info">
                    <span className="hs-view-name">{v.name}</span>
                    <span className="hs-view-sub">{v.sub}</span>
                  </div>
                  <img
                    className="hs-chevron-right"
                    src={ICONS.navChevronRight}
                    alt=""
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Виджет: Недавние */}
        <div className="hs-widget">
          <div className="hs-widget-header">
            <div className="hs-widget-header-left">
              <img
                className="hs-widget-icon hs-widget-icon--muted"
                src={ICONS.organizeHistory}
                alt=""
              />
              <span className="hs-widget-title">Недавние</span>
              <span className="hs-widget-badge">{RECENT_TASKS.length}</span>
            </div>
            <button
              className="hs-widget-toggle"
              onClick={() => setRecExpanded((v) => !v)}
              aria-label={recExpanded ? "Свернуть" : "Развернуть"}
            >
              <img
                className={`hs-chevron-up${recExpanded ? "" : " hs-chevron-up--down"}`}
                src={recExpanded ? ICONS.navChevronUpMini : ICONS.navChevronDownMini}
                alt=""
              />
            </button>
          </div>

          {recExpanded && (
            <div>
              {RECENT_TASKS.map((task) => (
                <button
                  key={task.id}
                  className="hs-task-row"
                  onClick={() => dispatch({ type: "push", to: "task-card" })}
                >
                  <span className="hs-task-name">{task.name}</span>
                  <div className="hs-task-meta">
                    <img className="hs-task-priority-icon" src={task.priority} alt="" />
                    <span
                      className="hs-task-project-avatar"
                      style={{ background: task.project.color }}
                    >
                      {task.project.letter}
                    </span>
                    <span className="hs-task-id">{task.id}</span>
                    <span
                      className="hs-task-status"
                      style={task.statusColor ? { background: task.statusColor + "1a", color: task.statusColor } : undefined}
                    >
                      {task.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── TabBar ──────────────────────────────────────────────────────── */}
      <div className="hs-tabbar">
        <button
          className="hs-tab"
          onClick={() => dispatch({ type: "tab_switch", to: "home" })}
        >
          <img className="hs-tab-icon hs-tab-icon--active"   src={ICONS.actionHomeFill}        alt="" />
          <span className="hs-tab-label">Главная</span>
        </button>

        <button
          className="hs-tab"
          onClick={() => dispatch({ type: "tab_switch", to: "all-tasks" })}
        >
          <img className="hs-tab-icon hs-tab-icon--inactive" src={ICONS.documentFolderOpenFill} alt="" />
          <span className="hs-tab-label hs-tab-label--inactive">Задачи</span>
        </button>

        <button
          className="hs-tab"
          onClick={() => dispatch({ type: "tab_switch", to: "all-spaces" })}
        >
          <img className="hs-tab-icon hs-tab-icon--inactive" src={ICONS.actionCatalogFill}     alt="" />
          <span className="hs-tab-label hs-tab-label--inactive">Пространства</span>
        </button>
      </div>

    </div>
  );
}
