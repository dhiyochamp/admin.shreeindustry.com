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
  FaUserAlt,
  FaPhone,
  FaShieldAlt,
  FaCreditCard,
  FaCheckCircle
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signInWithEmail } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { generateUpiQr } from '@/utils/generateUpiQr';
import { v4 as uuidv4 } from 'uuid';
import './admin-panel.css';

export default function AdminPanel() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  // Main state
  const [currentStep, setCurrentStep] = useState(1); // 1: Plan Selection, 2: Payment, 3: Credentials, 4: Login
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('6month');
  const [errors, setErrors] = useState({});
  
  // Payment state
  const [qr, setQr] = useState('');
  const [amount, setAmount] = useState(18000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomPayment, setIsCustomPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedCustomerId, setCopiedCustomerId] = useState(false);
  
  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNameError, setCustomerNameError] = useState('');
  const [customerEmailError, setCustomerEmailError] = useState('');
  const [customerPhoneError, setCustomerPhoneError] = useState('');
  
  // Credentials
  const [credentialsGenerated, setCredentialsGenerated] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState({
    email: '',
    password: '',
    expiryDate: ''
  });
  
  // UPI details
  const upiId = 'techvisiona@axl'; 
  const name = 'Shree Industry';
  const MIN_AMOUNT = 3000; // Minimum payment amount
  
  // Payment apps
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
      label: '1 Month', 
      price: '₹5,000',
      durationDays: 30, 
      popular: false,
      features: ['Full admin access', 'Technical support', 'Regular updates']
    },
    '6month': { 
      amount: 18000, 
      label: '6 Months', 
      price: '₹3,000/month (₹18,000 total)',
      durationDays: 180, 
      popular: true,
      features: ['Full admin access', 'Priority support', 'Regular updates', '20% savings vs monthly']  
    },
    '12month': { 
      amount: 24000, 
      label: '12 Months', 
      price: '₹2,000/month (₹24,000 total)',
      durationDays: 365, 
      popular: false,
      features: ['Full admin access', 'Priority support', 'Regular updates', 'Free consulting session', '60% savings vs monthly']
    },
    'custom': {
      label: 'Custom Payment',
      price: 'Set your own amount',
      popular: false,
      features: ['Pay minimum ₹3,000', 'Full admin access', 'Support via email']
    }
  };

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false
  });

  // Generate customer ID on mount
  useEffect(() => {
    const newCustomerId = uuidv4().substring(0, 8).toUpperCase();
    setCustomerId(newCustomerId);
  }, []);

  // Generate QR code
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        let paymentAmount = isCustomPayment ? parseInt(customAmount) : plans[selectedPlan].amount;
        
        if (isNaN(paymentAmount) || paymentAmount < MIN_AMOUNT) {
          return;
        }

        const qrCode = await generateUpiQr({
          upiId,
          name,
          amount: paymentAmount,
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

  // Update payment mode when plan changes
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
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    
    if (value && parseInt(value) < MIN_AMOUNT) {
      setAmountError(`Minimum payment amount is ₹${MIN_AMOUNT.toLocaleString()}`);
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

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (validateUserDetails()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Save payment record to database
  const savePaymentRecord = async () => {
    try {
      setIsLoading(true);
      
      // Get payment amount
      const paymentAmount = isCustomPayment ? parseInt(customAmount) : plans[selectedPlan].amount;
      
      // Save payment data to Supabase
      const { data, error } = await supabase
        .from('payment')
        .insert([{
          amount: paymentAmount,
          payment_status: 'completed',
          order_id: uuidv4(),
          customer_id: customerId,
          transaction_id: transactionId || 'manual-' + Date.now(),
          plan_type: selectedPlan,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          created_at: new Date().toISOString(),
          verified: false // Mark as manually entered (not verified)
        }])
        .select();
        
      if (error) throw error;
      
      setPaymentCompleted(true);
      setCurrentStep(3);
      window.scrollTo(0, 0);
      
      return data;
    } catch (error) {
      console.error("Payment recording error:", error);
      setErrors({ general: "Failed to record payment. Please try again or contact support." });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate login credentials 
  const generateCredentials = async () => {
    try {
      setIsLoading(true);
      
      // First save the payment record
      await savePaymentRecord();
      
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
      
      // Generate credentials
      const credentials = {
        email: customerEmail,
        password: `SI${customerId}${Math.floor(Math.random() * 1000)}`,
        expiryDate: expiryDate.toLocaleDateString()
      };
      
      setGeneratedCredentials(credentials);
      setCredentialsGenerated(true);
      setCurrentStep(4);
      window.scrollTo(0, 0);
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

  // Copy generated password
  const copyPassword = () => {
    navigator.clipboard.writeText(generatedCredentials.password);
    // Show a temporary toast or notification for copied password
  };

  // Common card component
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );

  // Error alert component
  const ErrorAlert = ({ message }) => {
    if (!message) return null;
    return (
      <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start">
        <span className="mr-2 mt-0.5">⚠️</span>
        <span>{message}</span>
      </div>
    );
  };

  // Success alert component
  const SuccessAlert = ({ message }) => {
    if (!message) return null;
    return (
      <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-start">
        <span className="mr-2 mt-0.5">✅</span>
        <span>{message}</span>
      </div>
    );
  };

  // Input field component
  const InputField = ({ 
    label, 
    type = "text", 
    name, 
    value, 
    onChange, 
    error, 
    placeholder,
    icon, 
    maxLength,
    readOnly = false,
    rightElement = null
  }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} 
            rounded-lg focus:ring-blue-500 focus:border-blue-500 ${readOnly ? 'bg-gray-50' : ''}`}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  // Button component
  const Button = ({ 
    onClick, 
    disabled = false, 
    isLoading = false, 
    variant = "primary", // primary, secondary, success
    fullWidth = false,
    className = "",
    children 
  }) => {
    const baseClasses = "py-3 px-6 rounded-xl font-medium transition-all duration-200 ease-in-out";
    const widthClass = fullWidth ? "w-full" : "";
    
    const variantClasses = {
      primary: `bg-blue-600 hover:bg-blue-700 text-white ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`,
      secondary: `bg-gray-200 hover:bg-gray-300 text-gray-700 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`,
      success: `bg-green-600 hover:bg-green-700 text-white ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`
    };
    
    return (
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${widthClass} ${variantClasses[variant]} ${className}`}
      >
        <div className="flex items-center justify-center space-x-2">
          {isLoading && (
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{children}</span>
        </div>
      </button>
    );
  };

  // Progress steps component
  const ProgressSteps = () => {
    const steps = [
      { label: "Select Plan", icon: <FaCrown /> },
      { label: "Payment", icon: <FaCreditCard /> },  
      { label: "Credentials", icon: <FaLock /> }
    ];
    
    return (
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-1 items-center">
              <div className="relative flex flex-col items-center flex-1">
                <div className={`
                  z-10 w-10 h-10 flex items-center justify-center rounded-full 
                  text-xs font-medium border-2 transition-all
                  ${index + 1 < currentStep 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : index + 1 === currentStep 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'}
                `}>
                  {index + 1 < currentStep ? <FaCheck /> : step.icon}
                </div>
                <div className="mt-2 hidden sm:block">
                  <span className={`text-xs font-medium ${index + 1 === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-1 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render steps based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: // Plan Selection & Customer Information
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <FaCrown className="text-yellow-500 mr-3" />
                  Choose Your Plan
                </h2>
                <p className="text-gray-600">Select the subscription plan that works best for you</p>
              </div>
              <button 
                onClick={() => {
                  setCurrentStep(4);
                  window.scrollTo(0, 0);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <FaArrowLeft className="mr-2" /> Existing User? Login
              </button>
            </div>
            
            <ErrorAlert message={errors.general} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Object.entries(plans).map(([key, plan]) => (
                <div 
                  key={key}
                  className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md
                    ${selectedPlan === key ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-300'}
                    ${key === 'custom' ? 'col-span-1 md:col-span-3 lg:col-span-1' : ''}`}
                  onClick={() => setSelectedPlan(key)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      BEST VALUE
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {plan.label}
                    </h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${selectedPlan === key ? 'border-blue-500 bg-blue-500 scale-110' : 'border-gray-300'}`}>
                      {selectedPlan === key && <FaCheck className="text-white text-xs" />}
                    </div>
                  </div>
                  
                  <div className="text-lg font-bold text-blue-600 mb-3">
                    {plan.price}
                  </div>
                  
                  <ul className="mt-3 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center text-gray-600">
                        <div className="bg-blue-100 p-1 rounded-full mr-2">
                          <FaCheck className="text-blue-600 text-xs" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {isCustomPayment && (
              <Card className="bg-blue-50 mb-6">
                <h3 className="text-gray-800 font-medium mb-3">Enter Custom Amount</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaRupeeSign className="text-gray-500" />
                  </div>
                  <input 
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder={`Minimum ₹${MIN_AMOUNT.toLocaleString()}`}
                    className="pl-8 py-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {amountError && <p className="text-red-500 text-sm mt-1">{amountError}</p>}
                <p className="text-gray-600 text-sm mt-2">
                  Note: Payment processing requires a minimum amount of ₹{MIN_AMOUNT.toLocaleString()}
                </p>
              </Card>
            )}
            
            {/* Customer Information Form */}
            <Card className="bg-gradient-to-br from-blue-50 to-white mb-6">
              <h3 className="text-gray-800 font-medium mb-4">Your Information</h3>
              
              <div className="space-y-4">
                <InputField
                  label="Full Name"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setCustomerNameError('');
                  }}
                  error={customerNameError}
                  placeholder="Enter your full name"
                  icon={<FaUserAlt className="text-gray-400" />}
                />
                
                <InputField
                  label="Email Address"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    setCustomerEmailError('');
                  }}
                  error={customerEmailError}
                  placeholder="Enter your email"
                  icon={<FaEnvelope className="text-gray-400" />}
                />
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative flex">
                    <div className="flex items-center justify-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg">
                      <span className="text-gray-500 font-medium">+91</span>
                    </div>
                    <div className="relative flex-1">
                      <FaPhone className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setCustomerPhone(value);
                          setCustomerPhoneError('');
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {customerPhoneError && <p className="text-red-500 text-sm mt-1">{customerPhoneError}</p>}
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg border border-blue-100 bg-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Your Customer ID:
                    </p>
                    <p className="font-mono bg-white px-3 py-1 rounded border border-blue-100">
                      {customerId}
                    </p>
                  </div>
                  <button 
                    onClick={copyCustomerId} 
                    className="bg-white text-blue-600 hover:text-blue-700 p-2 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                    aria-label="Copy Customer ID"
                  >
                    {copiedCustomerId ? <FaCheck size={16} /> : <FaCopy size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Please save this ID for future reference and support inquiries.
                </p>
              </div>
            </Card>
            
            <Button
              onClick={handleProceedToPayment}
              disabled={isCustomPayment && (!customAmount || parseInt(customAmount) < MIN_AMOUNT)}
              fullWidth
            >
              Proceed to Payment
            </Button>
          </div>
        );
        
      case 2: // Payment Screen
        return (
          <div className="space-y-6">
            <button 
              onClick={() => {
                setCurrentStep(1);
                window.scrollTo(0, 0);
              }}
              className="text-blue-600 hover:text-blue-700 mb-6 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to Plan Selection
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <FaRupeeSign className="text-green-500 mr-3" />
              Complete Payment
            </h2>
            
            <ErrorAlert message={errors.general} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Payment QR Code Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-white">
                <div className="text-center">
                  <h3 className="text-gray-800 font-medium mb-3">Scan QR Code to Pay</h3>
                  
                  <div className="font-bold text-2xl text-blue-700 mb-4">
                    ₹{amount.toLocaleString()}
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl border border-gray-200 inline-block mb-4">
                    {qr ? (
                      <img 
                        src={qr} 
                        alt="UPI Payment QR Code" 
                        className="w-48 h-48 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-gray-700 font-medium">UPI ID: {upiId}</div>
                    <button 
                      onClick={copyUpiId} 
                      className="ml-2 text-blue-600 hover:text-blue-700"
                      aria-label="Copy UPI ID"
                    >
                      {copiedUpi ? <FaCheck size={14} /> : <FaCopy size={14} />}
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">Payment will be processed in the name of</div>
                  <div className="font-semibold mb-4">{name}</div>
                  
                  <div className="text-sm text-gray-600 mb-4">Use any UPI app</div>
                  
                  <div className="flex justify-center flex-wrap gap-3">
                    {paymentApps.map((app) => (
                      <div 
                        key={app.name}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 px-3 py-2 text-sm"
                        style={{ color: app.color }}
                      >
                        {app.name}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              {/* Payment Recording Card */}
              <Card>
                <h3 className="text-gray-800 font-medium mb-4">Record Your Payment</h3>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        After making the payment, click below to record your payment and generate credentials.
                      </p>
                    </div>
                  </div>
                </div>
                
                <InputField
                  label="Transaction ID (Optional)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID if available"
                  icon={<FaReceipt className="text-gray-400" />}
                />
                
                <InputField
                  label="Customer ID"
                  value={customerId}
                  readOnly={true}
                  placeholder="Your customer ID"
                  icon={<FaUserAlt className="text-gray-400" />}
                  rightElement={
                    <button onClick={copyCustomerId} className="text-blue-600 hover:text-blue-700">
                      {copiedCustomerId ? <FaCheck size={14} /> : <FaCopy size={14} />}
                    </button>
                  }
                />
                
                <div className="text-sm text-gray-500 mb-6">
                  <span className="font-medium">Selected Plan:</span> {plans[selectedPlan].label} - 
                  <span className="font-medium text-blue-600"> ₹{amount.toLocaleString()}</span>
                </div>
                
                <Button 
                  onClick={generateCredentials}
                  isLoading={isLoading}
                  fullWidth
                  variant="success"
                >
                  Record Payment & Generate Credentials
                </Button>
              </Card>
            </div>
          </div>
        );
        
      case 4: // Generated Credentials
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <FaLock className="text-purple-500 mr-3" />
              Your Login Credentials
            </h2>
            
            <Card className="bg-gradient-to-br from-blue-50 to-white">
              <div className="text-center mb-6">
                <div className="bg-blue-100 inline-block p-4 rounded-full mb-4">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Your Account is Ready!
                </h3>
                <p className="text-gray-600 mb-6">
                  Please save these login credentials securely. You'll need them to access your admin panel.
                </p>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 rounded-lg mb-6">
                <div className="mb-4">
                  <label className="block text-gray-500 text-sm mb-1">Email Address</label>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium">{generatedCredentials.email}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-500 text-sm mb-1">Password</label>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="font-mono font-medium">
                      {showPassword ? generatedCredentials.password : '•'.repeat(generatedCredentials.password.length)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                      <button 
                        onClick={copyPassword} 
                        className="text-blue-600 hover:text-blue-700"
                        aria-label="Copy password"
                      >
                        <FaCopy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Subscription Valid Until</label>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium">{generatedCredentials.expiryDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    setCurrentStep(5);
                    window.scrollTo(0, 0);
                  }}
                  fullWidth
                >
                  Proceed to Login
                </Button>
                
                <Button
                  onClick={() => {
                    router.push('/');
                  }}
                  variant="secondary"
                  fullWidth
                >
                  Back to Homepage
                </Button>
              </div>
            </Card>
          </div>
        );
        
      case 5: // Login Form
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <button 
              onClick={() => {
                setCurrentStep(1);
                window.scrollTo(0, 0);
              }}
              className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Need to register? Go back
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Login to Admin Panel
            </h2>
            
            <Card>
              <ErrorAlert message={errors.general} />
              
              <form onSubmit={handleLoginSubmit}>
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  error={errors.email}
                  placeholder="Enter your email"
                  icon={<FaEnvelope className="text-gray-400" />}
                />
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} 
                        rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={loginData.remember}
                      onChange={handleLoginChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  isLoading={isLoading}
                  fullWidth
                >
                  Sign In
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                Having issues? Contact support at <a href="mailto:support@techvisiona.com" className="text-blue-600 hover:text-blue-700">support@techvisiona.com</a>
              </div>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shree Industry Admin Panel</h1>
          <p className="text-gray-600">Manage your business with our powerful admin tools</p>
        </div>
        
        {/* Progress Steps (only show if not on login step) */}
        {currentStep !== 5 && <ProgressSteps />}
        
        {/* Dynamic Content Based on Current Step */}
        {renderCurrentStep()}
      </div>
    </div>
  );
}
