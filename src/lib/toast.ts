export interface FlashToastPayload {
  description?: string;
  title: string;
  type: "error" | "success";
}

const FLASH_TOAST_KEY = "contatexto.flash-toast";

export function saveFlashToast(payload: FlashToastPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(FLASH_TOAST_KEY, JSON.stringify(payload));
}

export function consumeFlashToast() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(FLASH_TOAST_KEY);

  if (!rawValue) {
    return null;
  }

  window.sessionStorage.removeItem(FLASH_TOAST_KEY);

  try {
    return JSON.parse(rawValue) as FlashToastPayload;
  } catch {
    return null;
  }
}
