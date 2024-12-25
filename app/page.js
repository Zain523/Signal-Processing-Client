"use client"
import { useState } from 'react';
import axios from 'axios'

export default function NoiseReductionApp() {
  const [file, setFile] = useState(null);
  const [technique, setTechnique] = useState('fft');
  const [loading, setLoading] = useState(false);
  const [responsePath, setResponsePath] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTechniqueChange = (event) => {
    setTechnique(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please upload an audio file.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file_path', file);
    formData.append('technique', technique);

    try {

      const response = await axios.post('http://127.0.0.1:5000/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        alert('Failed to filter audio.');
      }

      console.log(response.data.response);

      setResponsePath(response.data.response);

    } catch (error) {
      console.log('Something went wrong. Please try again.', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-blue-600">Noise Reduction App</h1>
        <p className="mt-4 text-lg text-gray-600">Enhance your audio quality by removing unwanted noise with cutting-edge techniques.</p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Upload Your Audio</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700">Choose an Audio File</label>
              <input
                type="file"
                accept=".mp3,.wav"
                id="audio-file"
                onChange={handleFileChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="technique" className="block text-sm font-medium text-gray-700">Select Noise Reduction Technique</label>
              <select
                id="technique"
                value={technique}
                onChange={handleTechniqueChange}
                className="w-full p-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fft">FFT Denoise</option>
                <option value="spectral">Spectral Subtraction</option>
                <option value="wavelet">Wavelet</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 mt-4 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {loading ? 'Processing...' : 'Apply Noise Reduction'}
            </button>
          </form>
        </section>

        {/* Filtered Audio Display */}
        {responsePath && (
          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">Filtered Audio</h2>
            <audio controls className="w-full mt-4">
              <source src={`/assets/${responsePath}`} />
              Your browser does not support the audio element.
            </audio>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-600">
        <p>&copy; 2024 Noise Reduction App | All rights reserved</p>
        <p>
          Built with love and designed for enhanced audio experiences.
        </p>
      </footer>
    </div>
  );
}
