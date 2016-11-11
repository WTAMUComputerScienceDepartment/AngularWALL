import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { routing } from "./app.routing";
import { AppComponent } from "./app.component";

//Application Structure
import { AboutComponent } from "./pages/about/about.component";
import { HomeComponent } from "./pages/home/home.component";
import { LanguageReferenceComponent } from "./pages/languageReference/languageReference.component";
import { SyntaxReferenceComponent } from "./pages/syntaxReference/syntaxReference.component";

//Components
import { MachineTableComponent } from "./components/machineTable/machineTable.component";
import { RegisterTableComponent } from "./components/registerTable/registerTable.component";
import { ConsoleComponent } from "./components/console/console.component";

@NgModule({
  imports: [
      BrowserModule, routing, FormsModule
  ],
  declarations: [
      AppComponent, AboutComponent, ConsoleComponent, HomeComponent, LanguageReferenceComponent,
      MachineTableComponent, RegisterTableComponent, SyntaxReferenceComponent
  ],
  bootstrap: [
      AppComponent
  ]
})
export class AppModule { }
