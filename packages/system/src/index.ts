export const enum AndroidSystemURLEnum {
  BLUETOOTH = 'android.settings.BLUETOOTH_SETTINGS',
  WIFI = 'android.settings.WIFI_SETTINGS',
}
export const enum IOSSystemURLEnum {
  BLUETOOTH = 'App-prefs:Bluetooth',
  WIFI = 'App-prefs:WIFI',
  // 打开通用设置: App-Prefs:root=General
  // 打开关于本机: App-Prefs:root=General&path=About
  // 打开软件更新: App-Prefs:root=General&path=SOFTWARE_UPDATE_LINK
  // 打开网络设置: App-Prefs:root=General&path=Network
  // 打开Wi-Fi设置: App-Prefs:root=WIFI
  // 打开蓝牙设置: App-Prefs:root=Bluetooth
  // 打开移动数据设置: App-Prefs:root=MOBILE_DATA_SETTINGS_ID
  // 打开运营商设置: App-Prefs:root=Carrier
  // 打开个人热点设置: App-Prefs:root=INTERNET_TETHERING
  // 打开声音和振动设置: App-Prefs:root=Sounds
  // 打开显示和亮度设置: App-Prefs:root=Brightness
  // 打开壁纸设置: App-Prefs:root=Wallpaper
  // 打开Siri设置: App-Prefs:root=SIRI
  // 打开Touch ID和密码设置: App-Prefs:root=TOUCHID_PASSCODE
  // 打开Face ID和密码设置: App-Prefs:root=PASSCODE
  // 打开隐私设置: App-Prefs:root=Privacy
  // 打开位置服务设置: App-Prefs:root=LOCATION_SERVICES
  // 打开日期和时间设置: App-Prefs:root=General&path=DATE_AND_TIME
  // 打开iCloud设置: App-Prefs:root=CASTLE
  // 打开iCloud存储空间设置: App-Prefs:root=CASTLE&path=STORAGE_AND_BACKUP
}
export const enum SystemURLEnum {
  BLUETOOTH,
  WIFI,
}
export class System {
  static get isIOS(): boolean {
    return uni.getSystemInfoSync().osName == 'ios';
  }
  static get isAndroid(): boolean {
    return uni.getSystemInfoSync().osName == 'android';
  }
  static get statusBarHeight(): number {
    return uni.getSystemInfoSync().statusBarHeight!;
  }
  static get appVersion(): string {
    return uni.getSystemInfoSync().appVersion;
  }

  /** 打开系统设置
   *
   * @param url SystemURLEnum 系统URL
   * @returns boolean
   */
  static openSystemSetting(url: SystemURLEnum): boolean {
    try {
      if (this.isAndroid) {
        const mainActivity = plus.android.runtimeMainActivity();
        const Intent = plus.android.importClass('android.content.Intent');
        let intentURL = '';
        if (url == SystemURLEnum.BLUETOOTH) intentURL = AndroidSystemURLEnum.BLUETOOTH;
        if (url == SystemURLEnum.WIFI) intentURL = AndroidSystemURLEnum.WIFI;

        // @ts-ignore
        mainActivity.startActivity(new Intent(intentURL));
      } else if (this.isIOS) {
        let intentURL = '';
        if (url == SystemURLEnum.BLUETOOTH) intentURL = IOSSystemURLEnum.BLUETOOTH;
        if (url == SystemURLEnum.WIFI) intentURL = IOSSystemURLEnum.WIFI;
        plus.runtime.openURL(intentURL);
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default System;
