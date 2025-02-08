import { useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { FileUpload } from './FileUpload';

function ReverseMode() {
  const [file, setFile] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an image");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const formData = new FormData();
        formData.append("image", file);
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reverse-engineer`, {
          method: "POST",
          body: formData,
        });

        
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Image processing failed");
        }
  
        setGeneratedPrompt(data.prompt);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Asset Reverse Engineering</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Upload Asset Image</label>
              <FileUpload 
                onUpload={(file) => setFile(file)}
                className="mb-4"
              />
              {file && (
                <p className="text-sm text-green-600">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? <LoadingSpinner /> : 'Generate Description'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {generatedPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Generated Description</h3>
          <div className="card">
            <p className="text-gray-700 whitespace-pre-wrap">{generatedPrompt}</p>
            <button
              onClick={() => navigator.clipboard.writeText(generatedPrompt)}
              className="btn-primary mt-4"
            >
              Copy to Clipboard
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ReverseMode;