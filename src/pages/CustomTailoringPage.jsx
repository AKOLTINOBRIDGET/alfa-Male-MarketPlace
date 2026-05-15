import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRulerCombined, FaCalendarAlt, FaCheckCircle, FaCut, FaPalette } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const fabrics = [
  { id: 'wool', name: 'Italian Premium Wool', price: 350, desc: 'Breathable, durable, and classic. Perfect for all-season wear.' },
  { id: 'silk', name: 'Mulberry Silk Blend', price: 450, desc: 'Luxurious sheen and incredibly smooth. Ideal for evening wear and galas.' },
  { id: 'linen', name: 'Irish Linen', price: 300, desc: 'Lightweight and textured. The absolute best choice for summer weddings.' },
  { id: 'velvet', name: 'Plush Velvet', price: 400, desc: 'Rich, deep texture that commands the room. Available in dark jewel tones.' },
];

const colors = [
  { id: 'midnight', name: 'Midnight Blue', hex: '#191970' },
  { id: 'charcoal', name: 'Charcoal Grey', hex: '#36454F' },
  { id: 'burgundy', name: 'Deep Burgundy', hex: '#800020' },
  { id: 'olive', name: 'Olive Green', hex: '#556B2F' },
  { id: 'black', name: 'Classic Black', hex: '#111111' },
  { id: 'cream', name: 'Ivory Cream', hex: '#FFFFF0' },
];

const CustomTailoringPage = () => {
  const [step, setStep] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [measurementType, setMeasurementType] = useState('manual'); // 'manual' or 'appointment'
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => {
    if (step === 1 && selectedFabric) setStep(2);
    else if (step === 2 && selectedColor) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-gold-500 mb-6">
          <FaCheckCircle size={80} />
        </motion.div>
        <h2 className="text-4xl font-serif text-white mb-4">Request Received</h2>
        <p className="text-gray-400 text-lg mb-8 text-center max-w-lg">
          Your custom tailoring request has been securely submitted. One of our master tailors will contact you within 24 hours to finalize details.
        </p>
        <Link to="/" className="btn-primary">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-16 text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <FaCut className="text-gold-500 text-4xl mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Bespoke Tailoring</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the ultimate luxury of a suit made exclusively for you. Choose your fabric, select your color, provide your measurements, and let our master tailors do the rest.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center mb-12 hidden md:flex">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-gold-500 text-dark' : 'bg-dark-100 text-gray-500 border border-white/10'}`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-gold-500' : 'bg-dark-100'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-gold-500 text-dark' : 'bg-dark-100 text-gray-500 border border-white/10'}`}>2</div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-gold-500' : 'bg-dark-100'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-gold-500 text-dark' : 'bg-dark-100 text-gray-500 border border-white/10'}`}>3</div>
            <div className={`w-16 h-1 ${step >= 4 ? 'bg-gold-500' : 'bg-dark-100'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 4 ? 'bg-gold-500 text-dark' : 'bg-dark-100 text-gray-500 border border-white/10'}`}>4</div>
          </div>
        </div>
        <div className="text-center mb-8 md:hidden text-gold-500 font-serif">
          Step {step} of 4
        </div>

        {/* Steps Container */}
        <div className="bg-dark-100 p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: FABRIC */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-serif text-gold-500 mb-8">Step 1: Select Your Fabric</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fabrics.map(fabric => (
                    <div 
                      key={fabric.id}
                      onClick={() => setSelectedFabric(fabric)}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedFabric?.id === fabric.id 
                          ? 'border-gold-500 bg-gold-500/10' 
                          : 'border-white/10 hover:border-white/30 bg-dark-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif text-white">{fabric.name}</h3>
                        <span className="text-gold-500 font-bold">${fabric.price}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{fabric.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={handleNext} 
                    disabled={!selectedFabric}
                    className={`btn-primary ${!selectedFabric ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Continue to Color
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: COLOR */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-serif text-gold-500 mb-8 flex items-center gap-3">
                  <FaPalette /> Step 2: Select Your Color
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {colors.map(color => (
                    <div 
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedColor?.id === color.id 
                          ? 'border-gold-500 bg-gold-500/10' 
                          : 'border-white/10 hover:border-white/30 bg-dark-200'
                      }`}
                    >
                      <div 
                        className={`w-12 h-12 rounded-full border-2 ${selectedColor?.id === color.id ? 'border-gold-500 shadow-lg' : 'border-white/20'}`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-white font-medium">{color.name}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-between">
                  <button onClick={handleBack} className="btn-outline border-white/20 text-white hover:bg-white/10 hover:text-white">Back</button>
                  <button 
                    onClick={handleNext} 
                    disabled={!selectedColor}
                    className={`btn-primary ${!selectedColor ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Continue to Measurements
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: MEASUREMENTS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-serif text-gold-500 mb-8">Step 3: Measurement Preferences</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={() => setMeasurementType('manual')}
                    className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                      measurementType === 'manual' 
                        ? 'border-gold-500 bg-gold-500/5 text-white' 
                        : 'border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    <FaRulerCombined size={30} className={measurementType === 'manual' ? 'text-gold-500' : ''} />
                    <span className="font-medium tracking-wide">Enter Measurements Now</span>
                  </button>
                  <button
                    onClick={() => setMeasurementType('appointment')}
                    className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all ${
                      measurementType === 'appointment' 
                        ? 'border-gold-500 bg-gold-500/5 text-white' 
                        : 'border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    <FaCalendarAlt size={30} className={measurementType === 'appointment' ? 'text-gold-500' : ''} />
                    <span className="font-medium tracking-wide">Book an In-Store Fitting</span>
                  </button>
                </div>

                {measurementType === 'manual' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Chest (inches)</label>
                      <input type="number" placeholder="40" className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Waist (inches)</label>
                      <input type="number" placeholder="34" className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Shoulders (inches)</label>
                      <input type="number" placeholder="18" className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Sleeve Length</label>
                      <input type="number" placeholder="25" className="input-field" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Preferred Date</label>
                      <input type="date" className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Preferred Time</label>
                      <select className="input-field appearance-none bg-dark-200">
                        <option>Morning (09:00 AM - 12:00 PM)</option>
                        <option>Afternoon (12:00 PM - 04:00 PM)</option>
                        <option>Evening (04:00 PM - 07:00 PM)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mt-10 flex justify-between">
                  <button onClick={handleBack} className="btn-outline border-white/20 text-white hover:bg-white/10 hover:text-white">Back</button>
                  <button onClick={handleNext} className="btn-primary">Review Details</button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: REVIEW */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-serif text-gold-500 mb-8">Step 4: Review & Submit</h2>
                
                <div className="bg-dark-200 p-6 rounded-xl border border-white/5 space-y-4 mb-8">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-gray-400">Selected Fabric</span>
                    <span className="font-serif text-white">{selectedFabric?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4 items-center">
                    <span className="text-gray-400">Selected Color</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor?.hex }}></div>
                      <span className="text-white">{selectedColor?.name}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-gray-400">Measurement Method</span>
                    <span className="text-white capitalize">{measurementType}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400 text-lg">Estimated Custom Cost</span>
                    <span className="font-serif text-gold-500 text-2xl">${selectedFabric?.price + 150}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea 
                    placeholder="Any special requests or details we should know? (Optional)" 
                    rows="3"
                    className="input-field resize-none"
                  ></textarea>

                  <div className="mt-8 flex justify-between">
                    <button type="button" onClick={handleBack} className="btn-outline border-white/20 text-white hover:bg-white/10 hover:text-white">Back</button>
                    <button type="submit" className="btn-primary">Confirm Request</button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default CustomTailoringPage;
