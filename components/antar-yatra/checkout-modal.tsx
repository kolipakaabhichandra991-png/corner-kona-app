'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  Sparkles,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Loader2,
  Download,
  AlertCircle,
} from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface CheckoutModalProps {
  locale: Locale
  isOpen: boolean
  onClose: () => void
  onSuccess?: (tier: string) => void
  preselectedPlan?: 'monthly' | 'annual' | 'lifetime'
}

export function CheckoutModal({
  locale,
  isOpen,
  onClose,
  onSuccess,
  preselectedPlan = 'annual',
}: CheckoutModalProps) {
  const isHi = locale === 'hi'
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>(preselectedPlan)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi')
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan')
  const [upiId, setUpiId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  if (!isOpen) return null

  interface Plan {
    id: string
    title: string
    price: string
    period: string
    sub: string
    badge?: string
  }

  const plans: Record<'monthly' | 'annual' | 'lifetime', Plan> = {
    monthly: {
      id: 'monthly',
      title: isHi ? 'मासिक खोजी' : 'Monthly Seeker',
      price: '₹149',
      period: isHi ? '/ माह' : '/ month',
      sub: isHi ? 'हर महीने स्वतः नवीनीकरण, कभी भी रद्द करें' : 'Renews monthly, cancel anytime',
    },
    annual: {
      id: 'annual',
      title: isHi ? 'वार्षिक संरक्षक (लोकप्रिय)' : 'Annual Patron (Best Value)',
      price: '₹999',
      period: isHi ? '/ वर्ष' : '/ year',
      badge: isHi ? '45% बचत' : 'SAVE 45%',
      sub: isHi ? '₹83 प्रति माह — सबसे लोकप्रिय विकल्प' : 'Just ₹83/month — our most chosen tier',
    },
    lifetime: {
      id: 'lifetime',
      title: isHi ? 'आजीवन सदस्यता' : 'Lifetime Patron Circle',
      price: '₹2,999',
      period: isHi ? 'एक बार' : 'one-time',
      badge: isHi ? 'वीआईपी एक्सेस' : 'VIP CIRCLE',
      sub: isHi ? 'सदा के लिए असीमित पहुँच, नाम आभार पृष्ठ पर' : 'Forever access, editorial credit badge',
    },
  }

  const handlePayNow = () => {
    setStep('processing')
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ck_patron_tier', selectedPlan)
        localStorage.setItem('ck_patron_active', 'true')
        localStorage.setItem('ck_patron_date', new Date().toISOString())
      }
      setStep('success')
      if (onSuccess) onSuccess(selectedPlan)
    }, 2200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-amber-500/40 bg-card p-6 md:p-8 text-foreground shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 grid size-9 place-items-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>

        {/* STEP 1: Plan Selection */}
        {step === 'plan' && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                <Sparkles className="size-3.5" />
                {isHi ? 'सदस्यता प्लान चुनें' : 'Choose Your Patron Plan'}
              </span>
              <h3 className="mt-2 font-display text-2xl font-black md:text-3xl">
                {isHi ? 'अंतर यात्रा के साथ जुड़ें' : 'Join the Inner Journey'}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                {isHi
                  ? 'विज्ञापन-मुक्त आध्यात्मिक ऑडियो, ध्यान सत्र और पूरे बोल तुरंत अनलॉक करें।'
                  : 'Instant access to ad-free meditation podcasts, audiobooks, and transcripts.'}
              </p>
            </div>

            {/* Plans List */}
            <div className="grid gap-3">
              {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
                const plan = plans[key]
                const isSelected = selectedPlan === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlan(key)}
                    className={cn(
                      'flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer',
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-md'
                        : 'border-border/80 hover:border-border hover:bg-muted/40',
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm md:text-base">{plan.title}</span>
                        {plan.badge && (
                          <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-black text-white">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{plan.sub}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-xl font-black text-foreground">{plan.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <Button
              size="lg"
              onClick={() => setStep('payment')}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 font-bold text-white shadow-lg shadow-amber-500/25 hover:brightness-110 cursor-pointer"
            >
              <span>{isHi ? 'भुगतान के लिए आगे बढ़ें' : 'Proceed to Checkout'}</span>
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 2: Payment Gateway Selection */}
        {step === 'payment' && (
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                {isHi ? 'सुरक्षित गेटवे (256-बिट एन्क्रिप्शन)' : 'Secure 256-bit SSL Gateway'}
              </span>
              <h3 className="mt-1 font-display text-2xl font-black">
                {isHi ? 'भुगतान विधि चुनें' : 'Select Payment Method'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {plans[selectedPlan].title} •{' '}
                <span className="font-bold text-foreground">{plans[selectedPlan].price}</span>{' '}
                {plans[selectedPlan].period}
              </p>
            </div>

            {/* Payment Tabs: UPI, Card, NetBanking */}
            <div className="grid grid-cols-3 rounded-xl bg-muted/80 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer',
                  paymentMethod === 'upi' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
                )}
              >
                <QrCode className="size-3.5" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer',
                  paymentMethod === 'card' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
                )}
              >
                <CreditCard className="size-3.5" />
                <span>{isHi ? 'कार्ड' : 'Cards'}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 transition cursor-pointer',
                  paymentMethod === 'netbanking' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
                )}
              >
                <Building2 className="size-3.5" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Tab 1: UPI */}
            {paymentMethod === 'upi' && (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/80 p-5 bg-muted/20">
                <div className="flex items-center justify-center size-36 rounded-xl bg-white p-2 shadow-inner">
                  {/* Dynamic simulated QR code */}
                  <div className="size-full border-2 border-black/80 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-amber-50 to-orange-50 text-center">
                    <QrCode className="size-16 text-black" />
                    <span className="text-[9px] font-black tracking-widest text-black uppercase">
                      BHIM UPI
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">
                    {isHi ? 'GPay, PhonePe, Paytm या Cred से स्कैन करें' : 'Scan using GPay, PhonePe, Paytm or Cred'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isHi ? 'या अपनी UPI ID दर्ज करें:' : 'Or enter your UPI ID:'}
                  </p>
                </div>

                <div className="w-full flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUpiId('seeker@upi')}
                    className="text-xs shrink-0"
                  >
                    Auto-Fill
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 2: Credit / Debit Card */}
            {paymentMethod === 'card' && (
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 p-4 bg-muted/20">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground">
                    {isHi ? 'कार्ड नंबर' : 'Card Number'}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground">
                      {isHi ? 'समाप्ति तिथि' : 'Expiry'}
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: NetBanking */}
            {paymentMethod === 'netbanking' && (
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border/60 p-4 bg-muted/20 text-xs font-semibold">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map(
                  (bank) => (
                    <button
                      key={bank}
                      type="button"
                      className="rounded-xl border border-border/80 bg-background p-2.5 text-left hover:border-amber-500 hover:bg-amber-500/10 transition"
                    >
                      {bank}
                    </button>
                  ),
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('plan')}
                className="rounded-2xl flex-1 cursor-pointer"
              >
                {isHi ? 'वापस' : 'Back'}
              </Button>
              <Button
                onClick={handlePayNow}
                className="rounded-2xl flex-[2] bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white shadow-lg shadow-amber-500/25 hover:brightness-110 cursor-pointer"
              >
                <span>
                  {isHi
                    ? `${plans[selectedPlan].price} का भुगतान करें`
                    : `Pay ${plans[selectedPlan].price}`}
                </span>
                <Lock className="size-3.5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Processing Simulation */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center animate-pulse">
            <Loader2 className="size-14 animate-spin text-amber-500" />
            <h4 className="font-display text-xl font-bold">
              {isHi ? 'लेनदेन सुरक्षित रूप से संसाधित हो रहा है...' : 'Securing your transaction with Bank SSL...'}
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              {isHi
                ? 'कृपया इस विंडो को बंद न करें। आपका अंतर यात्रा संरक्षक खाता सक्रिय किया जा रहा है।'
                : 'Please do not refresh. Your Antar Yatra Patron pass is being minted.'}
            </p>
          </div>
        )}

        {/* STEP 4: Success & Confirmation */}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center animate-rise">
            <span className="grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-500 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="size-9" />
            </span>
            <div>
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                PATRON ACTIVATED
              </span>
              <h3 className="mt-2 font-display text-2xl font-black md:text-3xl">
                {isHi ? 'बधाई! आपकी अंतर यात्रा शुरू हो चुकी है' : 'Welcome to the Patron Circle!'}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground md:text-sm max-w-sm">
                {isHi
                  ? `आपकी ${plans[selectedPlan].title} सदस्यता सक्रिय हो गई है। सभी प्रीमियम पॉडकास्ट और बोल अनलॉक कर दिए गए हैं।`
                  : `Your ${plans[selectedPlan].title} is now active. All exclusive audio journeys and synchronized lyrics are fully unlocked.`}
              </p>
            </div>

            <div className="w-full rounded-2xl border border-border/80 bg-muted/40 p-3 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Ref:</span>
                <span className="font-mono font-bold">CK-AY-{(Math.random() * 90000 + 10000).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-emerald-500">{plans[selectedPlan].price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-bold text-emerald-500">Authorized & Verified</span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={onClose}
              className="w-full rounded-2xl bg-primary font-bold text-primary-foreground shadow-md cursor-pointer"
            >
              {isHi ? 'लाइब्रेरी सुनना शुरू करें' : 'Start Listening Now'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
