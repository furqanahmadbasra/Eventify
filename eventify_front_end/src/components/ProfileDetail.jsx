

// import React from 'react';
// import "../styles/ProfileDetail.css" ;

// function ProfileDetail({ profile, onClose }) {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content position-relative">
//         {/* Custom Close Button */}
//         <button className="custom-close-button" onClick={onClose}>
//           &times;
//         </button>

//         <div className="row">
//           <div className="col-md-4 text-center">
//             {profile.profilePic ? (
//               <img 
//                 src={profile.profilePic} 
//                 alt="Profile" 
//                 className="img-fluid rounded-circle mb-3"
//                 style={{ width: '200px', height: '200px', objectFit: 'cover' }}
//               />
//             ) : (
//               <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3"
//                 style={{ width: '200px', height: '200px' }}>
//                 <i className="fas fa-user fa-5x text-muted"></i>
//               </div>
//             )}
//             <h3>{profile.fullName}</h3>
//             <p className="text-muted">{profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1)}</p>
            
//             <div className="d-flex justify-content-center gap-2 mb-3">
//               {profile.linkedin && (
//                 <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
//                   <i className="fab fa-linkedin fa-2x"></i>
//                 </a>
//               )}
//               {profile.website && (
//                 <a href={profile.website} target="_blank" rel="noopener noreferrer">
//                   <i className="fas fa-globe fa-2x"></i>
//                 </a>
//               )}
//             </div>
//           </div>
          
//           <div className="col-md-8">
//             <div className="mb-4">
//               <h4>About</h4>
//               <p>{profile.bio || 'No bio provided'}</p>
//             </div>
            
//             {profile.userType === 'investor' && (
//               <div className="mb-4">
//                 <h4>Investment Focus</h4>
//                 <div className="d-flex flex-wrap gap-2">
//                   {profile.skills?.map((skill, index) => (
//                     <span key={index} className="badge bg-primary">{skill}</span>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             {profile.experiences?.length > 0 && (
//               <div className="mb-4">
//                 <h4>Experience</h4>
//                 <ul className="list-unstyled">
//                   {profile.experiences.map((exp, index) => (
//                     <li key={index} className="mb-3">
//                       <h5>{exp.role}</h5>
//                       <p className="mb-1">{exp.organization}</p>
//                       <small className="text-muted">
//                         {exp.startDate} - {exp.endDate || 'Present'}
//                       </small>
//                       {exp.description && (
//                         <p className="mt-1">{exp.description}</p>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
            
//             {profile.awards && (
//               <div className="mb-4">
//                 <h4>Awards & Recognition</h4>
//                 <p>{profile.awards}</p>
//               </div>
//             )}
            
//             <div className="mb-4">
//               <h4>Contact Information</h4>
//               <p><strong>Email:</strong> {profile.email}</p>
//               <p><strong>Location:</strong> {profile.location}</p>
//               <p><strong>Date of Birth:</strong> {profile.dob}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="d-flex justify-content-end mt-3">
//           <button className="btn btn-primary me-2">Connect</button>
//           <button className="btn btn-outline-secondary">Message</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfileDetail;
import React from 'react';
import "../styles/ProfileDetail.css";

function ProfileDetail({ profile, onClose }) {
  const defaultProfileIcon = (
    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3"
         style={{ width: '200px', height: '200px' }}>
      <i className="fas fa-user fa-5x text-muted"></i>
    </div>
  );

  const userTypeFormatted = profile?.userType
    ? profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1)
    : 'N/A';

  return (
    <div className="modal-overlay">
      <div className="modal-content position-relative shadow-lg p-4 rounded">
        {/* Close Button */}
        <button className="custom-close-button" onClick={onClose}>
          &times;
        </button>

        <div className="row">
          {/* Left Column: Profile Summary */}
          <div className="col-md-4 text-center border-end">
            {/* Profile Picture */}
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
            ) : defaultProfileIcon}

            {/* Name & Type */}
            <h3 className="fw-bold">{profile.fullName || 'Unnamed User'}</h3>
            <p className="text-muted">{userTypeFormatted}</p>

            {/* Social Links */}
            <div className="d-flex justify-content-center gap-3 mb-3">
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin fa-2x text-primary"></i>
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-globe fa-2x text-success"></i>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="col-md-8">
            {/* About Section */}
            <div className="mb-4">
              <h4 className="text-primary">About</h4>
              <p>{profile.bio || <em>No bio provided.</em>}</p>
            </div>

            {/* Skills (for Investors) */}
            {profile.userType === 'investor' && profile.skills?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-primary">Investment Focus</h4>
                <div className="d-flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="badge bg-primary">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {profile.experiences?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-primary">Experience</h4>
                <ul className="list-unstyled">
                  {profile.experiences.map((exp, idx) => (
                    <li key={idx} className="mb-3 border-bottom pb-2">
                      <h5 className="mb-0">{exp.role}</h5>
                      <p className="mb-1">{exp.organization}</p>
                      <small className="text-muted">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </small>
                      {exp.description && (
                        <p className="mt-2">{exp.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Awards */}
            {profile.awards && (
              <div className="mb-4">
                <h4 className="text-primary">Awards & Recognition</h4>
                <p>{profile.awards}</p>
              </div>
            )}

            {/* Contact Info */}
            <div className="mb-4">
              <h4 className="text-primary">Contact Information</h4>
              <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
              <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-primary me-2">
            <i className="fas fa-user-plus me-1"></i> Connect
          </button>
          <button className="btn btn-outline-secondary">
            <i className="fas fa-comment me-1"></i> Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetail;
