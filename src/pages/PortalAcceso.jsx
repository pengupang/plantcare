import { useNavigate } from "react-router-dom";

export default function PortalAcceso() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Lado izquierdo — Arriendo de Maquinaria */}
      <div
        style={styles.panelLeft}
        onClick={() => navigate("/maquinaria/login")}
        onMouseEnter={e => {
          e.currentTarget.style.flex = "0.6";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.flex = "0.5";
        }}
      >
        <div style={styles.content}>
          <span style={styles.eyebrowLeft}>Sistema de gestión</span>
          <h1 style={styles.titleLeft}>Arriendo de<br />Maquinaria</h1>
          <p style={styles.desc}>
            Gestión de equipos, contratos y clientes
          </p>
          <button style={styles.btnLeft}>Ingresar</button>
        </div>
        <div style={styles.decorLeft} />
      </div>

      {/* Divisor central */}
      <div style={styles.divider}>
        <div style={styles.dividerLine} />
        <div style={styles.dividerDot} />
        <div style={styles.dividerLine} />
      </div>

      {/* Lado derecho — Lechería */}
      <div
        style={styles.panelRight}
        onClick={() => navigate("/lecheria/login")}
        onMouseEnter={e => {
          e.currentTarget.style.flex = "0.6";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.flex = "0.5";
        }}
      >
        <div style={styles.content}>
          <span style={styles.eyebrowRight}>Inventario y campo</span>
          <h1 style={styles.titleRight}>Lechería</h1>
          <p style={styles.desc}>
            Inventario, producción y monitoreo de suelo
          </p>
          <button style={styles.btnRight}>Ingresar</button>
        </div>
        <div style={styles.decorRight} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: "hidden",
    cursor: "pointer",
  },

  // ── Panel izquierdo ──────────────────────────────────────────────────────────
  panelLeft: {
    flex: 0.5,
    backgroundColor: "#1B2A4A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    transition: "flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  eyebrowLeft: {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.12em",
    color: "#7B96C2",
    marginBottom: "16px",
    textTransform: "lowercase",
  },
  titleLeft: {
    fontSize: "clamp(2rem, 4vw, 3.5rem)",
    fontWeight: 700,
    color: "#FFFFFF",
    lineHeight: 1.1,
    margin: "0 0 20px 0",
  },
  btnLeft: {
    marginTop: "32px",
    padding: "12px 32px",
    backgroundColor: "transparent",
    border: "1.5px solid #4A6FA5",
    color: "#A8C4E8",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.04em",
  },
  decorLeft: {
    position: "absolute",
    bottom: "-60px",
    left: "-60px",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    border: "1px solid rgba(74, 111, 165, 0.2)",
    pointerEvents: "none",
  },

  // ── Panel derecho ────────────────────────────────────────────────────────────
  panelRight: {
    flex: 0.5,
    backgroundColor: "#1E3128",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    transition: "flex 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
  },
  eyebrowRight: {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.12em",
    color: "#6A9B7A",
    marginBottom: "16px",
    textTransform: "lowercase",
  },
  titleRight: {
    fontSize: "clamp(2rem, 4vw, 3.5rem)",
    fontWeight: 700,
    color: "#FFFFFF",
    lineHeight: 1.1,
    margin: "0 0 20px 0",
  },
  btnRight: {
    marginTop: "32px",
    padding: "12px 32px",
    backgroundColor: "transparent",
    border: "1.5px solid #3D6B4F",
    color: "#8EC9A0",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.04em",
  },
  decorRight: {
    position: "absolute",
    top: "-60px",
    right: "-60px",
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    border: "1px solid rgba(61, 107, 79, 0.2)",
    pointerEvents: "none",
  },

  // ── Divisor ──────────────────────────────────────────────────────────────────
  divider: {
    width: "1px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    gap: "0",
  },
  dividerLine: {
    flex: 1,
    width: "1px",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  dividerDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    flexShrink: 0,
    margin: "8px 0",
  },

  // ── Shared ───────────────────────────────────────────────────────────────────
  content: {
    position: "relative",
    zIndex: 1,
    padding: "40px",
    maxWidth: "380px",
  },
  desc: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: "260px",
  },
};