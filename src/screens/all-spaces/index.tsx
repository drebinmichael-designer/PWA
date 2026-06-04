import { useState } from "react";
import "./AllSpaces.css";
import type { ScreenProps } from "../../router/types";
import { ICONS } from "../../config/icons.registry";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Space {
  id: string;
  code: string;
  name: string;
  color: string;
  letter: string | null;
  iconSrc?: string;
  starred: boolean;
  section: "mine" | "all";
}

const INITIAL_SPACES: Space[] = [
  // Доступные мне — избранные сверху
  { id: "crm-b2c",      code: "CRMBTCPT", name: "CRM B2C",                          color: "#2BB5A0", letter: "C",  starred: true,  section: "mine" },
  { id: "corp-portal",  code: "KRPPRT",   name: "Корпоративный портал",             color: "#C084FC", letter: "К",  starred: true,  section: "mine" },
  { id: "cloud",        code: "OBLHR",    name: "Облачное хранилище",               color: "#60A5FA", letter: "О",  starred: true,  section: "mine" },
  { id: "demo",         code: "DMDST",    name: "Демо стенд",                       color: "#A78BFA", letter: "Д",  starred: true,  section: "mine" },
  { id: "ecom",         code: "ECOM",     name: "E-commerce",                       color: "#34D399", letter: "E",  starred: false, section: "mine" },
  { id: "crm-problems", code: "CRMBTCPT", name: "CRM B2C: проблемы",               color: "#2EAA6E", letter: "C",  starred: false, section: "mine" },
  { id: "reports",      code: "DIZLYST",  name: "Подготовка отчетов к ...",         color: "#F5820D", letter: null, iconSrc: ICONS.entertainmentPaletteFill, starred: false, section: "mine" },
  { id: "gorynych",     code: "FSOKR",    name: "Горыныч",                          color: "#FB923C", letter: "Ц",  starred: false, section: "mine" },
  { id: "mis",          code: "MISSUP",   name: "МИС: централизованная систем...",  color: "#F472B6", letter: "М",  starred: false, section: "mine" },
  // Доступные всем
  { id: "support",      code: "TCHLP",    name: "Техподдержка",                     color: "#8B5CF6", letter: "Т",  starred: false, section: "all"  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AllSpacesScreen({ dispatch }: ScreenProps) {
  const [spaces, setSpaces] = useState<Space[]>(INITIAL_SPACES);
  const [kebabOpen, setKebabOpen] = useState<string | null>(null);

  // Сортировка: избранные сначала (внутри секции)
  const mineSpaces  = spaces.filter((s) => s.section === "mine");
  const allSpaces   = spaces.filter((s) => s.section === "all");

  const toggleStar = (id: string) => {
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? { ...s, starred: !s.starred } : s))
    );
    setKebabOpen(null);
  };

  const handleKebab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setKebabOpen(kebabOpen === id ? null : id);
  };

  const renderRow = (sp: Space) => (
    <div key={sp.id}>
      <button
        className={`asp-row${kebabOpen === sp.id ? " asp-row--active" : ""}`}
        onClick={() => { setKebabOpen(null); /* заглушка */ }}
      >
        {/* Аватар */}
        <div className="asp-avatar" style={{ background: sp.color }}>
          {sp.iconSrc
            ? <img className="asp-avatar-icon" src={sp.iconSrc} alt="" />
            : sp.letter
          }
          {sp.starred && (
            <img className="asp-star" src={`${import.meta.env.BASE_URL}assets/star-badge-orange.svg`} alt="" />
          )}
        </div>

        {/* Инфо */}
        <div className="asp-info">
          <span className="asp-code">{sp.code}</span>
          <span className="asp-name">{sp.name}</span>
        </div>

        {/* Kebab */}
        <button
          className="asp-kebab-btn"
          aria-label="Меню"
          onClick={(e) => handleKebab(e, sp.id)}
        >
          <img className="asp-kebab-icon" src={ICONS.actionKebabMenu} alt="" />
        </button>
      </button>

      {/* Попап — инлайн, под строкой */}
      {kebabOpen === sp.id && (
        <div className="asp-popup">
          <button className="asp-popup-row" onClick={() => toggleStar(sp.id)}>
            <img
              className="asp-popup-icon"
              src={sp.starred ? ICONS.ratingStarFill : ICONS.ratingStar}
              alt=""
              style={sp.starred
                ? { filter: "brightness(0) saturate(100%) invert(65%) sepia(8%) saturate(350%) hue-rotate(195deg) brightness(90%)" }
                : undefined
              }
            />
            <span className="asp-popup-label">
              {sp.starred ? "Убрать из избранного" : "Добавить в избранное"}
            </span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="asp" onClick={() => setKebabOpen(null)}>

      {/* ── Header ── */}
      <div className="asp-header">
        <h2 className="asp-title">Пространства</h2>
        <button
          className="asp-search-btn"
          onClick={() => dispatch({ type: "push", to: "search" })}
          aria-label="Поиск"
        >
          <img className="asp-search-icon" src={ICONS.actionSearch} alt="" />
        </button>
      </div>

      {/* ── List ── */}
      <div className="asp-list">
        {mineSpaces.map(renderRow)}

        {allSpaces.length > 0 && (
          <>
            <div className="asp-section-label">Доступные всем</div>
            {allSpaces.map(renderRow)}
          </>
        )}
      </div>

      {/* ── TabBar ── */}
      <div className="asp-tabbar">
        <button className="asp-tab" onClick={() => dispatch({ type: "tab_switch", to: "home" })}>
          <img className="asp-tab-icon asp-tab-icon--inactive" src={ICONS.actionHomeFill} alt="" />
          <span className="asp-tab-label asp-tab-label--inactive">Главная</span>
        </button>
        <button className="asp-tab" onClick={() => dispatch({ type: "tab_switch", to: "all-tasks" })}>
          <img className="asp-tab-icon asp-tab-icon--inactive" src={ICONS.documentFolderOpenFill} alt="" />
          <span className="asp-tab-label asp-tab-label--inactive">Задачи</span>
        </button>
        <button className="asp-tab" onClick={() => dispatch({ type: "tab_switch", to: "all-spaces" })}>
          <img className="asp-tab-icon asp-tab-icon--active" src={ICONS.actionCatalogFill} alt="" />
          <span className="asp-tab-label">Пространства</span>
        </button>
      </div>

    </div>
  );
}
