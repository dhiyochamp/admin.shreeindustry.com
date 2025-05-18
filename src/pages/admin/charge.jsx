import { useState, useEffect } from 'react';
import { generateUpiQr } from '@/utils/generateUpiQr';

export default function AdminChargePage() {
  const [selectedPlan, setSelectedPlan] = useState('1month');
  const [qr, setQr] = useState('');
  const [amount, setAmount] = useState(5000);
  const [planLabel, setPlanLabel] = useState('1 Month - ₹5,000');

  const upiId = 'mernstackdeveloper@axl'; // Replace with your actual UPI ID
  const name = 'Dhiyochamp'; // Replace with your brand name

  const plans = {
    '1month': { amount: 5000, label: '1 Month - ₹5,000' },
    '6month': { amount: 24000, label: '6 Months - ₹4,000/month (₹24,000)' },
    '12month': { amount: 24000, label: '12 Months - ₹2,000/month (₹24,000)' },
  };

  useEffect(() => {
    const fetchQR = async () => {
      const { amount, label } = plans[selectedPlan];
      setAmount(amount);
      setPlanLabel(label);
      const qrCode = await generateUpiQr({
        upiId,
        name,
        amount,
      });
      setQr(qrCode);
    };
    fetchQR();
  }, [selectedPlan]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">💳 Pay and Access Admin Panel</h1>

      <select
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
        className="mb-4 p-2 border rounded text-lg"
      >
        <option value="1month">1 Month - ₹5,000</option>
        <option value="6month">6 Months - ₹4,000/month (₹24,000)</option>
        <option value="12month">12 Months - ₹2,000/month (₹24,000)</option>
      </select>

      {qr ? (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <img src={qr} alt="UPI QR Code" className="mx-auto mb-4 w-64 h-64" />
          <p className="text-gray-700">Scan & Pay: <strong>₹{amount}</strong></p>
          <p className="text-sm text-gray-500">{planLabel}</p>
        </div>
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
}
