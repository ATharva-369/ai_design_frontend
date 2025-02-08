import { useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { FileUpload } from './FileUpload';

function ProductMode() {
  const [file, setFile] = useState(null);
  const [companyDescription, setCompanyDescription] = useState('');
  const [generatedImages, setGeneratedImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an image");
      return;
    }
    
    if (loading) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("companyDescription", companyDescription);
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate-from-products`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Image generation failed");
      }
  
      // Handle binary image data response
      const data = await response.json();
      if (!data.images || !Array.isArray(data.images)) {
        throw new Error("Invalid response format from server");
      }
  
      setGeneratedImages(data.images);
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
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Product Asset Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Upload Product Image</label>
              <FileUpload 
                onUpload={setFile}
                className="mb-4"
              />
              {file && (
                <p className="text-sm text-green-600">
                  Selected file: {file.name}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Company Description</label>
              <textarea
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                className="input-field min-h-[100px]"
                placeholder="Describe your company and brand..."
                required
              />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? <LoadingSpinner /> : 'Generate Similar Assets'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {generatedImages && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Generated Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((imageUrl, index) => (
              <div key={index} className="card">
                <img 
                  src={imageUrl} 
                  alt={`Generated asset ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <a 
                  href={imageUrl}
                  download={`product-asset-${index + 1}.png`}
                  className="btn-primary mt-4 text-center block"
                >
                  Download Image {index + 1}
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ProductMode;