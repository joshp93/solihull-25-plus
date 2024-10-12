import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './components/main-content/main-content.component';
import { yearGuard } from './guards/year.guard';

const routes: Routes = [
  { path: '', redirectTo: '/2024', pathMatch: 'full' },
  { path: ':year', component: MainContentComponent, canActivate: [yearGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
