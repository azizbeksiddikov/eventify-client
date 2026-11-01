/** True when the user asked the system to reduce motion. Safe on the server (returns false). */
export const prefersReducedMotion = (): boolean =>
	typeof window !== "undefined" && typeof window.matchMedia === "function"
		? window.matchMedia("(prefers-reduced-motion: reduce)").matches
		: false;

/** Scroll behaviour that respects "reduce motion": instant instead of animated. */
export const smoothBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");
