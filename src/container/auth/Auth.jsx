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

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
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
  const [generatedCredentials, setGeneratedCredentials] = useState({
    email: '',
    password: '',
    expiryDate: ''
  });

  // Configuration
  const upiId = 'techvisiona@axl';
  const name = 'sharptech';
  const MIN_AMOUNT = 3000;
  
  const paymentApps = [
    { name: 'PhonePe', color: '#5f259f' },
    { name: 'Google Pay', color: '#2da94f' },
    { name: 'Paytm', color: '#00baf2' },
    { name: 'BHIM', color: '#00a5ff' },
    { name: 'Amazon Pay', color: '#ff9900' },
  ];

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

  // Initialize customer ID
  useEffect(() => {
    setCustomerId(uuidv4());
  }, []);

  // QR Code Generation
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const paymentAmount = isCustomPayment ? parseInt(customAmount) : plans[selectedPlan].amount;
        if (isNaN(paymentAmount) return;

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

    if (currentStep === 2 && !paymentCompleted) generateQrCode();
  }, [selectedPlan, customAmount, isCustomPayment, currentStep, paymentCompleted, customerId]);

  // Payment handlers
  const handlePaymentVerification = async () => {
    if (!transactionId.trim()) {
      setTransactionError("Please enter transaction ID");
      return;
    }
    
    try {
      setPaymentVerifying(true);
      const paymentAmount = isCustomPayment ? parseInt(customAmount) : plans[selectedPlan].amount;

      // Supabase payment record
      const { error } = await supabase
        .from('payment')
        .insert([{
          id: uuidv4(),
          created_at: new Date().toISOString(),
          amount: paymentAmount,
          paymentStatus: 'pending',
          orderId: uuidv4(),
          customer: customerId,
          transaction_id: transactionId
        }]);

      if (error) throw error;

      setPaymentCompleted(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Payment error:', error);
      setTransactionError("Payment verification failed");
    } finally {
      setPaymentVerifying(false);
    }
  };

  // Credentials generation
  const generateCredentials = async () => {
    try {
      setIsLoading(true);
      const expiryDate = new Date();
      
      switch(selectedPlan) {
        case '1month': expiryDate.setDate(expiryDate.getDate() + 30); break;
        case '6month': expiryDate.setDate(expiryDate.getDate() + 180); break;
        case '12month': expiryDate.setDate(expiryDate.getDate() + 365); break;
        default: expiryDate.setDate(expiryDate.getDate() + 30);
      }
      
      setGeneratedCredentials({
        email: customerEmail,
        password: `SP${customerId}${Math.floor(Math.random() * 1000)}`,
        expiryDate: expiryDate.toLocaleDateString()
      });
      setCurrentStep(4);
    } catch (error) {
      setErrors({ general: "Credentials generation failed" });
    } finally {
      setIsLoading(false);
    }
  };

  // UI Components
  const renderPlanCards = () => (
    Object.entries(plans).map(([key, plan]) => (
      <div key={key} className={`plan-card ${selectedPlan === key ? 'selected' : ''}`}
        onClick={() => setSelectedPlan(key)}>
        {plan.popular && <div className="popular-badge">BEST VALUE</div>}
        <h3>{plan.label.split(' - ')[0]}</h3>
        {key !== 'custom' && <div className="price">₹{plan.amount.toLocaleString()}</div>}
        <ul>{plan.features.map((f, i) => <li key={i}><FaCheck/>{f}</li>)}</ul>
      </div>
    ))
  );

  const renderPaymentStep = () => (
    <div className="payment-step">
      <div className="qr-section">
        {qr ? (
          <>
            <img src={qr} alt="UPI QR Code" />
            <div className="upi-details">
              <div className="upi-id">
                <span>{upiId}</span>
                <button onClick={copyUpiId}>
                  {copiedUpi ? <FaCheck/> : <FaCopy/>}
                </button>
              </div>
              <div className="payment-apps">
                {paymentApps.map((app, i) => (
                  <div key={i} className="payment-app" style={{ borderColor: app.color }}>
                    {app.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : <div className="loading-qr">Generating QR...</div>}
      </div>
      
      <div className="verification-section">
        <input 
          type="text" 
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Enter Transaction ID"
        />
        <button 
          onClick={handlePaymentVerification}
          disabled={!transactionId.trim()}
        >
          {paymentVerifying ? 'Verifying...' : 'Verify Payment'}
        </button>
        {transactionError && <div className="error">{transactionError}</div>}
      </div>
    </div>
  );

  const renderCredentialsStep = () => (
    <div className="credentials-step">
      <div className="success-icon"><FaCheck/></div>
      <h2>Admin Access Ready!</h2>
      
      <div className="credentials-box">
        <div className="credential-field">
          <label>Email</label>
          <div className="value">{generatedCredentials.email}</div>
        </div>
        
        <div className="credential-field">
          <label>Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              value={generatedCredentials.password}
              readOnly
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </button>
          </div>
        </div>
        
        <div className="credential-field">
          <label>Valid Until</label>
          <div className="value">{generatedCredentials.expiryDate}</div>
        </div>
      </div>
      
      <button onClick={() => setCurrentStep(5)}>
        Continue to Login
      </button>
    </div>
  );

  const renderLoginStep = () => (
    <div className="login-step">
      <form onSubmit={handleLoginSubmit}>
        <div className="input-group">
          <FaEnvelope/>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
          />
        </div>
        
        <div className="input-group">
          <FaLock/>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash/> : <FaEye/>}
          </button>
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="admin-container">
      <header>
        <h1>Shree Industry Admin Dashboard</h1>
        <p>Access your administration tools</p>
      </header>

      {currentStep < 5 && (
        <div className="progress-steps">
          {['Select Plan', 'Payment', 'Verification', 'Credentials'].map((step, index) => (
            <div key={step} className={`step ${index < currentStep - 1 ? 'completed' : ''} 
              ${index === currentStep - 1 ? 'active' : ''}`}>
              <div className="step-marker">{index < currentStep - 1 ? <FaCheck/> : index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          ))}
        </div>
      )}

      <main>
        {currentStep === 1 && (
          <div className="plan-selection">
            <div className="plan-grid">{renderPlanCards()}</div>
            
            <div className="customer-info">
              <h3>Your Information</h3>
              <div className="input-group">
                <FaUserAlt/>
                <input
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <FaEnvelope/>
                <input
                  type="email"
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <span>+91</span>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={10}
                />
              </div>
              
              <button onClick={handleProceedToPayment}>
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && (
          <div className="verification-success">
            <FaCheck className="success-icon"/>
            <h2>Payment Verified!</h2>
            <button onClick={generateCredentials}>
              Generate Admin Credentials
            </button>
          </div>
        )}
        {currentStep === 4 && renderCredentialsStep()}
        {currentStep === 5 && renderLoginStep()}
      </main>
    </div>
  );
}
