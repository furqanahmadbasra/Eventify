import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/CreateStartupPage.css"
import imageCompression from 'browser-image-compression';


function CreateStartupPage() {
  const navigate = useNavigate();
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

      const handleImageUpload = async (fileOrBase64) => {
          try {
              // If it's already a base64 string, return it directly
              if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:image/')) {
                  return fileOrBase64;
              }
  
              // Otherwise, assume it's a File and compress it
              const compressedFile = await imageCompression(fileOrBase64, {
                  maxSizeMB: 0.2,
                  maxWidthOrHeight: 800,
                  useWebWorker: true,
              });
  
              const base64Image = await convertToBase64(compressedFile);
              return base64Image;
          } catch (error) {
              console.error("Image processing failed:", error);
              return null;
          }
      };
  

      const convertToBase64 = (file) => {
          return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
  
              reader.onload = () => {
                  // console.log("reader result:", reader.result);  // Should show Base64 string
                  resolve(reader.result);
              };
  
              reader.onerror = (error) => {
                  console.error("FileReader error:", error);
                  reject(error);
              };
          });
      };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Startup created:', formData);

    try {
      // Convert logo to Base64 if it's present
      if (formData.logo) {
        const base64Logo = await handleImageUpload(formData.logo);
        if (base64Logo) {
          formData.logo = base64Logo;
        } else {
          alert("Failed to convert logo to Base64.");
          return;
        }
      }

      // Convert pitchDeck to Base64 if it's present
      if (formData.pitchDeck) {
        const base64PitchDeck = await convertToBase64(formData.pitchDeck);
        if (base64PitchDeck) {
          formData.pitchDeck = base64PitchDeck;
        } else {
          alert("Failed to convert pitch deck to Base64.");
          return;
        }
      }

      // Convert all productImages to Base64 if they exist
      if (Array.isArray(formData.productImages)) {
        const base64Images = await Promise.all(
          formData.productImages.map(async (img) => {
            const result = await handleImageUpload(img);
            return result || null;
          })
        );
        formData.productImages = base64Images.filter(img => img !== null);
      }

      console.log("wee....................")

      // Send the data to the backend
      const response = await fetch('http://localhost:5000/api/startup/postStartup', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // Indicate JSON data
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });

      if (response.ok) {
        alert("Startup posted successfully");
        navigate('/startup');
      } else {
        alert("Failed to post startup.");
      }
    } catch (error) {
      console.error('Error posting startup:', error);
      alert("There was an error posting the startup.");
    }
  };


  return (
    <div className="startup-form__container container mt-5">
      <div className="startup-form__row row justify-content-center">
        <div className="startup-form__column col-lg-8">
          <div className="startup-form__card card shadow">
            <div className="startup-form__header card-header">
              <h2 className="startup-form__title">Create New Startup</h2>
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
                  <button type="submit" className="btn btn-primary">
                    Create Startup
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
