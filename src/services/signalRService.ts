import * as signalR from '@microsoft/signalr';

// قمنا باستخدام نفس المنفذ (5157) المخصص للباك إند الخاص بك
// قد تحتاج لتعديل مسار "/hub/pos" لاحقاً بناءً على الاسم الذي اعتمده مطور ASP.NET
const HUB_URL = 'http://localhost:5157/hub/pos';

const connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL)
    .withAutomaticReconnect() // يقوم بإعادة الاتصال تلقائياً لو انقطع الإنترنت
    .build();

export const startSignalRConnection = async () => {
    try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();
            console.log('SignalR Connected Successfully!');
        }
    } catch (err) {
        console.error('Error while starting SignalR connection: ', err);
        // في حال الفشل، حاول الاتصال مجدداً بعد 5 ثوانٍ
        setTimeout(startSignalRConnection, 5000); 
    }
};

export default connection;