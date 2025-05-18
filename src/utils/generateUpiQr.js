// utils/generateUpiQr.js
export async function generateUpiQr({ upiId, name, amount }) {
  const upiURL = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
  
  // Use a QR code API service like QR Server
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiURL)}`;
  
  return qrImageUrl;
}
