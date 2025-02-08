import { useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

function BrandingMode() {
  const [formData, setFormData] = useState({
    companyName: '',
    vision: '',
    goals: '',
    brandColors: '',
    targetAudience: ''
  });
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(process.env.BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate brand asset");
      }
  
      if (!data.image) {
        throw new Error("No image received from server");
      }
  
      setGeneratedImage(data.image);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Brand Asset Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="input-field"
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Vision</label>
              <textarea
                value={formData.vision}
                onChange={(e) => setFormData({...formData, vision: e.target.value})}
                className="input-field min-h-[100px]"
                placeholder="Enter company vision"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Goals</label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                className="input-field"
                placeholder="Enter company goals"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Brand Colors</label>
              <input
                type="text"
                value={formData.brandColors}
                onChange={(e) => setFormData({...formData, brandColors: e.target.value})}
                className="input-field"
                placeholder="e.g., blue, red, #FF0000"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Target Audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                className="input-field"
                placeholder="Describe your target audience"
                required
              />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? <LoadingSpinner /> : 'Generate Brand Asset'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {generatedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Generated Asset</h3>
          <div className="card">
            <img 
              src={generatedImage} 
              alt="Generated brand asset"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <a 
              href={generatedImage}
              download="brand-asset.png"
              className="btn-primary mt-4 text-center block"
            >
              Download Image
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default BrandingMode;