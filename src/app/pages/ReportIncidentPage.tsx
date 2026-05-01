import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { WireframePlaceholder } from '../components/WireframePlaceholder';
import { incidentTypes } from '../data/mockData';
import { useIncidents } from '../context/IncidentsContext';
import { useAuth } from '../context/AuthContext';

export default function ReportIncidentPage() {
  const navigate = useNavigate();
  const { addIncident } = useIncidents();
  const { userEmail } = useAuth();
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview/data URL for all files
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Extract region from location (simple logic: first word or "Unknown")
      const region = formData.location.split(',')[0].trim() || 'Unknown';

      // Create new incident with all required fields
      await addIncident({
        type: formData.type,
        description: formData.description,
        location: formData.location,
        severity: 'Medium',
        region: region,
        reportedBy: userEmail || 'Anonymous Citizen',
        attachment: selectedFile && filePreview ? {
          name: selectedFile.name,
          url: filePreview,
          type: selectedFile.type
        } : undefined
      });

      alert('Incident reported successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to submit incident:', error);
      alert('Failed to submit incident. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold mb-2">REPORT INCIDENT</h1>
          <p className="text-gray-600 font-mono text-sm">Submit environmental incident details</p>
        </div>

        <form onSubmit={handleSubmit} className="border-4 border-black p-8 bg-gray-50">
          <div className="space-y-6">
            {/* Incident Type */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2">
                INCIDENT TYPE *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border-2 border-black p-3 font-mono bg-white"
                required
              >
                <option value="">Select incident type...</option>
                {incidentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2">
                DESCRIPTION *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border-2 border-black p-3 font-mono bg-white h-32 resize-none"
                placeholder="Describe the incident in detail..."
                required
              />
              <div className="text-xs font-mono text-gray-500 mt-1">
                Provide as much detail as possible
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2">
                LOCATION *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border-2 border-black p-3 font-mono bg-white mb-4"
                placeholder="Enter location name or address"
                required
              />
              <WireframePlaceholder label="MAP: Click to select location" height="300px" />
            </div>

            {/* Upload Section */}
            <div>
              <label className="block text-sm font-mono font-bold mb-2">
                UPLOAD EVIDENCE (Optional)
              </label>
              <div className="border-4 border-dashed border-gray-400 p-8 text-center bg-white">
                {filePreview ? (
                  // Show image preview
                  <div className="mb-4">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="max-h-64 mx-auto border-2 border-gray-400"
                    />
                    <div className="font-mono text-sm text-gray-600 mt-2">
                      {selectedFile?.name}
                    </div>
                  </div>
                ) : selectedFile ? (
                  // Show file name for non-image files
                  <div className="mb-4">
                    <div className="w-16 h-16 border-2 border-gray-400 mx-auto mb-4 flex items-center justify-center">
                      <span className="font-mono text-2xl">📄</span>
                    </div>
                    <div className="font-mono text-sm text-gray-600">
                      {selectedFile.name}
                    </div>
                  </div>
                ) : (
                  // Show upload placeholder
                  <>
                    <div className="w-16 h-16 border-2 border-gray-400 mx-auto mb-4"></div>
                    <div className="font-mono text-sm text-gray-600 mb-2">
                      [UPLOAD IMAGE/VIDEO]
                    </div>
                  </>
                )}
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <label 
                  htmlFor="file-upload"
                  className="inline-block border-2 border-black px-4 py-2 font-mono text-sm hover:bg-black hover:text-white transition-colors cursor-pointer">
                  {selectedFile ? 'CHANGE FILE' : 'CHOOSE FILE'}
                </label>
                <div className="text-xs font-mono text-gray-500 mt-2">
                  Accepted: JPG, PNG, MP4 (Max 10MB)
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-black text-white p-4 font-mono font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 border-2 border-black p-4 font-mono font-bold hover:bg-gray-100 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}