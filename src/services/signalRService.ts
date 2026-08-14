// import * as signalR from '@microsoft/signalr';

// // قمنا باستخدام نفس المنفذ (5157) المخصص للباك إند الخاص بك
// // قد تحتاج لتعديل مسار "/hub/pos" لاحقاً بناءً على الاسم الذي اعتمده مطور ASP.NET
// const HUB_URL = 'http://localhost:5157/hub/pos';

// const connection = new signalR.HubConnectionBuilder()
//     .withUrl(HUB_URL)
//     .withAutomaticReconnect() // يقوم بإعادة الاتصال تلقائياً لو انقطع الإنترنت
//     .build();

// export const startSignalRConnection = async () => {
//     try {
//         if (connection.state === signalR.HubConnectionState.Disconnected) {
//             await connection.start();
//             console.log('SignalR Connected Successfully!');
//         }
//     } catch (err) {
//         console.error('Error while starting SignalR connection: ', err);
//         // في حال الفشل، حاول الاتصال مجدداً بعد 5 ثوانٍ
//         setTimeout(startSignalRConnection, 5000); 
//     }
// };

// export default connection;





import * as signalR from '@microsoft/signalr';

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
        accessTokenFactory: () => sessionStorage.getItem("token") || ""
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
        setTimeout(startSignalRConnection, 5000);
    }
};

export default connection;