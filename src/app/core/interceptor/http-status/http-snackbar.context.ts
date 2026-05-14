import { HttpContextToken } from "@angular/common/http";

export const SKIP_HTTP_SNACKBAR = new HttpContextToken<boolean>(() => false);
