import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-dark-100 p-8 sm:p-12 rounded-2xl border border-white/5 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-white mb-3">Join The Elite</h2>
          <p className="text-gray-400">Create an account to elevate your style journey.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <FaUser />
                </div>
                <input type="text" placeholder="John" className="input-field pl-11" required />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <FaUser />
                </div>
                <input type="text" placeholder="Doe" className="input-field pl-11" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DOB */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <FaCalendarAlt />
                </div>
                <input type="date" className="input-field pl-11" required />
              </div>
            </div>

            {/* Telephone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Telephone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <FaPhone />
                </div>
                <input type="tel" placeholder="+256..." className="input-field pl-11" required />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaEnvelope />
              </div>
              <input type="email" placeholder="john@example.com" className="input-field pl-11" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Programme */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Programme / Course</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <FaGraduationCap />
                </div>
                <select className="input-field pl-11 appearance-none bg-dark-200" required>
                  <option value="">Select Programme</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
            </div>

            {/* Year of Study */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Year of Study</label>
              <div className="flex gap-4 items-center h-12">
                {['Year 1', 'Year 2', 'Year 3'].map((year) => (
                  <label key={year} className="flex items-center gap-2 cursor-pointer text-gray-300">
                    <input type="radio" name="yearOfStudy" value={year} className="accent-gold-500" required />
                    <span className="text-sm">{year}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Passport Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-dark hover:file:bg-gold-400 transition-all cursor-pointer" 
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary w-full py-4 text-lg">
              Create Account
            </button>
          </div>

        </form>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
