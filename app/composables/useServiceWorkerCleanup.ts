const SUB_PROJECT_PATTERN = /^\/(jsoneval-rs|rusto-rs)($|\/)/;

export function useServiceWorkerCleanup() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const currentPath = window.location.pathname;
  if (!SUB_PROJECT_PATTERN.test(currentPath)) return;

  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    if (registrations.length === 0) return;
    await Promise.all(registrations.map((r) => r.unregister()));
    window.location.reload();
  });
}
