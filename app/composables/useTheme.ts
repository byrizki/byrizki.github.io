export const useTheme = () => {
  const theme = useState<"light" | "dark">("theme", () => "dark");
  const lastClick = useState<{ x: number; y: number }>("last-click", () => ({
    x: 0,
    y: 0,
  }));

  const getInitialTheme = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem("theme") as "light" | "dark" | null;
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        return "dark";
    }
    return "dark";
  };

  const updateDom = async (withTransition = false) => {
    if (!import.meta.client) return;

    const performUpdate = () => {
      if (theme.value === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    if (!withTransition || !document.startViewTransition) {
      performUpdate();
      return;
    }

    const x = lastClick.value.x;
    const y = lastClick.value.y;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(async () => {
      performUpdate();
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 600,
        easing: "cubic-bezier(.76,.32,.29,.99)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  const set = (value: "light" | "dark") => {
    theme.value = value;
    if (import.meta.client) {
      localStorage.setItem("theme", value);
      updateDom(true);
    }
  };

  const toggle = () => {
    const next = theme.value === "light" ? "dark" : "light";
    set(next);
  };

  const init = () => {
    if (import.meta.client) {
      theme.value = getInitialTheme();
      updateDom(false);

      window.addEventListener(
        "click",
        (e) => {
          lastClick.value = { x: e.clientX, y: e.clientY };
        },
        { capture: true }
      );
    }
  };

  return {
    theme,
    init,
    toggle,
  };
};
