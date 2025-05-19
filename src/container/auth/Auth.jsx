"use client";

import { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck, FaCopy, FaArrowLeft, FaCrown, FaRupeeSign } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signInWithEmail } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { generateUpiQr } from '@/utils/generateUpiQr';

// Custom CSS for enhanced UI across all devices
import './admin-panel.css';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Create the Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('6month');
  const [qr, setQr] = useState('');
  const [amount, setAmount] = useState(18000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomPayment, setIsCustomPayment] = useState(false);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [amountError, setAmountError] = useState('');
  
  // UPI payment details
  const upiId = 'techvisiona@axl'; 
  const name = 'sharptech';
  const MIN_AMOUNT = 3000; // Minimum payment amount
  
  // Payment apps configuration with text-only display
  const paymentApps = [
    { name: 'PhonePe', color: '#5f259f' },
    { name: 'Google Pay', color: '#2da94f' },
    { name: 'Paytm', color: '#00baf2' },
    { name: 'BHIM', color: '#00a5ff' },
    { name: 'Amazon Pay', color: '#ff9900' },
  ];
  
  // Subscription plans
  const plans = {
    '1month': { 
      amount: 5000, 
      label: '1 Month - ₹5,000', 
      durationDays: 30, 
      popular: false,
      features: ['Full admin access', 'Technical support', 'Regular updates']
    },
    '6month': { 
      amount: 18000, 
      label: '6 Months - ₹3,000/month (₹18,000)', 
      durationDays: 180, 
      popular: true,
      features: ['Full admin access', 'Priority support', 'Regular updates', '20% savings vs monthly']  
    },
    '12month': { 
      amount: 24000, 
      label: '12 Months - ₹2,000/month (₹24,000)', 
      durationDays: 365, 
      popular: false,
      features: ['Full admin access', 'Priority support', 'Regular updates', 'Free consulting session', '60% savings vs monthly']
    },
    'custom': {
      label: 'Custom Payment',
      popular: false,
      features: ['Pay minimum ₹3,000', 'Set your own amount', 'Full admin access']
    }
  };

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [errors, setErrors] = useState({});

  // Generate QR code
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        let paymentAmount = isCustomPayment ? parseInt(customAmount) : plans[selectedPlan].amount;
        
        if (isNaN(paymentAmount) || paymentAmount < MIN_AMOUNT) {
          return; // Don't generate QR if amount is invalid
        }

        const qrCode = await generateUpiQr({
          upiId,
          name,
          amount: paymentAmount,
        });
        setQr(qrCode);
        setAmount(paymentAmount);
      } catch (error) {
        console.error("QR generation failed:", error);
        setErrors({ general: "Failed to generate payment QR code" });
      }
    };

    if (showPaymentScreen && !paymentCompleted) {
      generateQrCode();
    }
  }, [selectedPlan, customAmount, isCustomPayment, showPaymentScreen, paymentCompleted]);

  // Update payment mode and amount when plan changes
  useEffect(() => {
    if (selectedPlan === 'custom') {
      setIsCustomPayment(true);
      setCustomAmount(MIN_AMOUNT.toString());
    } else {
      setIsCustomPayment(false);
      if (plans[selectedPlan]) {
        setAmount(plans[selectedPlan].amount);
      }
    }
  }, [selectedPlan]);

  // Handle custom amount changes
  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setCustomAmount(value);
    
    // Validate minimum amount
    if (value && parseInt(value) < MIN_AMOUNT) {
      setAmountError(`Minimum payment amount is ₹${MIN_AMOUNT}`);
    } else {
      setAmountError('');
    }
  };

  // Login form handlers
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateLoginForm = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) newErrors.email = "Invalid email format";
    if (!loginData.password) newErrors.password = "Password is required";
    else if (loginData.password.length < 6) newErrors.password = "Minimum 6 characters required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      
      if (error) throw error;
      await dispatch(signInWithEmail(loginData)).unwrap();
      router.push("/home");
      
    } catch (error) {
      setErrors({ general: error.message || "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  // Payment handlers
  const handlePaymentVerification = async () => {
    // Don't allow verification if custom amount is invalid
    if (isCustomPayment && (parseInt(customAmount) < MIN_AMOUNT || !customAmount)) {
      setAmountError(`Minimum payment amount is ₹${MIN_AMOUNT}`);
      return;
    }
    
    try {
      setPaymentVerifying(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPaymentCompleted(true);
      setShowPaymentSuccess(true);
    } catch (error) {
      setErrors({ general: "Payment verification failed. Please try again." });
    } finally {
      setPaymentVerifying(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  // Responsive plan cards
  const renderPlanCards = () => (
    Object.entries(plans).map(([key, plan]) => (
      <div 
        key={key}
        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all
          ${selectedPlan === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
          ${key === 'custom' ? 'col-span-1 md:col-span-3' : ''}`}
        onClick={() => setSelectedPlan(key)}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-base md:text-lg">
            {plan.label.split(' - ')[0]}
          </h3>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${selectedPlan === key ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
            {selectedPlan === key && <FaCheck className="text-white text-xs" />}
          </div>
        </div>
        {key !== 'custom' && (
          <div className="text-lg font-bold text-blue-600 mb-1">
            ₹{plan.amount.toLocaleString()}
          </div>
        )}
        <ul className="mt-3 space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="text-sm flex items-center text-gray-600">
              <FaCheck className="text-green-500 mr-2 text-xs" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    ))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Shree Industry Admin Dashboard</h1>
          <p className="text-gray-600">Access your administration tools</p>
        </div>
        
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
          {showPaymentScreen ? (
            showPaymentSuccess ? (
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="text-green-500 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Thank you for your payment. Your access has been activated.</p>
                <button
                  onClick={() => {
                    setShowPaymentSuccess(false);
                    setShowPaymentScreen(false);
                  }}
                  className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition duration-300"
                >
                  Continue to Login
                </button>
              </div>
            ) : (
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 flex items-center">
                      <FaCrown className="text-yellow-500 mr-3" />
                      Choose Your Plan
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowPaymentScreen(false)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    <FaArrowLeft className="mr-2" /> Existing User? Login
                  </button>
                </div>
                
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    {errors.general}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {renderPlanCards()}
                </div>
                
                {isCustomPayment && (
                  <div className="bg-blue-50 p-4 rounded-xl mb-4">
                    <h3 className="text-gray-800 font-medium mb-3">Enter Custom Amount</h3>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaRupeeSign className="text-gray-500" />
                      </div>
                      <input 
                        type="text"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder={`Minimum ₹${MIN_AMOUNT}`}
                        className="pl-8 py-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {amountError && <p className="text-red-500 text-sm mt-1">{amountError}</p>}
                    <p className="text-gray-600 text-sm mt-2">
                      Note: QR code will be generated for amounts ₹{MIN_AMOUNT} and above
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 md:p-6 rounded-xl mb-6 overflow-auto">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {qr && (!isCustomPayment || (isCustomPayment && customAmount && parseInt(customAmount) >= MIN_AMOUNT)) ? (
                      <>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="p-2 bg-white rounded-xl mb-4 w-fit">
                            <img 
                              src={qr} 
                              alt="UPI QR Code" 
                              className="w-48 h-48 md:w-56 md:h-56 object-contain"
                            />
                          </div>
                          <p className="text-blue-700 font-medium">Scan with any UPI app</p>
                        </div>
                        <div className="flex-1">
                          <div className="bg-white p-4 rounded-xl mb-4">
                            <p className="text-gray-800 font-medium mb-2">
                              Amount: ₹{amount.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-700">UPI ID:</p>
                              <div className="flex-1 bg-gray-50 px-3 py-2 rounded truncate">
                                <code>{upiId}</code>
                              </div>
                              <button 
                                onClick={copyUpiId} 
                                className="text-blue-600 hover:text-blue-700 p-2"
                                aria-label="Copy UPI ID"
                              >
                                {copiedUpi ? <FaCheck /> : <FaCopy />}
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {paymentApps.map((app, index) => (
                              <div 
                                key={index} 
                                className="p-3 bg-white rounded-lg border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition-all cursor-pointer"
                                style={{ borderLeft: `4px solid ${app.color}` }}
                              >
                                <span className="font-medium text-sm text-gray-800">{app.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full text-center py-6">
                        {isCustomPayment ? (
                          <p className="text-gray-600">Enter a valid amount (minimum ₹{MIN_AMOUNT}) to see the QR code</p>
                        ) : (
                          <p className="text-gray-600">Select a plan to continue</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handlePaymentVerification}
                    disabled={paymentVerifying || (isCustomPayment && (!customAmount || parseInt(customAmount) < MIN_AMOUNT))}
                    className={`w-full py-3 rounded-xl mt-6 text-white font-medium
                      ${paymentVerifying || (isCustomPayment && (!customAmount || parseInt(customAmount) < MIN_AMOUNT)) 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {paymentVerifying ? 'Verifying...' : "I've Completed Payment"}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="p-6">
              <button 
                onClick={() => setShowPaymentScreen(true)}
                className="text-blue-600 hover:text-blue-700 mb-6 flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Back to Plans
              </button>
            
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Admin Login
                </h2>
              </div>

              <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto">
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg"
                        placeholder="Email"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full pl-10 pr-10 py-3 border rounded-lg"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-xl text-white font-medium 
                      ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isLoading ? 'Logging in...' : "Login"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
