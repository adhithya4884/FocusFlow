// src/utils/notifications.js
import { audioEngine } from './audioEngine';

/**
 * Checks if browser supports notifications
 */
export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission status ('default' | 'granted' | 'denied')
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Requests browser notification permission
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
}

/**
 * Sends a browser notification and plays a distinct audible notification chime
 */
export function sendBrowserNotification(title, options = {}) {
  // Always trigger the notification audio sound
  try {
    audioEngine.playNotificationSound(0.75);
  } catch (e) {
    console.warn('Audio chime failed:', e);
  }

  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const defaultOptions = {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%238b5cf6"><circle cx="12" cy="12" r="10"/></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%238b5cf6"><circle cx="12" cy="12" r="10"/></svg>',
      silent: false,
      ...options
    };

    return new Notification(title, defaultOptions);
  } catch (err) {
    console.warn('Notification could not be dispatched:', err);
    return null;
  }
}
