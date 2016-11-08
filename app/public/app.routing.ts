import { Routes, RouterModule } from "@angular/router";

//Import Components to route
import { HomeComponent } from "./pages/home/home.component";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "/the-wall",
        pathMatch: "full"
    },
    {
        path: "the-wall",
        component: HomeComponent
    }
];

export const routing = RouterModule.forRoot(appRoutes);
