
import React, { useState } from 'react';
import { Check, Star, Mail, Phone, Tag, ArrowRight, ShieldCheck, CreditCard, ArrowLeft, MessageSquare, User, Plus, Send, Globe, Code } from 'lucide-react';

interface Props {
  isPublic?: boolean;
  onBack?: () => void;
}

interface Review {
  id: number;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

const INITIAL_REVIEWS: Review[] = [
  { id: 1, name: "Rajesh Kumar", role: "QA Lead", rating: 5, comment: "Trivro TestBuddy saved me hours on regression suites. The AI is incredibly accurate.", date: "2 days ago" },
  { id: 2, name: "Priya Sharma", role: "Senior Tester", rating: 5, comment: "The bug reporting tool is a game changer. My developers actually compliment my bug reports now!", date: "1 week ago" },
  { id: 3, name: "Amit Patel", role: "Automation Engineer", rating: 4, comment: "Great for generating edge cases I hadn't thought of. Essential tool for my kit.", date: "2 weeks ago" },
  { id: 4, name: "Sneha Gupta", role: "QA Manager", rating: 5, comment: "We reduced our documentation time by 60%. Highly recommend the annual plan.", date: "3 weeks ago" },
  { id: 5, name: "Vikram Singh", role: "Freelance Tester", rating: 5, comment: "Worth every rupee. The test data generation alone pays for the subscription.", date: "1 month ago" },
  { id: 6, name: "Ananya Roy", role: "Product Owner", rating: 5, comment: "Helps me write acceptance criteria that my QA team understands perfectly.", date: "1 month ago" },
  { id: 7, name: "Rahul Verma", role: "Manual Tester", rating: 4, comment: "Good interface, very easy to use. Promo code worked perfectly.", date: "1 month ago" },
  { id: 8, name: "Kavya Iyer", role: "SDET", rating: 5, comment: "The integration of security test cases in the generator is fantastic.", date: "2 months ago" },
  { id: 9, name: "Arjun Nair", role: "Tech Lead", rating: 5, comment: "Finally, a tool that understands context. It thinks like a senior engineer.", date: "2 months ago" },
  { id: 10, name: "Meera Reddy", role: "QA Lead", rating: 4, comment: "Support team (Akanksha) was very helpful in setting up our team account.", date: "2 months ago" },
  { id: 11, name: "Suresh Menon", role: "Test Analyst", rating: 5, comment: "I use it daily for API test cases. The negative scenarios are spot on.", date: "3 months ago" },
  { id: 12, name: "Divya Malhotra", role: "QA Intern", rating: 5, comment: "This helped me learn so much about how to structure test cases properly.", date: "3 months ago" },
  { id: 13, name: "Rohan Das", role: "Software Engineer", rating: 4, comment: "Surprisingly good at catching UI logic gaps.", date: "3 months ago" },
  { id: 14, name: "Ishaan Joshi", role: "QA Director", rating: 5, comment: "Scales well for large projects. We use it for our entire enterprise suite.", date: "4 months ago" },
  { id: 15, name: "Nisha Kapoor", role: "Tester", rating: 5, comment: "Love the UI. Dark mode is easy on the eyes during late night releases.", date: "4 months ago" },
  { id: 16, name: "Aditya Rao", role: "Automation Lead", rating: 4, comment: "Good value for money compared to other AI tools in the market.", date: "5 months ago" },
  { id: 17, name: "Swati Deshetty", role: "QA Engineer", rating: 5, comment: "Customer support is very responsive. Solved my payment issue in minutes.", date: "5 months ago" },
  { id: 18, name: "Varun Chopra", role: "Mobile Tester", rating: 5, comment: "Excellent for mobile app testing scenarios. Covers gestures and interruptions well.", date: "5 months ago" },
  { id: 19, name: "Pooja Hegde", role: "Performance Tester", rating: 4, comment: "Helps outline load testing strategies quickly.", date: "6 months ago" },
  { id: 20, name: "Karthik Subramaniam", role: "DevOps", rating: 5, comment: "Using it to generate smoke tests for our CI/CD pipeline.", date: "6 months ago" },
  { id: 21, name: "Neha Dhupia", role: "QA Lead", rating: 5, comment: "The 'GROWWITHTRIVRO' discount made it a no-brainer for my team.", date: "6 months ago" },
  { id: 22, name: "Manish Tiwari", role: "Test Architect", rating: 5, comment: "The depth of the root cause analysis in bug reports is impressive.", date: "7 months ago" },
  { id: 23, name: "Sana Khan", role: "QA Engineer", rating: 4, comment: "Simple, effective, and powerful. Does exactly what it says.", date: "7 months ago" },
  { id: 24, name: "Rakesh Jhunjhunwala", role: "Investor/Tech Enthusiast", rating: 5, comment: "A solid product with a clear use case. High potential.", date: "8 months ago" },
  { id: 25, name: "Deepak Chahar", role: "Tester", rating: 5, comment: "My bug rejection rate dropped to zero after using this.", date: "8 months ago" },
];

const PricingPage: React.FC<Props> = ({ isPublic = false, onBack }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Review State
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: 'QA User', rating: 5, comment: '' });

  const handleApplyPromo = () => {
    const normalizedCode = promoCode.trim().toUpperCase();
    if (normalizedCode === 'GROWWITHTRIVRO') {
      setIsSuccess(true);
      setPromoMessage('Success! Code accepted. Mention this code to support for your exclusive discount.');
    } else {
      setIsSuccess(false);
      setPromoMessage('Invalid promo code. Please check and try again.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const review: Review = {
      id: reviews.length + 1,
      name: newReview.name,
      role: newReview.role || 'QA User',
      rating: newReview.rating,
      comment: newReview.comment,
      date: "Just now"
    };

    setReviews([review, ...reviews]);
    setNewReview({ name: '', role: 'QA User', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  return (
    <div className={`max-w-6xl mx-auto ${isPublic ? 'h-full' : 'h-[calc(100vh-140px)]'} overflow-y-auto pb-10 custom-scrollbar`}>
      
      {/* Back Button for Public View */}
      {isPublic && onBack && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12 mt-8 px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Choose the plan that fits your QA needs. Unlock professional AI power today.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 px-4">
        
        {/* Monthly Plan */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl flex flex-col hover:border-indigo-500 transition-all relative overflow-hidden group">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">Monthly Subscription</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$10</span>
              <span className="text-slate-500">/ month</span>
            </div>
            <p className="text-slate-400 text-sm mt-3">Perfect for freelancers and solo QA engineers.</p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-900/50 p-1 rounded-full"><Check className="w-3 h-3 text-indigo-400" /></div>
              <span className="text-slate-300 text-sm">Unlimited Test Case Generation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-900/50 p-1 rounded-full"><Check className="w-3 h-3 text-indigo-400" /></div>
              <span className="text-slate-300 text-sm">Professional Bug Reporting</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-900/50 p-1 rounded-full"><Check className="w-3 h-3 text-indigo-400" /></div>
              <span className="text-slate-300 text-sm">Email Support</span>
            </div>
          </div>

          <button className="w-full bg-slate-700 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all mb-4">
            Contact to Subscribe
          </button>
        </div>

        {/* Annual Plan */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-indigo-500/50 rounded-2xl p-8 shadow-2xl flex flex-col relative overflow-hidden transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <Star className="w-3 h-3 fill-black" />
            BEST VALUE
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Annual Subscription</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$75</span>
              <span className="text-slate-500">/ year</span>
            </div>
            <p className="text-slate-400 text-sm mt-3">Save 37% compared to monthly. Ideal for serious professionals.</p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-900/30 p-1 rounded-full"><Check className="w-3 h-3 text-yellow-400" /></div>
              <span className="text-white text-sm font-medium">Everything in Monthly</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-900/30 p-1 rounded-full"><Check className="w-3 h-3 text-yellow-400" /></div>
              <span className="text-white text-sm font-medium">Priority 24/7 Support</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-900/30 p-1 rounded-full"><Check className="w-3 h-3 text-yellow-400" /></div>
              <span className="text-white text-sm font-medium">Early Access to New Features</span>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 mb-4 flex items-center justify-center gap-2">
             Contact to Subscribe <ArrowRight className="w-4 h-4"/>
          </button>
        </div>

        {/* Custom App Plan (NEW) */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl flex flex-col hover:border-purple-500 transition-all relative overflow-hidden group">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Custom AI App</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$249</span>
              <span className="text-slate-500">/ app</span>
            </div>
            <p className="text-slate-400 text-sm mt-3">Launch your own white-labeled AI tool.</p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
             <div className="flex items-center gap-3">
              <div className="bg-purple-900/50 p-1 rounded-full"><Globe className="w-3 h-3 text-purple-400" /></div>
              <span className="text-slate-300 text-sm">Add Your Custom Domain</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-900/50 p-1 rounded-full"><Check className="w-3 h-3 text-purple-400" /></div>
              <span className="text-slate-300 text-sm">Your Branding & Logo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-900/50 p-1 rounded-full"><Code className="w-3 h-3 text-purple-400" /></div>
              <span className="text-slate-300 text-sm">Powered by Trivro AI</span>
            </div>
          </div>

          <button className="w-full bg-slate-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all mb-4">
            Contact to Build
          </button>
        </div>

      </div>

      {/* Promo Code & Payment Info */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mb-20">
        
        {/* Promo Code Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Have a Promo Code?</h3>
          </div>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              placeholder="Enter code..." 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none uppercase placeholder:normal-case"
            />
            <button 
              onClick={handleApplyPromo}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
          {promoMessage && (
            <div className={`text-xs p-2 rounded ${isSuccess ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {promoMessage}
            </div>
          )}
        </div>

        {/* Contact Payment Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">How to Pay</h3>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            To activate your subscription or build a custom app, please contact our support team. We accept UPI, Bank Transfer, and major cards via payment link.
          </p>
          <div className="space-y-3">
             <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <Mail className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs text-slate-500">Email Support</p>
                  <p className="text-white font-medium select-all">support@trivro.in</p>
                </div>
             </div>
             <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <Phone className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs text-slate-500">Contact Number</p>
                  <p className="text-white font-medium select-all">9274741994</p>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* REVIEWS SECTION */}
      <div className="border-t border-slate-800 bg-slate-900/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
                Loved by Indian QA Teams
              </h2>
              <p className="text-slate-400 mt-2">Join thousands of testers shipping bug-free code.</p>
            </div>
            
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write a Review
            </button>
          </div>

          {/* Add Review Form */}
          {showReviewForm && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-white font-semibold mb-4">Share your experience</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={newReview.name}
                      onChange={e => setNewReview({...newReview, name: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Role / Designation</label>
                    <input 
                      type="text" 
                      value={newReview.role}
                      onChange={e => setNewReview({...newReview, role: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className={`p-1 hover:scale-110 transition-transform ${star <= newReview.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Comment</label>
                  <textarea 
                    required
                    rows={3}
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-indigo-500 outline-none" 
                  />
                </div>

                <div className="flex gap-2 justify-end">
                   <button 
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-slate-400 hover:text-white text-sm px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-800 border border-slate-700/50 p-5 rounded-xl hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{review.name}</h4>
                      <p className="text-slate-500 text-xs">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-600 fill-none'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">"{review.comment}"</p>
                <div className="text-xs text-slate-600 border-t border-slate-700/50 pt-2 flex justify-between">
                  <span>Verified User</span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      <div className="text-center mt-12 pb-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
        <ShieldCheck className="w-4 h-4" />
        Secure payments processed manually for your safety.
      </div>
    </div>
  );
};

export default PricingPage;
