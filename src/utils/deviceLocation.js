import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

const positionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
};

export async function getDeviceLocation() {
  if (Capacitor.isNativePlatform()) {
    let permission = await Geolocation.checkPermissions();

    if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') {
      permission = await Geolocation.requestPermissions({ permissions: ['location'] });
    }

    if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') {
      throw new Error('El permiso de ubicación está desactivado. Habilítalo en los ajustes de Android para Rentia.');
    }

    return Geolocation.getCurrentPosition(positionOptions);
  }

  if (!navigator.geolocation) {
    throw new Error('Este dispositivo o navegador no permite obtener la ubicación.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, positionOptions);
  });
}

export function getDeviceLocationError(error, fallback) {
  if (error?.message?.includes('El permiso de ubicación está desactivado')) {
    return error.message;
  }

  if (error?.code === 1 || /permission|denied/i.test(error?.message || '')) {
    return 'No se autorizó la ubicación. Permítela en los ajustes del dispositivo para usar esta función.';
  }

  if (error?.code === 3) {
    return 'La ubicación tardó demasiado. Comprueba que el GPS esté activo e inténtalo de nuevo.';
  }

  return fallback;
}
