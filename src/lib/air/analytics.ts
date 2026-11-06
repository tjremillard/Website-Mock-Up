export type AirEvent =
  | "homepage_view"
  | "property_search"
  | "property_selected"
  | "map_layer_toggled"
  | "article_opened"
  | "signup_started"
  | "signup_completed_demo"
  | "property_saved"
  | "claim_started"
  | "claim_submitted_demo"
  | "scip_previewed"
  | "pro_cta_clicked"
  | "vision_market_changed";
export function trackEvent(
  event: AirEvent,
  details?: { id?: string; layer?: string; vertical?: string },
) {
  if (process.env.NODE_ENV === "development")
    console.info("[AIR demo event — not persisted]", event, details ?? {});
}
