import { Routes, RouterModule } from "@angular/router";

//Import Components to route
import { HomeComponent } from "./pages/home/home.component";
import { LanguageReferenceComponent } from "./pages/languageReference/languageReference.component";
import { SyntaxReferenceComponent } from "./pages/syntaxReference/syntaxReference.component";
import { AboutComponent } from "./pages/about/about.component";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "/the-wall",
        pathMatch: "full"
    },
    {
        path: "the-wall",
        component: HomeComponent
    },
    {
        path: "speaking-wall",
        component: LanguageReferenceComponent
    },
    {
        path: "speaking-wall-well",
        component: SyntaxReferenceComponent
    },
    {
        path: "what-is-a-wall",
        component: AboutComponent
    }
];

export const routing = RouterModule.forRoot(appRoutes);
