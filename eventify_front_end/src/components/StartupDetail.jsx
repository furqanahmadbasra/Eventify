import React from 'react';
import { useNavigate } from 'react-router-dom';

function StartupDetail({ startup, onClose, userRole }) {

  const navigate = useNavigate();

    const handleUpdate = () => {
      navigate('/create-startup', {
        state: { 
          startupData: startup,
          isEditMode: true,
          returnPath: `/startup` // Where to return after update
        }
      });
    };

  const handleDelete = async () => {

    // console.log("we are mmm" , startup._id);
    try {
      const response = await fetch(`http://localhost:5000/api/startup/DeleteStartup/${startup._id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json", // This tells the server we're sending JSON
          "auth-token": localStorage.getItem("token"),
        }
      });

      if (response.ok) {
        alert('Startup deleted successfully!');
        onClose(); // Close the modal
        // Optionally: Trigger a re-fetch of the startup list in the parent component
      } else {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('An error occurred while deleting the startup.');
    }
  };



  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="custom close-button" onClick={onClose}>&times;</button>
        <h2>{startup.name}</h2>
        <span className="badge bg-primary">{startup.stage}</span>

        <div className="mt-4">
          <h4>Description</h4>
          <p>{startup.description}</p>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <h5>Founders</h5>
            <ul>
              <li>John Founder (CEO)</li>
              <li>Jane Co-Founder (CTO)</li>
            </ul>
          </div>
          <div className="col-md-6">
            <h5>Details</h5>
            <p><strong>Industry:</strong> {startup.industry || "Technology"}</p>
            <p><strong>Founded:</strong> {startup.founded || "2022"}</p>
            <p><strong>Website:</strong> {startup.website || "example.com"}</p>
          </div>
        </div>

        <div className="mt-4">
          <h5>Looking For</h5>
          <div className="d-flex gap-2">
            <span className="badge bg-info">Advisors</span>
            <span className="badge bg-info">Seed Funding</span>
            <span className="badge bg-info">Technical Talent</span>
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">

          {/* Conditional Buttons */}
          {userRole === "owner" ? (
            <>
              <button onClick={handleUpdate} className="btn btn-primary">Update</button>
              <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </>
          ) : (
            <button className="btn btn-primary">Contact</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartupDetail;