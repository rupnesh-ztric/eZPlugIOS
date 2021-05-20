import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';


import { WalletPage } from './wallet.page';
const routes: Routes = [
  {
    path: '',
    component: WalletPage,
    resolve: {
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
