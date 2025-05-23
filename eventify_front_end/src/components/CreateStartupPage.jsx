import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/CreateStartupPage.css";
import imageCompression from 'browser-image-compression';

function CreateStartupPage() {
  // Navigation and state
  const navigate = useNavigate();
  const { state } = useLocation();
  
  // Form state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    stage: 'Ideation',
    website: '',
    foundedDate: '',
    businessModel: '',
    problemStatement: '',
    solution: '',
    targetMarket: '',
    competitors: '',
    revenueModel: '',
    fundingNeeds: '',
    team: [{ name: '', role: '' }],
    logo: null,
    pitchDeck: null,
    productImages: []
  });

  // Initialize form based on mode
  useEffect(() => {
    if (state?.isEditMode && state.startupData) {
      setIsEditMode(true);
      initializeFormData(state.startupData);
    }
  }, [state]);

  const initializeFormData = (startupData) => {
    setFormData({
      name: startupData.name || '',
      description: startupData.description || '',
      industry: startupData.industry || '',
      stage: startupData.stage || 'Ideation',
      website: startupData.website || '',
      foundedDate: startupData.foundedDate || '',
      businessModel: startupData.businessModel || '',
      problemStatement: startupData.problemStatement || '',
      solution: startupData.solution || '',
      targetMarket: startupData.targetMarket || '',
      competitors: startupData.competitors || '',
      revenueModel: startupData.revenueModel || '',
      fundingNeeds: startupData.fundingNeeds || '',
      team: startupData.team?.length > 0 ? startupData.team : [{ name: '', role: '' }],
      logo: startupData.logo ? { url: startupData.logo } : null,
      pitchDeck: startupData.pitchDeck ? { url: startupData.pitchDeck } : null,
      productImages: startupData.productImages || []
    });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, field) => {
    setFormData(prev => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleMultiFileUpload = (e) => {
    setFormData(prev => ({
      ...prev,
      productImages: [...prev.productImages, ...Array.from(e.target.files)]
    }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { name: '', role: '' }]
    }));
  };

  const handleTeamChange = (index, field, value) => {
    const updatedTeam = [...formData.team];
    updatedTeam[index][field] = value;
    setFormData(prev => ({ ...prev, team: updatedTeam }));
  };

  // File conversion utilities
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (fileOrBase64) => {
    try {
      if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:image/')) {
        return fileOrBase64;
      }
      const compressedFile = await imageCompression(fileOrBase64, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      return await convertToBase64(compressedFile);
    } catch (error) {
      console.error("Image processing failed:", error);
      return null;
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare submission data
      const submissionData = { ...formData };

      // Process files
      if (formData.logo && formData.logo instanceof File) {
        submissionData.logo = await handleImageUpload(formData.logo);
      } else if (formData.logo?.url) {
        submissionData.logo = formData.logo.url;
      }

      if (formData.pitchDeck && formData.pitchDeck instanceof File) {
        submissionData.pitchDeck = await convertToBase64(formData.pitchDeck);
      } else if (formData.pitchDeck?.url) {
        submissionData.pitchDeck = formData.pitchDeck.url;
      }

      if (formData.productImages.length > 0) {
        submissionData.productImages = await Promise.all(
          formData.productImages.map(async img => {
            return img instanceof File ? await handleImageUpload(img) : img;
          })
        );
      }

      // API call
      const url = isEditMode
        ? `http://localhost:5000/api/startup/UpdateStartup/${state.startupData._id}`
        : 'http://localhost:5000/api/startup/postStartup';

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      const result = await response.json();
      alert(`Startup ${isEditMode ? 'updated' : 'created'} successfully!`);
      navigate(state?.returnPath || `/startup`, {
        state: { startupData: result }
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="startup-form__container container mt-5">
      <div className="startup-form__row row justify-content-center">
        <div className="startup-form__column col-lg-8">
          <div className="startup-form__card card shadow">
            <div className="startup-form__header card-header">
              <h2 className="startup-form__title">
                {isEditMode ? 'Edit Startup' : 'Create New Startup'}
              </h2>
            </div>
            <div className="startup-form__body card-body">
              <form onSubmit={handleSubmit} className="startup-form__form">

                {/* Basic Info Section */}
                <div className="startup-form__section mb-4">
                  <h4 className="startup-form__section-title">Basic Information</h4>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="startup-form__label">Startup Name*</label>
                      <input
                        type="text"
                        className="form-control startup-form__input"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="startup-form__label">Industry*</label>
                      <input
                        type="text"
                        className="form-control startup-form__input"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="startup-form__label">Description*</label>
                    <textarea
                      className="form-control startup-form__textarea"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="startup-form__label">Stage*</label>
                      <select
                        className="form-control startup-form__input"
                        name="stage"
                        value={formData.stage}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Ideation">Ideation</option>
                        <option value="Pre-seed">Pre-seed</option>
                        <option value="Seed">Seed</option>
                        <option value="Series A">Series A</option>
                        <option value="Series B+">Series B+</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="startup-form__label">Founded Date</label>
                      <input
                        type="date"
                        className="form-control startup-form__input"
                        name="foundedDate"
                        value={formData.foundedDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="startup-form__label">Website</label>
                    <input
                      type="url"
                      className="form-control startup-form__input"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="startup-form__label">Upload Logo</label>
                    <input
                      type="file"
                      className="form-control startup-form__file-input"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                    />
                    {formData.logo && (
                      <small className="startup-form__file-name">{formData.logo.name}</small>
                    )}
                  </div>
                </div>

                {/* Business Details */}
                <div className="startup-form__section mb-4">
                  <h4 className="startup-form__section-title">Business Details</h4>

                  {[
                    { label: "Business Model*", name: "businessModel", rows: 2 },
                    { label: "Problem Statement*", name: "problemStatement", rows: 3 },
                    { label: "Solution*", name: "solution", rows: 3 },
                    { label: "Target Market", name: "targetMarket", rows: 2 },
                    { label: "Competitors", name: "competitors", rows: 2 },
                    { label: "Revenue Model", name: "revenueModel", rows: 2 }
                  ].map(({ label, name, rows }) => (
                    <div className="mb-3" key={name}>
                      <label className="startup-form__label">{label}</label>
                      <textarea
                        className="form-control startup-form__textarea"
                        name={name}
                        rows={rows}
                        value={formData[name]}
                        onChange={handleInputChange}
                        required={label.includes('*')}
                      />
                    </div>
                  ))}
                </div>

                {/* Funding and Team */}
                <div className="startup-form__section mb-4">
                  <h4 className="startup-form__section-title">Funding & Team</h4>

                  <div className="mb-3">
                    <label className="startup-form__label">Funding Needs (USD)</label>
                    <input
                      type="number"
                      className="form-control startup-form__input"
                      name="fundingNeeds"
                      value={formData.fundingNeeds}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="startup-form__label">Team Members</label>
                    {formData.team.map((member, index) => (
                      <div key={index} className="row mb-2">
                        <div className="col-md-5">
                          <input
                            type="text"
                            className="form-control startup-form__input"
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-md-5">
                          <input
                            type="text"
                            className="form-control startup-form__input"
                            placeholder="Role"
                            value={member.role}
                            onChange={(e) => handleTeamChange(index, 'role', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary startup-form__add-team-btn"
                      onClick={addTeamMember}
                    >
                      Add Team Member
                    </button>
                  </div>
                </div>

                {/* Media Section */}
                <div className="startup-form__section mb-4">
                  <h4 className="startup-form__section-title">Media</h4>

                  <div className="mb-3">
                    <label className="startup-form__label">Upload Pitch Deck</label>
                    <input
                      type="file"
                      className="form-control startup-form__file-input"
                      accept=".pdf,.ppt,.pptx"
                      onChange={(e) => handleFileUpload(e, 'pitchDeck')}
                    />
                    {formData.pitchDeck && (
                      <small className="startup-form__file-name">{formData.pitchDeck.name}</small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="startup-form__label">Upload Product Images</label>
                    <input
                      type="file"
                      className="form-control startup-form__file-input"
                      accept="image/*"
                      multiple
                      onChange={handleMultiFileUpload}
                    />
                    {formData.productImages.length > 0 && (
                      <div className="mt-2">
                        <small className="startup-form__file-name">
                          {formData.productImages.length} files selected
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="startup-form__button-group d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/startup')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Processing...' : (isEditMode ? 'Update Startup' : 'Create Startup')}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStartupPage;
