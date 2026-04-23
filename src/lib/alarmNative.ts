import { registerPlugin } from '@capacitor/core';
import { isNative } from './platform';

export interface AlarmPlugin {
  setAlarm(options: { timestamp: number; message: string }): Promise<void>;
  cancelAlarm(): Promise<void>;
  getAlarmStatus(): Promise<{ isAlarmTriggered: boolean }>;
}

const NativeAlarm = registerPlugin<AlarmPlugin>('AlarmPlugin');

export const alarmNativeManager = {
  async setAlarm(timestamp: number, message: string) {
    if (!isNative()) {
      console.log(`[Web] Simulated Native Alarm set for ${new Date(timestamp).toLocaleString()}: ${message}`);
      return;
    }
    try {
      await NativeAlarm.setAlarm({ timestamp, message });
    } catch (error) {
      console.error('Error setting native alarm:', error);
    }
  },

  async cancelAlarm() {
    if (!isNative()) return;
    try {
      await NativeAlarm.cancelAlarm();
    } catch (error) {
      console.error('Error cancelling native alarm:', error);
    }
  },

  async isAlarmTriggered() {
    if (!isNative()) return false;
    try {
      const { isAlarmTriggered } = await NativeAlarm.getAlarmStatus();
      return isAlarmTriggered;
    } catch (error) {
      console.error('Error checking alarm status:', error);
      return false;
    }
  }
};
