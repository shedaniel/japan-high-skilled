const INTERACTIVE_ROW_SELECTOR =
  'a, button, input, select, textarea, label, [data-slot="checkbox"], [data-slot="radio"], [role="checkbox"], [role="radio"]';

/**
 * Activates a clickable row unless the click came from an interactive child.
 * The guard prevents double toggles when a checkbox, radio, label, or link
 * already handles the same click.
 */
export function activateRow(
  event: { target: EventTarget | null },
  activate: () => void,
  disabled = false,
): void {
  if (disabled) return;
  const target = event.target;
  if (target instanceof Element && target.closest(INTERACTIVE_ROW_SELECTOR)) {
    return;
  }
  activate();
}
