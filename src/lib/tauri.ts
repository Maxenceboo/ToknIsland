import { invoke } from "@tauri-apps/api/core";

export type HealthcheckResponse = {
  status: string;
  app: string;
  localFirst: boolean;
};

export function healthcheck() {
  return invoke<HealthcheckResponse>("healthcheck");
}
