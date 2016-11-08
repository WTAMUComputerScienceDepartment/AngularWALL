import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { routing } from "./app.routing";

//Application Structure
import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";

//Components
import { MachineTableComponent } from "./components/machineTable/machineTable.component";

@NgModule({
  imports: [
      BrowserModule, routing, FormsModule
  ],
  declarations: [
      AppComponent, HomeComponent, MachineTableComponent
  ],
  bootstrap: [
      AppComponent
  ]
})
export class AppModule { }
