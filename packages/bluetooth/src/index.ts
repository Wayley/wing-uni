export type BluetoothResponse<T> = {
  /**
   * 方法调用是否成功
   */
  succeed: boolean;

  /**
   * 方法调用成功/失败码
   */
  code?: number;

  /**
   * 方法调用成功/失败信息
   */
  message?: string;

  /**
   * 方法调用成功返回的数据
   */
  data?: T;
};
export type StartScanOptions = {
  /**
   * 要搜索的蓝牙设备主 service 的 uuid 列表
   */
  services?: string[];

  /**
   * 是否允许重复上报同一设备
   * 默认为 false
   */
  allowDuplicatesKey?: boolean;

  /**
   * 上报设备的间隔。0 表示找到新设备立即上报，其他数值根据传入的间隔上报。
   * 默认为 0
   */
  interval?: number;

  /**
   * 扫描模式，越高扫描越快，也越耗电
   * 默认为 PowerLevel.Medium
   */
  powerLevel?: PowerLevel;
};
export enum PowerLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}
export type OnDeviceFoundCallback = (result: OnDeviceFoundResult) => void;
export type OnDeviceFoundResult = {
  devices: DeviceInfo[];
};
export type DeviceInfo = {
  /**
   * 蓝牙设备名称，某些设备可能没有
   */
  name: string;

  /**
   * 用于区分设备的 id
   */
  deviceId: string;

  /**
   * 当前蓝牙设备的信号强度
   */
  RSSI: number;

  /**
   * 当前蓝牙设备的广播数据段中的ManufacturerData数据段
   */
  advertisData: ArrayBuffer;

  /**
   * 当前蓝牙设备的广播数据段中的ServiceUUIDs数据段
   */
  advertisServiceUUIDs: string[];

  /**
   * 当前蓝牙设备的广播数据段中的LocalName数据段
   */
  localName: string; // Object

  /**
   * 当前蓝牙设备的广播数据段中的ServiceData数据段
   */
  serviceData: Object;
};
export type OnAdapterStateChangeCallback = (result: OnAdapterStateChangeResult) => void;
export type OnAdapterStateChangeResult = {
  /**
   * 是否正在搜索设备
   */
  discovering: boolean;

  /**
   * 蓝牙适配器是否可用
   */
  available: boolean;
};
export type GetConnectedDevicesOptions = {
  services: string[];
};
export type ConnectedDeviveInfo = {
  /**
   * 蓝牙设备名称，某些设备可能没有
   */
  name: string;

  /**
   * 用于区分设备的 id
   */
  deviceId: string;
};
export type GetAdapterStateResult = {
  /**
   * 是否正在搜索设备
   */
  discovering: boolean;

  /**
   * 蓝牙适配器是否可用
   */
  available: boolean;
};
export interface IUniBluetooth {
  openBluetoothAdapter(): Promise<BluetoothResponse<null>>;
  startBluetoothDevicesDiscovery(options: StartScanOptions): Promise<BluetoothResponse<null>>;
  onBluetoothDeviceFound(callback: OnDeviceFoundCallback): void;
  stopBluetoothDevicesDiscovery(): Promise<BluetoothResponse<null>>;
  onBluetoothAdapterStateChange(callback: OnAdapterStateChangeCallback): void;
  getConnectedBluetoothDevices(options: GetConnectedDevicesOptions): Promise<BluetoothResponse<ConnectedDeviveInfo[]>>;
  getBluetoothDevices(): Promise<BluetoothResponse<DeviceInfo[]>>;
  getBluetoothAdapterState(): Promise<BluetoothResponse<GetAdapterStateResult>>;
  closeBluetoothAdapter(): Promise<BluetoothResponse<null>>;
}
export class UniBluetooth implements IUniBluetooth {
  private static instance: UniBluetooth | null = null;
  constructor() {}
  static getInstance(): UniBluetooth {
    if (this.instance == null) {
      this.instance = new UniBluetooth();
    }
    return this.instance;
  }
  openBluetoothAdapter(): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.openBluetoothAdapter({
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, message: errMsg, code }),
      });
    });
  }
  startBluetoothDevicesDiscovery(options: StartScanOptions): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.startBluetoothDevicesDiscovery({
        ...options,
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, message: errMsg, code }),
      });
    });
  }
  onBluetoothDeviceFound(callback: OnDeviceFoundCallback): void {
    uni.onBluetoothDeviceFound((result: unknown) => {
      callback(result as OnDeviceFoundResult);
    });
  }
  stopBluetoothDevicesDiscovery(): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.stopBluetoothDevicesDiscovery({
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, message: errMsg, code }),
      });
    });
  }
  onBluetoothAdapterStateChange(callback: OnAdapterStateChangeCallback): void {
    uni.onBluetoothAdapterStateChange(callback);
  }
  getConnectedBluetoothDevices(options: GetConnectedDevicesOptions): Promise<BluetoothResponse<ConnectedDeviveInfo[]>> {
    return new Promise((resolve) => {
      uni.getConnectedBluetoothDevices({
        ...options,
        success: ({ errMsg, devices }) => resolve({ succeed: true, message: errMsg, data: devices }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, message: errMsg, code }),
      });
    });
  }
  getBluetoothDevices(): Promise<BluetoothResponse<DeviceInfo[]>> {
    return new Promise((resolve) => {
      uni.getBluetoothDevices({
        success: ({ errMsg, devices }: { errMsg: string; devices: unknown }) => resolve({ succeed: true, message: errMsg, data: devices as DeviceInfo[] }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, message: errMsg, code }),
      });
    });
  }
  getBluetoothAdapterState(): Promise<BluetoothResponse<GetAdapterStateResult>> {
    return new Promise((resolve) => {
      uni.getBluetoothAdapterState({
        success: ({ errMsg, discovering, available }) => resolve({ succeed: true, message: errMsg, data: { discovering, available } }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, message: errMsg, code }),
      });
    });
  }
  closeBluetoothAdapter(): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.closeBluetoothAdapter({
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, message: errMsg, code }),
      });
    });
  }
}
export default UniBluetooth;
