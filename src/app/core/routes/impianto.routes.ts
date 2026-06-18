import { Routes } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";

// export const IMPIANTO_ROUTES: Routes = [
//   {
//     path: "",
//     component: ImpiantiRicercaComponent,
//     data: { role: ["ADMIN", "GEST", "GUEST"] },
//     canActivate: [AuthGuard],
//   },
//   {
//     path: "inserimento-impianto",
//     component: ImpiantiFormComponent,
//     data: { role: ["ADMIN", "GEST"] },
//     canActivate: [AuthGuard],
//   },
//   {
//     path: "modifica-impianto/:id",
//     component: ImpiantiFormComponent,
//     data: { role: ["ADMIN", "GEST"] },
//     canActivate: [AuthGuard],
//   },
//   {
//     path: "dettaglio-impianto/:id",
//     component: ImpiantiFormComponent,
//     data: { role: ["ADMIN", "GEST", "GUEST"] },
//     canActivate: [AuthGuard],
//   },
// ];
