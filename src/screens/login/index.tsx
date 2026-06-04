import { useState } from "react";
import type { ScreenProps } from "../../router/types";
import { ICONS } from "../../config/icons.registry";

export default function LoginScreen({ dispatch }: ScreenProps) {
  const [login, setLogin]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginFocus, setLoginFocus] = useState(false);
  const [passFocus,  setPassFocus]  = useState(false);

  const handleLogin = () => {
    dispatch({ type: "replace", to: "home" });
  };

  return (
    <div style={s.root}>
      {/* Logo */}
      <img src={`${import.meta.env.BASE_URL}assets/avatar-user.svg`} alt="Yaga" style={s.logo} />

      {/* Title */}
      <h1 style={s.title}>Добро пожаловать</h1>

      {/* Inputs */}
      <div style={s.form}>
        {/* Login */}
        <div style={{ ...s.inputWrap, borderColor: loginFocus ? "rgba(0,85,255,1)" : "rgba(208,212,220,1)" }}>
          <span style={s.inputLabel}>Логин</span>
          <input
            style={s.input}
            type="text"
            placeholder="Введите логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            onFocus={() => setLoginFocus(true)}
            onBlur={() => setLoginFocus(false)}
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div style={{ ...s.inputWrap, borderColor: passFocus ? "rgba(0,85,255,1)" : "rgba(208,212,220,1)" }}>
          <span style={s.inputLabel}>Пароль</span>
          <div style={s.inputRow}>
            <input
              style={{ ...s.input, flex: 1 }}
              type={showPass ? "text" : "password"}
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              autoComplete="current-password"
            />
            {password.length > 0 && (
              <button style={s.eyeBtn} onClick={() => setShowPass((v) => !v)} tabIndex={-1}>
                <img
                  src={showPass ? ICONS.actionSearch : ICONS.actionSearch}
                  alt=""
                  style={{ width: 20, height: 20, filter: "brightness(0) saturate(0) opacity(0.4)" }}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Button */}
      <button style={s.btn} onClick={handleLogin}>
        Войти
      </button>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    width: "100%", height: "100%",
    display: "flex", flexDirection: "column",
    alignItems: "center",
    padding: "0 16px",
    background: "rgba(255,255,255,1)",
    fontFamily: "'Inter', -apple-system, sans-serif",
    paddingTop: 80,
    boxSizing: "border-box",
    overflow: "hidden",
  },
  logo: { width: 64, height: 64, marginBottom: 16 },
  title: {
    fontSize: 26, lineHeight: "31px", fontWeight: 600, letterSpacing: "-0.5px",
    color: "rgba(14,17,23,1)", marginBottom: 32, textAlign: "center",
  },
  form: { width: "100%", display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
  inputWrap: {
    width: "100%", borderRadius: 10, border: "1.5px solid",
    background: "rgba(255,255,255,1)", padding: "10px 14px",
    display: "flex", flexDirection: "column", gap: 2,
    boxSizing: "border-box",
  },
  inputLabel: {
    fontSize: 12, lineHeight: "13px", fontWeight: 400, letterSpacing: "-0.1px",
    color: "rgba(133,143,163,1)",
  },
  inputRow: { display: "flex", alignItems: "center" },
  input: {
    border: "none", outline: "none", background: "transparent",
    fontSize: 15, lineHeight: "17px", fontWeight: 400, letterSpacing: "-0.2px",
    color: "rgba(14,17,23,1)", width: "100%", padding: 0,
  },
  eyeBtn: {
    background: "transparent", border: "none", cursor: "pointer",
    padding: 0, display: "flex", alignItems: "center",
  },
  btn: {
    width: "100%", height: 50, borderRadius: 12,
    background: "rgba(0,85,255,1)", color: "rgba(255,255,255,1)",
    border: "none", cursor: "pointer",
    fontSize: 16, lineHeight: "18px", fontWeight: 500, letterSpacing: "-0.3px",
  },
};
