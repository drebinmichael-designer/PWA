import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { AppRouter, useRouter } from "./router/AppRouter";
import { SCREENS } from "./config/screens.config";
import type { ScreenId } from "./router/types";
import TabBar from "./components/Tabbar";
import "./styles/global.css";
import "./styles/tokens.css";
import "./styles/app.css";

// CompareOverlay загружается только в dev-сборке
const CompareOverlay = import.meta.env.DEV
  ? lazy(() => import("./devtools/CompareOverlay"))
  : null;

// ─── Screen renderer ──────────────────────────────────────────────────────────

function ScreenRenderer() {
  const { screen, activeTab, dispatch } = useRouter();

  const prevScreen = useRef<ScreenId>(screen as ScreenId);
  const [displayed, setDisplayed] = useState<ScreenId>(screen as ScreenId);
  const [slide, setSlide] = useState<"" | "out" | "in">("");

  useEffect(() => {
    if (screen === prevScreen.current) return;
    prevScreen.current = screen as ScreenId;

    setSlide("out");
    const t1 = setTimeout(() => {
      setDisplayed(screen as ScreenId);
      setSlide("in");
      const t2 = setTimeout(() => setSlide(""), 220);
      return () => clearTimeout(t2);
    }, 180);
    return () => clearTimeout(t1);
  }, [screen]);

  const Screen = SCREENS[displayed] ?? SCREENS["home"];

  return (
    <div className="app-shell">
      <div className={`screen-wrap ${slide}`}>
        <Suspense fallback={<div className="screen-loader" />}>
          <Screen dispatch={dispatch} activeTab={activeTab} />
        </Suspense>
      </div>

      {/* Персистентный TabBar — не ремаунтится при переключении табов */}
      <TabBar />

      {/* Dev-only: reference PNG overlay for visual comparison */}
      {CompareOverlay && (
        <Suspense fallback={null}>
          <CompareOverlay screen={displayed} />
        </Suspense>
      )}
    </div>
  );
}

// ─── Splash auto-redirect ─────────────────────────────────────────────────────

function SplashGate() {
  const { screen, dispatch } = useRouter();

  useEffect(() => {
    if (screen !== "splash") return;
    const t = setTimeout(
      () => dispatch({ type: "replace", to: "login" }),
      2000
    );
    return () => clearTimeout(t);
  }, [screen, dispatch]);

  return <ScreenRenderer />;
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AppRouter initialScreen="splash">
      <SplashGate />
    </AppRouter>
  );
}
