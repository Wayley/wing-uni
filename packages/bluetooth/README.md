# @wing-uni/bluetooth

## Install

```shell
$ npm install @wing-uni/bluetooth
```

## Usage

### Instance

```ts
import BluetoothController, { PowerLevel } from '@wing-uni/bluetooth';
import type { BluetoothResponseBase, BluetoothAdapterStateResult, GetBluetoothAdapterStateResult, StartBluetoothDevicesDiscoveryOptions, GetConnectedBluetoothDevicesResult, GetBluetoothDevicesResult } from '@wing-uni/bluetooth';

const bluetoothController = new BluetoothController();

// Or designate services
const services = ['0000FF00-0000-1000-8000-00805F9B34FB'];
const bluetoothControllerWithServices = BluetoothController.getInstance(services);
```

### Methods

- openAdapter

```ts
  openAdapter(): Promise<BluetoothResponseBase>;
```

- closeAdapter

```ts
  closeAdapter(): Promise<BluetoothResponseBase>;
```

- getAdapterState

```ts
getAdapterState(): Promise<GetBluetoothAdapterStateResult>;
```

- startScan

```ts
  startScan(options?: StartBluetoothDevicesDiscoveryOptions): Promise<BluetoothResponseBase>;
```

- stopScan

```ts
  stopScan(): Promise<BluetoothResponseBase>;
```

- getConnectedDevices

```ts
  getConnectedDevices(services?: string[]): Promise<GetConnectedBluetoothDevicesResult>;
```

- getDevices

```ts
  getDevices(services?: string[]): Promise<GetBluetoothDevicesResult>;
```

- onAdapterStateChange

```ts
onAdapterStateChange(callback: (result: UniNamespace.OnBluetoothAdapterStateChangeResult) => void): void;
```

- onDeviceFound

```ts
  onDeviceFound(callback: (device: UniNamespace.BluetoothDeviceInfo) => void): void;
```

- onDevicesFound

```ts
  onDevicesFound(callback: (devices: UniNamespace.BluetoothDeviceInfo[]) => void): void;
```

### Types

#### BluetoothResponseBase

| Property |                 Type                 |                  Description                   |
| :------: | :----------------------------------: | :--------------------------------------------: |
| succeed  |              `boolean`               | Whether the API operation is successful or not |
|   code   | <code>number &#124; undefined</code> |                                                |
| message  | <code>string &#124; undefined</code> |                                                |

#### BluetoothAdapterStateResult

<!-- <a name="BluetoothAdapterStateResult" id="BluetoothAdapterStateResult"></a> -->

|  Property   |   Type    |                      Description                      |
| :---------: | :-------: | :---------------------------------------------------: |
| discovering | `boolean` | Whether the Bluetooth adapter is in a searching state |
|  available  | `boolean` |      Whether the Bluetooth adapter is available       |

#### GetBluetoothAdapterStateResult

| Property |                            Type                             |                  Description                   |
| :------: | :---------------------------------------------------------: | :--------------------------------------------: |
| succeed  |                          `boolean`                          | Whether the API operation is successful or not |
|   code   |            <code>number &#124; undefined</code>             |                                                |
| message  |            <code>string &#124; undefined</code>             |                                                |
|   data   | [BluetoothAdapterStateResult](#BluetoothAdapterStateResult) |                                                |

#### PowerLevel

```ts
enum PowerLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}
```

#### StartBluetoothDevicesDiscoveryOptions

|      Property      |           Type            |       Default       | Required | Description |
| :----------------: | :-----------------------: | :-----------------: | :------: | :---------: |
|      services      |      `Array<string>`      |                     |  false   |             |
| allowDuplicatesKey |         `boolean`         |        false        |  false   |             |
|      interval      |         `number`          |          0          |  false   |             |
|     powerLevel     | [PowerLevel](#PowerLevel) | `PowerLevel.Medium` |  false   |             |

#### GetConnectedBluetoothDevicesResult

| Property |                                            Type                                            |                  Description                   |
| :------: | :----------------------------------------------------------------------------------------: | :--------------------------------------------: |
| succeed  |                                         `boolean`                                          | Whether the API operation is successful or not |
|   code   |                            <code>number &#124; undefined</code>                            |                                                |
| message  |                            <code>string &#124; undefined</code>                            |                                                |
|   data   | Array<[GetConnectedBluetoothDevicesSuccessData](#GetConnectedBluetoothDevicesSuccessData)> |                                                |

#### GetConnectedBluetoothDevicesSuccessData

| Property |   Type   | Description |
| :------: | :------: | :---------: |
|   name   | `string` |             |
| deviceId | `string` |             |

#### GetBluetoothDevicesResult

| Property |                        Type                        |                  Description                   |
| :------: | :------------------------------------------------: | :--------------------------------------------: |
| succeed  |                     `boolean`                      | Whether the API operation is successful or not |
|   code   |        <code>number &#124; undefined</code>        |                                                |
| message  |        <code>string &#124; undefined</code>        |                                                |
|   data   | Array<[BluetoothDeviceInfo](#BluetoothDeviceInfo)> |                                                |

#### BluetoothDeviceInfo

|       Property       |      Type       | Description |
| :------------------: | :-------------: | :---------: |
|         name         |    `string`     |             |
|       deviceId       |    `string`     |             |
|         RSSI         |    `number`     |             |
|     advertisData     |  `ArrayBuffer`  |             |
| advertisServiceUUIDs | `Array<string>` |             |
|      localName       |    `string`     |             |
|     serviceData      |    `Object`     |             |
