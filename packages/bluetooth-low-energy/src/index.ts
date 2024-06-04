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
export type OnDeviceStateChangeCalback = (result: OnDeviceStateChangeResult) => void;
export type OnDeviceStateChangeResult = {
  deviceId: string;
  connected: boolean;
};
export type OnDeviceValueChangeCalback = (result: OnDeviceValueChangeResult) => void;
export type OnDeviceValueChangeResult = {
  deviceId: string;
  serviceId: string;
  characteristicId: string;
  value: ArrayBuffer;
};
export type SetMTUOptions = {
  deviceId: string;
  mtu: number;
};
export type WriteOptions = {
  deviceId: string;

  /**
   * 蓝牙特征值对应服务的 uuid
   */
  serviceId: string;

  /**
   * 蓝牙特征值的 uuid
   */
  characteristicId: string;

  /**
   * 蓝牙设备特征值对应的二进制值
   */
  value: ArrayBuffer;

  /**
   * 蓝牙特征值的写模式设置，有两种模式，iOS 优先 write，安卓优先 writeNoResponse
   */
  writeType: WriteType;
};
export enum WriteType {
  Write = 'write',
  WriteNoResponse = 'writeNoResponse',
}
export type ReadOptions = {
  deviceId: string;

  /**
   * 蓝牙特征值对应服务的 uuid
   */
  serviceId: string;

  /**
   * 蓝牙特征值的 uuid
   */
  characteristicId: string;
};
export type NotifyOptions = {
  deviceId: string;

  /**
   * 蓝牙特征值对应服务的 uuid
   */
  serviceId: string;

  /**
   * 蓝牙特征值的 uuid
   */
  characteristicId: string;

  /**
   * 是否启用 notify
   */
  state: boolean;
};
export type GetServicesOptions = {
  deviceId: string;
};
export type Service = {
  /**
   * 蓝牙设备服务的 uuid
   */
  uuid: string;

  /**
   * 该服务是否为主服务
   */
  isPrimary: boolean;
};
export type GetRSSIOptions = {
  deviceId: string;
};
export type GetCharacteristicsOptions = {
  deviceId: string;
  serviceId: string;
};
export type Characteristic = {
  /**
   * 蓝牙设备服务的 uuid
   */
  uuid: string;

  /**
   * 该特征值支持的操作类型
   */
  properties: Object;
};
export type ConnectOptions = {
  deviceId: string;
  timeout?: number;
};
export type DisConnectOptions = {
  deviceId: string;
};
export interface IUniBluetoothLowEnergy {
  setBLEMTU(options: SetMTUOptions): Promise<BluetoothResponse<null>>;
  writeBLECharacteristicValue(options: WriteOptions): Promise<BluetoothResponse<null>>;
  readBLECharacteristicValue(options: ReadOptions): Promise<BluetoothResponse<null>>;
  //
  onBLEConnectionStateChange(callback: OnDeviceStateChangeCalback): void;
  onBLECharacteristicValueChange(callback: OnDeviceValueChangeCalback): void;
  notifyBLECharacteristicValueChange(options: NotifyOptions): Promise<BluetoothResponse<null>>;
  getBLEDeviceServices(options: GetServicesOptions): Promise<BluetoothResponse<Service[]>>;
  getBLEDeviceRSSI(options: GetRSSIOptions): Promise<BluetoothResponse<number>>;
  getBLEDeviceCharacteristics(options: GetCharacteristicsOptions): Promise<BluetoothResponse<Characteristic[]>>;
  createBLEConnection(options: ConnectOptions): Promise<BluetoothResponse<null>>;
  closeBLEConnection(options: DisConnectOptions): Promise<BluetoothResponse<null>>;
}
export class UniBluetoothLowEnergy implements IUniBluetoothLowEnergy {
  private static instance: UniBluetoothLowEnergy | null = null;
  constructor() {}
  static getInstance(): UniBluetoothLowEnergy {
    if (this.instance == null) {
      this.instance = new UniBluetoothLowEnergy();
    }
    return this.instance;
  }
  setBLEMTU(options: SetMTUOptions): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.setBLEMTU({
        ...options,
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, message: errMsg, code }),
      });
    });
  }
  writeBLECharacteristicValue(options: WriteOptions): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      let { value, ...rest } = options;
      const _value: unknown = value;
      uni.writeBLECharacteristicValue({
        ...rest,
        value: _value as any[],
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  readBLECharacteristicValue(options: ReadOptions): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.readBLECharacteristicValue({
        ...options,
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  //
  onBLEConnectionStateChange(callback: OnDeviceStateChangeCalback): void {
    uni.onBLEConnectionStateChange(callback);
  }
  onBLECharacteristicValueChange(callback: OnDeviceValueChangeCalback): void {
    uni.onBLECharacteristicValueChange(({ value, ...rest }) => {
      let _value: unknown = value;
      callback({ value: _value as ArrayBuffer, ...rest });
    });
  }
  notifyBLECharacteristicValueChange(options: NotifyOptions): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.notifyBLECharacteristicValueChange({
        ...options,
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  getBLEDeviceServices(options: GetServicesOptions): Promise<BluetoothResponse<Service[]>> {
    return new Promise((resolve) => {
      uni.getBLEDeviceServices({
        ...options,
        success: ({ errMsg, services }) => resolve({ succeed: true, message: errMsg, data: services }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  getBLEDeviceRSSI(options: GetRSSIOptions): Promise<BluetoothResponse<number>> {
    return new Promise((resolve) => {
      uni.getBLEDeviceRSSI({
        ...options,
        success: ({ errMsg, RSSI }) => resolve({ succeed: true, message: errMsg, data: RSSI }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  getBLEDeviceCharacteristics(options: GetCharacteristicsOptions): Promise<BluetoothResponse<Characteristic[]>> {
    return new Promise((resolve) => {
      uni.getBLEDeviceCharacteristics({
        ...options,
        success: ({ errMsg, characteristics }) => resolve({ succeed: true, message: errMsg, data: characteristics }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  createBLEConnection(options: ConnectOptions): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.createBLEConnection({
        ...options,
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
  closeBLEConnection(options: DisConnectOptions): Promise<BluetoothResponse<null>> {
    return new Promise((resolve) => {
      uni.closeBLEConnection({
        ...options,
        success: ({ errMsg }) => resolve({ succeed: true, message: errMsg }),
        fail: ({ code, errMsg }) => resolve({ succeed: false, code, message: errMsg }),
      });
    });
  }
}
export default UniBluetoothLowEnergy;
