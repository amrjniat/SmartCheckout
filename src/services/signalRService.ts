



import * as signalR from '@microsoft/signalr';
import sessionService from './sessionService';

// ============================================
// ✅ تعديل 1: الرابط أصبح يُقرأ من متغيرات البيئة بدل التثبيت المباشر (Hardcoded)
// أضف في ملف .env على جذر المشروع:
//   VITE_HUB_URL=http://localhost:5157/hub/pos
// وفي بيئة الإنتاج غيّرها لرابط السيرفر الحقيقي بدون إعادة بناء الكود يدويًا.
// ============================================




const HUB_URL = import.meta.env.VITE_HUB_URL || 'http://localhost:5157/hub/pos';

// 🔥 التعديل الجذري: إضافة accessTokenFactory لإرسال التوكن لـ SignalR
// 🔥 التعديل الجذري: إضافة accessTokenFactory لإرسال التوكن لـ SignalR
// ✅ تصحيح: الرجوع لـ sessionStorage (بدل localStorage) ليطابق authService.ts و axiosInstance.ts
const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
        accessTokenFactory: () => sessionService.getToken() || ""
    })
    .withAutomaticReconnect()
    .build();
// ============================================
// ✅ تعديل 2: توحيد أسماء الأحداث القادمة من الباك إند
// ============================================
export const REALTIME_EVENTS = {
  INVOICE_CREATED: 'InvoiceCreated',
  INVENTORY_UPDATED: 'InventoryUpdated',
  NEW_SALE: 'ReceiveNewSale',
} as const;

export function onAnyDataChange(handler: () => void): () => void {
  const events = Object.values(REALTIME_EVENTS);
  events.forEach((evt) => connection.on(evt, handler));

  return () => {
    events.forEach((evt) => connection.off(evt, handler));
  };
}

// ============================================
// ✅ تعديل 3: تتبّع حالة الاتصال الفعلية
// ============================================
type ConnectionListener = (state: signalR.HubConnectionState) => void;
const connectionListeners: ConnectionListener[] = [];

function notifyConnectionState() {
  connectionListeners.forEach((listener) => listener(connection.state));
}

export function subscribeToConnectionState(listener: ConnectionListener): () => void {
  connectionListeners.push(listener);
  listener(connection.state); 
  return () => {
    const idx = connectionListeners.indexOf(listener);
    if (idx > -1) connectionListeners.splice(idx, 1);
  };
}

connection.onreconnecting(() => notifyConnectionState());
connection.onreconnected(() => notifyConnectionState());
connection.onclose(() => notifyConnectionState());

// ============================================
// ✅ تعديل 4: تتبّع مؤقت إعادة المحاولة حتى نقدر نلغيه عند تسجيل الخروج
// بدون هذا، لو المستخدم خرج قبل انتهاء الـ 5 ثوانٍ، سيحاول SignalR
// إعادة الاتصال بجلسة منتهية بعد الخروج
// ============================================
let reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const startSignalRConnection = async () => {
    try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();
            console.log('SignalR Connected Successfully!');
            notifyConnectionState();
        }
    } catch (err) {
        console.error('Error while starting SignalR connection: ', err);
        notifyConnectionState();
        reconnectTimeoutId = setTimeout(startSignalRConnection, 5000);
    }
};

// ============================================
// ✅ تعديل 5: دالة إيقاف الاتصال — تُستدعى عند تسجيل الخروج
// تلغي أي مؤقت إعادة محاولة معلّق، ثم توقف الاتصال الفعلي إن كان قائماً
// ============================================
export const stopSignalRConnection = async (): Promise<void> => {
    if (reconnectTimeoutId !== null) {
        clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = null;
    }

    if (connection.state !== signalR.HubConnectionState.Disconnected) {
        try {
            await connection.stop();
            console.log('SignalR Disconnected Successfully!');
        } catch (err) {
            console.error('Error while stopping SignalR connection: ', err);
        }
        notifyConnectionState();
    }
};

export default connection;