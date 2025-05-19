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
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    general: '',
    email: '',
    password: ''
  });
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
        if (isNaN(paymentAmount)) return;

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

  // Copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Copy Customer ID to clipboard
  const copyCustomerId = () => {
    navigator.clipboard.writeText(customerId);
    setCopiedCustomerId(true);
    setTimeout(() => setCopiedCustomerId(false), 2000);
  };

  // Handle custom amount change
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    
    if (value && parseInt(value) < MIN_AMOUNT) {
      setAmountError(`Minimum amount is ₹${MIN_AMOUNT}`);
    } else {
      setAmountError('');
    }
  };

  // Proceed to payment step
  const handleProceedToPayment = () => {
    if (selectedPlan === 'custom' && (!customAmount || parseInt(customAmount) < MIN_AMOUNT)) {
      setAmountError(`Minimum amount is ₹${MIN_AMOUNT}`);
      return;
    }
    
    setCurrentStep(2);
  };

  // Payment verification handler
  const handlePaymentVerification = async () => {
    if (!transactionId.trim()) {
      setTransactionError("Please enter transaction ID");
      return;
    }
    
    try {
      setPaymentVerifying(true);
      const paymentAmount = isCustomPayment ? parseInt(customAmount) : plans[selectedPlan].amount;

      // Save payment to database
      const { data, error } = await supabase
        .from('payment')
        .insert([{
          id: uuidv4(),
          created_at: new Date().toISOString(),
          amount: paymentAmount,
          status: 'completed',
          customer_id: customerId,
          transaction_id: transactionId,
          plan: selectedPlan,
          expiry_date: calculateExpiryDate()
        }])
        .select();

      if (error) throw error;

      setPaymentCompleted(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Payment error:', error);
      setTransactionError("Payment verification failed. Please try again.");
    } finally {
      setPaymentVerifying(false);
    }
  };

  // Calculate expiry date based on selected plan
  const calculateExpiryDate = () => {
    const expiryDate = new Date();
    
    switch(selectedPlan) {
      case '1month': expiryDate.setDate(expiryDate.getDate() + 30); break;
      case '6month': expiryDate.setDate(expiryDate.getDate() + 180); break;
      case '12month': expiryDate.setDate(expiryDate.getDate() + 365); break;
      default: expiryDate.setDate(expiryDate.getDate() + 30);
    }
    
    return expiryDate.toISOString();
  };

  // Generate admin credentials
  const generateCredentials = async () => {
    try {
      setIsLoading(true);
      const expiryDate = calculateExpiryDate();
      const password = `SP${customerId}${Math.floor(Math.random() * 1000)}`;
      
      // Save credentials to database
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          id: uuidv4(),
          email: `admin_${customerId}@shreeindustry.com`,
          password: password,
          customer_id: customerId,
          expiry_date: expiryDate,
          status: 'active',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setGeneratedCredentials({
        email: `admin_${customerId}@shreeindustry.com`,
        password: password,
        expiryDate: new Date(expiryDate).toLocaleDateString()
      });
      setCurrentStep(4);
    } catch (error) {
      console.error('Credentials generation error:', error);
      setErrors({ general: "Credentials generation failed" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: '', password: '', general: '' });

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', loginData.email)
        .eq('password', loginData.password)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      // Check if account is expired
      const expiryDate = new Date(data.expiry_date);
      if (new Date() > expiryDate) {
        throw new Error('Your account has expired. Please renew your subscription.');
      }

      // Dispatch login action (assuming you have Redux setup)
      dispatch(signInWithEmail({
        email: data.email,
        token: uuidv4() // In a real app, you'd get this from your auth system
      }));

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'Login failed. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // UI Components
  const renderPlanCards = () => (
    Object.entries(plans).map(([key, plan]) => (
      <div key={key} className={`plan-card ${selectedPlan === key ? 'selected' : ''}`}
        onClick={() => {
          setSelectedPlan(key);
          if (key === 'custom') {
            setIsCustomPayment(true);
          } else {
            setIsCustomPayment(false);
          }
        }}>
        {plan.popular && <div className="popular-badge">BEST VALUE</div>}
        <h3>{plan.label.split(' - ')[0]}</h3>
        {key !== 'custom' && <div className="price">₹{plan.amount.toLocaleString()}</div>}
        <ul>{plan.features.map((f, i) => <li key={i}><FaCheck/>{f}</li>)}</ul>
      </div>
    ))
  );

  const renderPaymentStep = () => (
    <div className="payment-step">
      <div className="customer-id">
        <span>Customer ID: {customerId}</span>
        <button onClick={copyCustomerId}>
          {copiedCustomerId ? <FaCheck/> : <FaCopy/>}
        </button>
      </div>
      
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
      
      <div className="amount-display">
        <FaRupeeSign/>
        <span>{amount.toLocaleString()}</span>
      </div>
      
      {isCustomPayment && (
        <div className="custom-amount">
          <input
            type="number"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder="Enter custom amount"
            min={MIN_AMOUNT}
          />
          {amountError && <div className="error">{amountError}</div>}
        </div>
      )}
      
      <div className="verification-section">
        <input 
          type="text" 
          value={transactionId}
          onChange={(e) => {
            setTransactionId(e.target.value);
            setTransactionError('');
          }}
          placeholder="Enter Transaction ID"
        />
        <button 
          onClick={handlePaymentVerification}
          disabled={!transactionId.trim() || paymentVerifying}
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
      <h2>Admin Login</h2>
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      <form onSubmit={handleLoginSubmit}>
        <div className="input-group">
          <FaEnvelope/>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            required
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
            required
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
            
            {selectedPlan === 'custom' && (
              <div className="custom-amount-input">
                <h3>Enter Custom Amount</h3>
                <div className="input-group">
                  <FaRupeeSign/>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder={`Minimum ₹${MIN_AMOUNT}`}
                    min={MIN_AMOUNT}
                  />
                </div>
                {amountError && <div className="error">{amountError}</div>}
              </div>
            )}
            
            <button 
              className="proceed-button"
              onClick={handleProceedToPayment}
              disabled={selectedPlan === 'custom' && (!customAmount || parseInt(customAmount) < MIN_AMOUNT)}
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {currentStep === 2 && renderPaymentStep()}
        {currentStep === 3 && (
          <div className="verification-success">
            <FaCheck className="success-icon"/>
            <h2>Payment Verified!</h2>
            <p>Your payment of ₹{amount.toLocaleString()} has been successfully processed.</p>
            <button onClick={generateCredentials} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Admin Credentials'}
            </button>
          </div>
        )}
        {currentStep === 4 && renderCredentialsStep()}
        {currentStep === 5 && renderLoginStep()}
      </main>

      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        header h1 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        header p {
          color: #7f8c8d;
          font-size: 1.1rem;
        }
        
        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
          position: relative;
        }
        
        .progress-steps::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background: #ecf0f1;
          z-index: 0;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .step-marker {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ecf0f1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #7f8c8d;
          margin-bottom: 0.5rem;
        }
        
        .step.active .step-marker {
          background: #3498db;
          color: white;
        }
        
        .step.completed .step-marker {
          background: #2ecc71;
          color: white;
        }
        
        .step-label {
          font-size: 0.9rem;
          color: #7f8c8d;
          font-weight: 500;
        }
        
        .step.active .step-label {
          color: #3498db;
          font-weight: 600;
        }
        
        .step.completed .step-label {
          color: #2ecc71;
        }
        
        .plan-selection {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .plan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .plan-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .plan-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .plan-card.selected {
          border-color: #3498db;
          background-color: #f8fafc;
        }
        
        .popular-badge {
          position: absolute;
          top: -10px;
          right: 10px;
          background: #f39c12;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .plan-card h3 {
          margin-top: 0.5rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        
        .price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #27ae60;
          margin-bottom: 1rem;
        }
        
        .plan-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .plan-card ul li {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #34495e;
        }
        
        .plan-card ul li svg {
          color: #2ecc71;
        }
        
        .custom-amount-input {
          margin-top: 1rem;
          padding: 1.5rem;
          border: 1px dashed #bdc3c7;
          border-radius: 8px;
          background: #f9f9f9;
        }
        
        .custom-amount-input h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        
        .input-group {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          margin-bottom: 1rem;
          background: white;
        }
        
        .input-group svg, .input-group span {
          margin-right: 0.5rem;
          color: #7f8c8d;
        }
        
        .input-group input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 1rem;
        }
        
        .proceed-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
          width: 100%;
          margin-top: 1rem;
        }
        
        .proceed-button:hover {
          background: #2980b9;
        }
        
        .proceed-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }
        
        .payment-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        
        .customer-id {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .customer-id button {
          background: none;
          border: none;
          cursor: pointer;
          color: #7f8c8d;
        }
        
        .qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .qr-section img {
          width: 200px;
          height: 200px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
        }
        
        .loading-qr {
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #ddd;
          border-radius: 8px;
          color: #7f8c8d;
        }
        
        .upi-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .upi-id {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .upi-id button {
          background: none;
          border: none;
          cursor: pointer;
          color: #7f8c8d;
        }
        
        .payment-apps {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .payment-app {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          border: 1px solid;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .amount-display {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #27ae60;
        }
        
        .custom-amount {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .custom-amount input {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          text-align: center;
          width: 150px;
        }
        
        .verification-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 400px;
        }
        
        .verification-section input {
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          width: 100%;
        }
        
        .verification-section button {
          background: #2ecc71;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
          width: 100%;
        }
        
        .verification-section button:hover {
          background: #27ae60;
        }
        
        .verification-section button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }
        
        .verification-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
        }
        
        .verification-success .success-icon {
          font-size: 3rem;
          color: #2ecc71;
        }
        
        .verification-success h2 {
          color: #2c3e50;
          margin: 0;
        }
        
        .verification-success p {
          color: #7f8c8d;
          max-width: 400px;
        }
        
        .verification-success button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .verification-success button:hover {
          background: #2980b9;
        }
        
        .verification-success button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }
        
        .credentials-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          text-align: center;
        }
        
        .credentials-step .success-icon {
          font-size: 3rem;
          color: #2ecc71;
        }
        
        .credentials-step h2 {
          color: #2c3e50;
          margin: 0;
        }
        
        .credentials-box {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          width: 100%;
          max-width: 400px;
        }
        
        .credential-field {
          margin-bottom: 1.5rem;
        }
        
        .credential-field label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #7f8c8d;
          text-align: left;
        }
        
        .credential-field .value {
          background: white;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          border: 1px solid #ddd;
          text-align: left;
          font-family: monospace;
        }
        
        .password-input {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .password-input input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.75rem 1rem;
          font-family: monospace;
        }
        
        .password-input button {
          background: none;
          border: none;
          padding: 0 1rem;
          cursor: pointer;
          color: #7f8c8d;
        }
        
        .credentials-step button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .credentials-step button:hover {
          background: #2980b9;
        }
        
        .login-step {
          max-width: 400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .login-step h2 {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .login-step form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .error-message {
          color: #e74c3c;
          background: #fdeded;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          text-align: center;
        }
        
        .login-step .input-group {
          position: relative;
        }
        
        .login-step .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #7f8c8d;
        }
        
        .login-step button[type="submit"] {
          background: #2ecc71;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .login-step button[type="submit"]:hover {
          background: #27ae60;
        }
        
        .login-step button[type="submit"]:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }
        
        .error {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
