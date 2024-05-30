export type BluetoothResponseBase = {
  succeed: boolean;
  code?: number;
  message?: string;
};
export type BluetoothAdapterStateResult = {
  discovering: boolean;
  available: boolean;
};
export type GetBluetoothAdapterStateResult = BluetoothResponseBase & {
  data?: BluetoothAdapterStateResult;
};
export enum PowerLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}
export type StartBluetoothDevicesDiscoveryOptions = {
  services?: string[];
  allowDuplicatesKey?: boolean;
  interval?: number;
  powerLevel?: PowerLevel;
};
export type GetConnectedBluetoothDevicesResult = BluetoothResponseBase & {
  data?: UniNamespace.GetConnectedBluetoothDevicesSuccessData[];
};
export type GetBluetoothDevicesResult = BluetoothResponseBase & {
  data?: UniNamespace.BluetoothDeviceInfo[];
};
class Bluetooth {
  private static instance: Bluetooth | null = null;
  constructor() {}
  public static getInstance(): Bluetooth {
    if (this.instance == null) {
      this.instance = new Bluetooth();
    }
    return this.instance!;
  }
  openBluetoothAdapter(): Promise<BluetoothResponseBase> {
    return new Promise((resolve) => {
      uni.openBluetoothAdapter({
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  closeBluetoothAdapter(): Promise<BluetoothResponseBase> {
    return new Promise((resolve) => {
      uni.closeBluetoothAdapter({
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  getBluetoothAdapterState(): Promise<GetBluetoothAdapterStateResult> {
    return new Promise((resolve) => {
      uni.getBluetoothAdapterState({
        success: ({ errMsg, available, discovering }) => resolve({ succeed: true, message: errMsg, data: { available, discovering } }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  startBluetoothDevicesDiscovery(options?: StartBluetoothDevicesDiscoveryOptions): Promise<BluetoothResponseBase> {
    return new Promise((resolve) => {
      uni.startBluetoothDevicesDiscovery({
        ...options,
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  stopBluetoothDevicesDiscovery(): Promise<BluetoothResponseBase> {
    return new Promise((resolve) => {
      uni.stopBluetoothDevicesDiscovery({
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  getConnectedBluetoothDevices(services: string[]): Promise<GetConnectedBluetoothDevicesResult> {
    return new Promise((resolve) => {
      uni.getConnectedBluetoothDevices({
        services,
        success: ({ errMsg, devices }) => resolve({ succeed: true, message: errMsg, data: devices }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  getBluetoothDevices(): Promise<GetBluetoothDevicesResult> {
    return new Promise((resolve) => {
      uni.getBluetoothDevices({
        success: ({ errMsg, devices }) => resolve({ succeed: true, message: errMsg, data: devices }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  onBluetoothAdapterStateChange(callback: (result: UniNamespace.OnBluetoothAdapterStateChangeResult) => void): void {
    return uni.onBluetoothAdapterStateChange(callback);
  }
  onBluetoothDeviceFound(callback: (result: UniNamespace.OnBluetoothDeviceFoundResult) => void): void {
    return uni.onBluetoothDeviceFound(callback);
  }
}
function getOS() {
  const os = uni.getSystemInfoSync()?.osName;
  return {
    isIOS: os == 'ios',
    isAndroid: os == 'android',
  };
}
export interface IBluetoothController {
  openAdapter(): Promise<BluetoothResponseBase>;
  closeAdapter(): Promise<BluetoothResponseBase>;
  getAdapterState(): Promise<GetBluetoothAdapterStateResult>;
  startScan(options?: StartBluetoothDevicesDiscoveryOptions): Promise<BluetoothResponseBase>;
  stopScan(): Promise<BluetoothResponseBase>;
  getConnectedDevices(services?: string[]): Promise<GetConnectedBluetoothDevicesResult>;
  getDevices(services?: string[]): Promise<GetBluetoothDevicesResult>;
  onAdapterStateChange(callback: (result: UniNamespace.OnBluetoothAdapterStateChangeResult) => void): void;
  onDeviceFound(callback: (device: UniNamespace.BluetoothDeviceInfo) => void): void;
  onDevicesFound(callback: (devices: UniNamespace.BluetoothDeviceInfo[]) => void): void;
}
export class BluetoothController implements IBluetoothController {
  private bluetooth: Bluetooth;
  private services: string[];
  constructor(services?: string[]) {
    this.bluetooth = Bluetooth.getInstance();
    this.services = services ?? [];
  }
  public openAdapter(): Promise<BluetoothResponseBase> {
    return this.bluetooth.openBluetoothAdapter();
  }
  public closeAdapter(): Promise<BluetoothResponseBase> {
    return this.bluetooth.closeBluetoothAdapter();
  }
  public getAdapterState(): Promise<GetBluetoothAdapterStateResult> {
    return this.bluetooth.getBluetoothAdapterState();
  }
  public startScan(options?: StartBluetoothDevicesDiscoveryOptions): Promise<BluetoothResponseBase> {
    options = options ?? { services: this.services };
    const { isIOS } = getOS();
    if (isIOS) {
      options.services = [];
      // Or
      // delete options.services
    }
    return this.bluetooth.startBluetoothDevicesDiscovery(options);
  }
  public stopScan(): Promise<BluetoothResponseBase> {
    return this.bluetooth.stopBluetoothDevicesDiscovery();
  }
  public getConnectedDevices(services?: string[]): Promise<GetConnectedBluetoothDevicesResult> {
    services = services ?? this.services;
    return this.bluetooth.getConnectedBluetoothDevices(services);
  }
  public async getDevices(services?: string[]): Promise<GetBluetoothDevicesResult> {
    services = services ?? this.services;
    const { succeed, data, ...rest } = await this.bluetooth.getBluetoothDevices();
    let _data: UniNamespace.BluetoothDeviceInfo[] | undefined = data;
    if (services && services.length > 0 && succeed && data && data.length > 0) {
      _data = data.filter(({ advertisServiceUUIDs }) => advertisServiceUUIDs.filter((o) => services.indexOf(o) > -1).length > 0);
    }
    return Promise.resolve({ succeed, ...rest, data: _data });
  }
  public onAdapterStateChange(callback: (result: UniNamespace.OnBluetoothAdapterStateChangeResult) => void): void {
    return this.bluetooth.onBluetoothAdapterStateChange(callback);
  }
  public onDeviceFound(callback: (device: UniNamespace.BluetoothDeviceInfo) => void): void {
    return this.bluetooth.onBluetoothDeviceFound(({ devices }: UniNamespace.OnBluetoothDeviceFoundResult) => {
      if (devices && devices.length > 0) {
        callback(devices[0]!);
      }
    });
  }
  public onDevicesFound(callback: (devices: UniNamespace.BluetoothDeviceInfo[]) => void): void {
    let devices: UniNamespace.BluetoothDeviceInfo[] = [];
    return this.onDeviceFound((device) => {
      if (!devices.find((o) => o.deviceId! == device.deviceId!)) {
        devices.unshift(device);
        callback(devices);
      }
    });
  }
}
export default BluetoothController;
