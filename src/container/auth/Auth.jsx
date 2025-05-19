"use client";

import { useState, useEffect } from "react";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaCopy, 
  FaArrowLeft, 
  FaCrown, 
  FaRupeeSign,
  FaReceipt,
  FaUserAlt
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signInWithEmail } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { generateUpiQr } from '@/utils/generateUpiQr';
import { v4 as uuidv4 } from 'uuid';

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
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Plan Selection, 2: Payment, 3: Verification, 4: Credentials
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('6month');
  const [qr, setQr] = useState('');
  const [amount, setAmount] = useState(18000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomPayment, setIsCustomPayment] = useState(false);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedCustomerId, setCopiedCustomerId] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNameError, setCustomerNameError] = useState('');
  const [customerEmailError, setCustomerEmailError] = useState('');
  const [customerPhoneError, setCustomerPhoneError] = useState('');
  const [credentialsGenerated, setCredentialsGenerated] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState({
    email: '',
    password: '',
    expiryDate: ''
  });
  
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

  // Generate customer ID when component mounts
  useEffect(() => {
    // Generate a customer ID using first 8 characters of UUID
    const newCustomerId = uuidv4().substring(0, 8).toUpperCase();
    setCustomerId(newCustomerId);
  }, []);

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
          // Add customer ID to QR payment description
          desc: `CID:${customerId}`
        });
        setQr(qrCode);
        setAmount(paymentAmount);
      } catch (error) {
        console.error("QR generation failed:", error);
        setErrors(prev => ({ ...prev, general: "Failed to generate payment QR code" }));
      }
    };

    if (currentStep === 2 && !paymentCompleted) {
      generateQrCode();
    }
  }, [selectedPlan, customAmount, isCustomPayment, currentStep, paymentCompleted, customerId]);

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

  // User details validation
  const validateUserDetails = () => {
    let isValid = true;
    
    if (!customerName.trim()) {
      setCustomerNameError("Name is required");
      isValid = false;
    } else {
      setCustomerNameError("");
    }
    
    if (!customerEmail.trim()) {
      setCustomerEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      setCustomerEmailError("Invalid email format");
      isValid = false;
    } else {
      setCustomerEmailError("");
    }
    
    if (!customerPhone.trim()) {
      setCustomerPhoneError("Phone number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(customerPhone.replace(/[^0-9]/g, ''))) {
      setCustomerPhoneError("Enter a valid 10-digit phone number");
      isValid = false;
    } else {
      setCustomerPhoneError("");
    }
    
    return isValid;
  };

  // Handle proceeding to payment after plan selection
  const handleProceedToPayment = () => {
    if (validateUserDetails()) {
      setCurrentStep(2);
    }
  };

  // Payment verification handlers
  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
    setTransactionError('');
  };

  const handlePaymentVerification = async () => {
    // Validate transaction ID
    if (!transactionId.trim()) {
      setTransactionError("Please enter the transaction ID from your payment");
      return;
    }
    
    try {
      setPaymentVerifying(true);
      
      // Here you would typically send the payment data to your backend
      // For this demo, we'll simulate a backend verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response data - in production this would come from your backend
      const paymentData = {
        id: uuidv4(),
        customerId: customerId,
        amount: isCustomPayment ? parseInt(customAmount) : plans[selectedPlan].amount,
        transactionId: transactionId,
        status: "pending",
        planType: selectedPlan,
        createdAt: new Date().toISOString()
      };
      
      // Save payment data to Supabase (this is a mock implementation)
      // In production, this should be handled by your secure backend
      /*
      const { error } = await supabase
        .from('payments')
        .insert([{
          amount: paymentData.amount,
          paymentStatus: 'pending',
          orderId: paymentData.id,
          customer: paymentData.customerId,
          transaction_id: paymentData.transactionId
        }]);
        
      if (error) throw error;
      */
      
      setPaymentCompleted(true);
      setCurrentStep(3);
    } catch (error) {
      setTransactionError("Payment verification failed. Please try again or contact support.");
    } finally {
      setPaymentVerifying(false);
    }
  };

  // Generate login credentials (to be replaced with actual backend logic)
  const generateCredentials = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, this would be handled securely by your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate expiry date based on selected plan
      const now = new Date();
      const expiryDate = new Date(now);
      
      if (selectedPlan === '1month') {
        expiryDate.setDate(expiryDate.getDate() + 30);
      } else if (selectedPlan === '6month') {
        expiryDate.setDate(expiryDate.getDate() + 180);
      } else if (selectedPlan === '12month') {
        expiryDate.setDate(expiryDate.getDate() + 365);
      } else {
        // For custom plans, default to 30 days
        expiryDate.setDate(expiryDate.getDate() + 30);
      }
      
      // Generate mock credentials
      // In production, this would be done securely on your backend
      const credentials = {
        email: customerEmail, // Use customer email as login
        password: `SP${customerId}${Math.floor(Math.random() * 1000)}`, // Generate secure password
        expiryDate: expiryDate.toLocaleDateString()
      };
      
      setGeneratedCredentials(credentials);
      setCredentialsGenerated(true);
      setCurrentStep(4);
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: "Failed to generate credentials. Please contact support." 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  const copyCustomerId = () => {
    navigator.clipboard.writeText(customerId);
    setCopiedCustomerId(true);
    setTimeout(() => setCopiedCustomerId(false), 3000);
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

  // Render steps based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: // Plan Selection & Customer Information
        return (
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <FaCrown className="text-yellow-500 mr-3" />
                  Choose Your Plan
                </h2>
              </div>
              <button 
                onClick={() => setCurrentStep(5)} // Go to login screen
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
            
            {/* Customer Information Form */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h3 className="text-gray-800 font-medium mb-4">Your Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <FaUserAlt className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setCustomerNameError('');
                      }}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {customerNameError && <p className="text-red-500 text-sm mt-1">{customerNameError}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setCustomerEmailError('');
                      }}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      placeholder="Enter your email"
                    />
                  </div>
                  {customerEmailError && <p className="text-red-500 text-sm mt-1">{customerEmailError}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">+91</span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setCustomerPhone(value);
                        setCustomerPhoneError('');
                      }}
                      className="w-full pl-12 pr-4 py-3 border rounded-lg"
                      placeholder="10-digit phone number"
                      maxLength={10}
                    />
                  </div>
                  {customerPhoneError && <p className="text-red-500 text-sm mt-1">{customerPhoneError}</p>}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Your Customer ID: 
                  <span className="font-mono bg-gray-100 px-2 py-1 ml-2 rounded">{customerId}</span>
                  <button 
                    onClick={copyCustomerId} 
                    className="text-blue-600 hover:text-blue-700 p-1 ml-1"
                    aria-label="Copy Customer ID"
                  >
                    {copiedCustomerId ? <FaCheck size={12} /> : <FaCopy size={12} />}
                  </button>
                </p>
                <p className="text-xs text-gray-500">
                  Please save this ID for reference. You'll need this if you contact support.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleProceedToPayment}
              disabled={isCustomPayment && (!customAmount || parseInt(customAmount) < MIN_AMOUNT)}
              className={`w-full py-3 rounded-xl mt-2 text-white font-medium
                ${(isCustomPayment && (!customAmount || parseInt(customAmount) < MIN_AMOUNT)) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Proceed to Payment
            </button>
          </div>
        );
        
      case 2: // Payment Screen
        return (
          <div className="p-4 md:p-6">
            <button 
              onClick={() => setCurrentStep(1)}
              className="text-blue-600 hover:text-blue-700 mb-6 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to Plan Selection
            </button>
            
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Complete Payment
              </h2>
              <p className="text-gray-600">
                Scan the QR code or copy the UPI ID to make payment
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 md:p-6 rounded-xl mb-6 overflow-auto">
              <div className="flex flex-col lg:flex-row gap-6">
                {qr ? (
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
                        <div className="flex items-center gap-2 mb-3">
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
                        
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <p className="text-gray-700 font-medium mb-1">Important:</p>
                          <p className="text-gray-600 text-sm mb-2">
                            Please include your Customer ID in the payment remarks:
                          </p>
                          <div className="bg-yellow-50 border border-yellow-200 px-3 py-2 rounded text-center mb-2">
                            <code className="font-bold">CID:{customerId}</code>
                          </div>
                          <p className="text-xs text-gray-500">
                            This helps us track your payment and activate your account faster
                          </p>
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
                    <p className="text-gray-600">Generating payment QR code...</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-xl">
                <h3 className="text-gray-800 font-medium mb-3">Payment Verification</h3>
                <p className="text-gray-600 text-sm mb-4">
                  After completing payment, enter your transaction ID below:
                </p>
                
                <div>
                  <label className="block text-gray-700 mb-2">Transaction ID / Reference Number</label>
                  <div className="relative">
                    <FaReceipt className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={transactionId}
                      onChange={handleTransactionIdChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      placeholder="Enter transaction ID from your payment app"
                    />
                  </div>
                  {transactionError && <p className="text-red-500 text-sm mt-1">{transactionError}</p>}
                </div>
                
                <button
                  onClick={handlePaymentVerification}
                  disabled={paymentVerifying || !transactionId.trim()}
                  className={`w-full py-3 rounded-xl mt-4 text-white font-medium
                    ${paymentVerifying || !transactionId.trim() 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {paymentVerifying ? 'Verifying...' : "Verify Payment"}
                </button>
              </div>
            </div>
          </div>
        );
        
      case 3: // Payment Confirmation
        return (
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-blue-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Received!</h2>
            <p className="text-gray-600 mb-6">
              Your payment is currently being verified by our team.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-xl max-w-md mx-auto mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Details</h3>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer ID:</span>
                  <span className="font-medium">{customerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                    Pending Verification
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{selectedPlan === 'custom' ? 'Custom Plan' : plans[selectedPlan].label.split(' - ')[0]}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Once your payment is verified, your admin access credentials will be generated.
            </p>
            
            <button
              onClick={generateCredentials}
              disabled={isLoading}
              className={`w-full max-w-md mx-auto py-3 rounded-xl text-white font-medium
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? 'Processing...' : "Generate Admin Credentials"}
            </button>
          </div>
        );
        
      case 4: // Login Credentials
        return (
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-green-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Admin Access is Ready!</h2>
            <p className="text-gray-600 mb-6">
              Below are your login credentials. Please save them securely.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-xl max-w-md mx-auto mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Admin Credentials</h3>
              
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Email Address</label>
                  <div className="bg-white border border-gray-200 px-3 py-2 rounded font-medium">
                    {generatedCredentials.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={generatedCredentials.password}
                      readOnly
                      className="w-full pr-10 px-3 py-2 bg-white border border-gray-200 rounded font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Valid Until</label>
                  <div className="bg-white border border-gray-200 px-3 py-2 rounded font-medium">
                    {generatedCredentials.expiryDate}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  Important: Please save these credentials in a secure location. This is the only time they will be displayed.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep(5)}
              className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition duration-300"
            >
              Continue to Login
            </button>
          </div>
        );
      
      case 5: // Login Screen
      default:
        return (
          <div className="p-6">
            <button 
              onClick={() => setCurrentStep(1)}
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
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Shree Industry Admin Dashboard</h1>
          <p className="text-gray-600">Access your administration tools</p>
        </div>
        
        {/* Progress Indicator for the process flow */}
        {currentStep < 5 && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="flex justify-between items-center">
              {[
                "Select Plan", 
                "Payment", 
                "Verification", 
                "Credentials"
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="flex flex-1 items-center"
                >
                  <div className={`
                    relative z-10 w-8 h-8 flex items-center justify-center rounded-full 
                    text-xs font-medium border-2
                    ${index + 1 < currentStep 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : index + 1 === currentStep 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-500'}
                  `}>
                    {index + 1 < currentStep ? <FaCheck size={12} /> : index + 1}
                  </div>
                  <div className="hidden sm:block absolute w-full text-center mt-10">
                    <span className={`text-xs font-medium ${index + 1 === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
