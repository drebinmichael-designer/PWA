import type { ScreenProps } from "../../router/types";

/** Белый экран с логотипом Yaga по центру. Авто-переход через App.tsx (2 сек). */
export default function SplashScreen(_: ScreenProps) {
  return (
    <div style={s.root}>
      <img src={`${import.meta.env.BASE_URL}assets/avatar-user.svg`} alt="Yaga" style={s.logo} />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    width: "100%", height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(255,255,255,1)",
  },
  logo: { width: 80, height: 80 },
};
