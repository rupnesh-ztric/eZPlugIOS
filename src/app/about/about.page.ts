import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppRate, AppRateReviewTypeIos } from '@ionic-native/app-rate/ngx';
import * as moment from 'moment';
import { DashBoardService } from '../dashboard/dashboard.service';
import { LoaderService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { constString } from '../constString';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Plugins, StatusBarStyle } from '@capacitor/core';
const { Device } = Plugins;
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  appName;
  appVersionNumber;
  info:any;
  appDetails:any;

  invoiceData = {
    discount: 0,
    errorCode: null,
    errorDescription: null,
    grandTotal: 1.0895056856710463,
    hasError: false,
    perUnitCost: 15,
    perUnitTotalCost: 1.0650000348687172,
    serviceCharge: 0.02450565080232918,
    timeInHours: 0.06944444444444445,
    transactionId: "20200909133012",
    units: 0.07100000232458115,
    waitingCharge: 0,
    waitingTimeInHours: 0,
  } 
  constructor(private appVersion: AppVersion, private appRate: AppRate, private iab: InAppBrowser, public platform: Platform,
    private dashboardService: DashBoardService, private alertService: AlertService, private loaderService: LoaderService, private safariViewController:SafariViewController) { }

  async ngOnInit() {
    if (this.platform.is('android') || this.platform.is('ios')) { 
      this.appName = await this.appVersion.getAppName()
      this.appVersionNumber = await this.appVersion.getVersionNumber();
      this.info = await Device.getInfo();

      this.dashboardService.getLatestVersionOfApp().subscribe(data => {
        if (data.hasError === false) {
          
          if(this.info.platform === 'android') {
            this.appDetails = data.versionViewModels.filter(data => {
              return data.appName == "EZCharge Android App"
            })
          }
          else if(this.info.platform === 'ios') {
            this.appDetails = data.versionViewModels.filter(data => {
              return data.appName == "EZCharge IOS App"
            })
          }
        }
      }, (error: any) => {
        this.alertService.presentToast(constString.HTTP_RESPONSE_ERROR)
        this.loaderService.hideLoader();
      })
    }
    

  }
  convertToTimeFormat (time:any) {
    let converted:any = time * 60 * 60;
    return moment().startOf('day').seconds((converted)).format('HH:mm:ss')
  }
  returnNumber(number) {
    return parseFloat(number).toFixed(2)
  }
  openPrivacy() {
    // const options: InAppBrowserOptions = {  zoom: 'no', location: 'no', toolbar: 'no' };
    // const browser = this.iab.create('https://ezcharge-portal.azurewebsites.net/privacy_policy.html','_self','toolbar=no');
    console.log("privacy clicked...")
    const browser = this.iab.create('https://ezcharge-portal.azurewebsites.net/privacy_policy.html','_self','toolbar=no');
    browser.show();
  }
  openLicence() {
    const options: InAppBrowserOptions = {  zoom: 'no', location: 'no', toolbar: 'no' };
    const browser = this.iab.create('https://ezcharge-portal.azurewebsites.net/licence.html','_self','toolbar=no');
    browser.show();
  }
  rateOurApp() {
    console.log("app...",this.appDetails," ",this.appDetails[0].url)
    this.appRate.preferences = {
      ...this.appRate.preferences,
      storeAppURL: {
        android: this.appDetails[0].url,
        ios: this.appDetails[0].url
      },
      openUrl: function(url) {
        console.log("ios url...",url)
        // window.open(url, '_system')
        // window.open(url, '_blank', 'location=yes');
        this.safariViewController.show(
          {
            url: url,
            barColor: "#0000ff", // on iOS 10+ you can change the background color as well
            controlTintColor: "#00ffff", // on iOS 10+ you can override the default tintColor
            tintColor: "#00ffff", // should be set to same value as controlTintColor and will be a fallback on older ios
          },
        )

      },
      customLocale: {
        title: "Would you mind rating %@?",
        message: "It won’t take more than a minute and helps to promote our app. Thanks for your support!",
        cancelButtonLabel: "No, Thanks",
        laterButtonLabel: "Remind Me Later",
        rateButtonLabel: "Rate It Now",
        yesButtonLabel: "Yes!",
        noButtonLabel: "Not really",
        appRatePromptTitle: 'Do you like using %@',
        feedbackPromptTitle: 'Mind giving us some feedback?',
      },
    }
    this.appRate.promptForRating(true);
  }
}