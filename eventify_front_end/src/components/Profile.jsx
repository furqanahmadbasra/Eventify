import { useState, useEffect } from 'react';
import {
    FiUser, FiMail, FiCalendar, FiMapPin,
    FiBriefcase, FiPlus, FiTrash2, FiGlobe, FiAward
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import '../styles/Profile.css';
import imageCompression from 'browser-image-compression';
// import ParticleBackground from './ParticleBackground'; // Import the ParticleBackground
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';



const Profile = () => {

    const [isReadOnly, setIsReadOnly] = useState(true);


    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        dob: '',
        location: '',
        bio: '',
        userType: 'attendee',
        skills: [],
        linkedin: '',
        website: '',
        startupName: '',
        startupStage: '',
        awards: '',
        profilePic: null,
        experiences: [{
            id: Date.now(),
            role: '',
            organization: '',
            startDate: '',
            endDate: '',
            description: ''
        }]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSkillChange = (e) => {
        const { value, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            skills: checked
                ? [...prev.skills, value]
                : prev.skills.filter(skill => skill !== value)
        }));
    };

    const handleExperienceChange = (id, e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            experiences: prev.experiences.map(exp =>
                exp.id === id ? { ...exp, [name]: value } : exp
            )
        }));
    };

    const addExperience = () => {
        setProfileData(prev => ({
            ...prev,
            experiences: [
                ...prev.experiences,
                {
                    id: Date.now(),
                    role: '',
                    organization: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                }
            ]
        }));
    };

    const removeExperience = (id) => {
        setProfileData(prev => ({
            ...prev,
            experiences: prev.experiences.filter(exp => exp.id !== id)
        }));
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


    // const handleImageUpload = async (file) => {
    //     try {
    //         console.log("Original file:", file);

    //         const compressedFile = await imageCompression(file, {
    //             maxSizeMB: 0.2,
    //             maxWidthOrHeight: 800,
    //             useWebWorker: true,
    //         });

    //         console.log("Compressed file:", compressedFile);

    //         const base64Image = await convertToBase64(compressedFile);
    //         console.log("Base64 result:", base64Image);

    //         return base64Image;
    //     } catch (error) {
    //         console.error("Image processing failed:", error);
    //         return null;
    //     }
    // };


    /**
     * Converts file to Base64.
     */
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




    const formatDateForInput = (date) => {
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const day = String(formattedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // console.log("profile data is : ", profileData)
        let image = profileData.profilePic;
        let base64Image = '';
        if (image) {
            base64Image = await handleImageUpload(image);
            // console.log(base64Image)
            if (!base64Image) {
                alert("Image processing failed. Please try another image.");
                // console.log("we cant maek the base 64 image ")
                // return;
                alert("we cant maek image ")
                // base64Image = "we"
            }

        }

        profileData.profilePic = base64Image


        try {


            const response = await fetch('https://eventify-ymsb.vercel.app/api/user/profile', {
                method: 'POST',  // or 'PUT' if updating
                headers: {
                    "Content-Type": "application/json", // This tells the server we're sending JSON
                    "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify(profileData), // Convert the profile data to JSON string
            });

            const data = await response.json();
            // console.log("Response from backend:", data);



            if (response.ok) {
                toast.success('Profile updated successfully!');
                // setProfileData(prev => ({
                //     ...prev,
                //     ...data,
                //     experiences: data.experiences?.length > 0 ? data.experiences : prev.experiences,
                //     profilePic: data.profilePic || prev.profilePic
                // }));
                // Then use this function to format the date before passing it to the input
                setProfileData(prev => ({
                    ...prev,
                    ...data,
                    dob: formatDateForInput(data.dob),
                    experiences: data.experiences?.length > 0
                        ? data.experiences.map(exp => ({
                            ...exp,
                            startDate: formatDateForInput(exp.startDate),
                            endDate: formatDateForInput(exp.endDate),
                        }))
                        : [{
                            id: Date.now(),
                            role: '',
                            organization: '',
                            startDate: '',
                            endDate: '',
                            description: ''
                        }]
                }));

            } else {
                toast.error(data.message || 'Failed to update profile');
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('An error occurred while updating profile');
        } finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://eventify-ymsb.vercel.app/api/user/profileInfo', {
                    method: 'GET',
                    headers: {
                        'auth-token': localStorage.getItem('token'),
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setProfileData(prev => ({
                        ...prev,
                        fullName: data.fullName || prev.fullName,
                        email: data.email || prev.email, // Optional, you may not want to expose email
                        dob: data.dob || prev.dob,
                        location: data.location || prev.location,
                        bio: data.bio || prev.bio,
                        userType: data.userType || prev.userType,
                        skills: data.skills && data.skills.length > 0 ? data.skills : prev.skills,
                        linkedin: data.linkedin || prev.linkedin,
                        website: data.website || prev.website,
                        startupName: data.startupName || prev.startupName,
                        startupStage: data.startupStage || prev.startupStage,
                        awards: data.awards || prev.awards,
                        profilePic: data.profilePic || prev.profilePic,
                        experiences: data.experiences && data.experiences.length > 0 ? data.experiences : prev.experiences,
                    }));
                } else {
                    toast.error(data.message || 'Failed to load profile');
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('An error occurred while loading profile');
            }
        };

        fetchProfile();
    }, []); // Empty dependency array to only run once when the component mounts


    const handleEdit_button = () => {
        setIsReadOnly(!isReadOnly); // Toggle readOnly
    };

    return (

        <div className="profile-container">
            <h2>Complete Your Eventify Profile</h2>

            {/* <ParticleBackground /> */}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <FontAwesomeIcon onClick={handleEdit_button} icon={faEdit} className=" editIcon text-blue-500 cursor-pointer" size="lg" />
                    <label className='profilePic'>
                        {profileData.profilePic ? (
                            typeof profileData.profilePic === 'string' ? (
                                <img
                                    src={
                                        profileData.profilePic.startsWith('data:image')
                                            ? profileData.profilePic
                                            : `${import.meta.env.VITE_API_URL || ''}${profileData.profilePic}`
                                    }
                                    alt="Profile"
                                    className="profile-pic"
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(profileData.profilePic)} // Preview of the selected image
                                    alt="Preview"
                                    className="profile-pic"
                                />
                            )
                        ) : (
                            <div className="upload-placeholder">
                                <FiUser className="icon" />
                                <span>Upload Photo</span>
                            </div>
                        )}
                        <input
                            readOnly={isReadOnly}
                            type="file"
                            name="profilePic"
                            onChange={handleChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label><FiUser className="icon" /> Full Name</label>
                    <input
                    readOnly={isReadOnly}
                      className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label><FiMail className="icon" /> Email</label>
                    <input
                    readOnly={isReadOnly}
                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label><FiMapPin className="icon" /> Location</label>
                    <input
                    readOnly={isReadOnly}
                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>I'm joining as:</label>
                    <div className="user-type-options">
                        {['attendee', 'organizer', 'investor', 'advisor'].map(type => (
                            <label key={type}>
                                <input
                                className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                                readOnly={isReadOnly}
                                    type="radio"
                                    name="userType"
                                    value={type}
                                    checked={profileData.userType === type}
                                    onChange={handleChange}
                                />
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                {profileData.userType === 'organizer' && (
                    <div className="form-group">
                        <label><FiBriefcase className="icon" /> Organization Name</label>
                        <input
                        readOnly={isReadOnly}
                        className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                            type="text"
                            name="startupName"
                            value={profileData.startupName}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {(profileData.userType === 'investor' || profileData.userType === 'advisor') && (
                    <div className="form-group">
                        <label><FiBriefcase className="icon" /> Focus Areas</label>
                        <div className="skills-checkbox">
                            {['Tech', 'Healthcare', 'Education', 'Finance'].map(area => (
                                <label key={area}>
                                    <input
                                    readOnly={isReadOnly}
                                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                                        type="checkbox"
                                        value={area}
                                        checked={profileData.skills.includes(area)}
                                        onChange={handleSkillChange}
                                    />
                                    {area}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label><FiGlobe className="icon" /> LinkedIn/Website</label>
                    <input
                    readOnly={isReadOnly}
                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                        type="url"
                        name="linkedin"
                        value={profileData.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                </div>

                <section className="form-section">
                    <h5><FiBriefcase /> Experience History</h5>
                    {profileData.experiences.map((exp) => (
                        <div key={exp.id} className="experience-entry">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Role/Position</label>
                                    <input
                                    readOnly={isReadOnly}
                                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                                        type="text"
                                        name="role"
                                        value={exp.role}
                                        onChange={(e) => handleExperienceChange(exp.id, e)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Organization</label>
                                    <input
                                    readOnly={isReadOnly}
                                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                                        type="text"
                                        name="organization"
                                        value={exp.organization}
                                        onChange={(e) => handleExperienceChange(exp.id, e)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Start Date</label>
                                    {/* <input
                                        type="date"
                                        name="startDate"
                                        value={exp.startDate}
                                        onChange={(e) => handleExperienceChange(exp.id, e)}
                                    /> */}
                                    <input
                                    readOnly={isReadOnly}
                                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                                        type="date"
                                        name="startDate"
                                        value={exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : ""}
                                        onChange={(e) => handleExperienceChange(exp.id, e)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    {/* <input
                                        type="date"
                                        name="endDate"
                                        value={exp.endDate}
                                        onChange={(e) => handleExperienceChange(exp.id, e)}
                                    /> */}
                                    <input
                                    readOnly={isReadOnly}
                                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                                        type="date"
                                        name="endDate"
                                        value={exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : ""}
                                        onChange={(e) => handleExperienceChange(exp.id, e)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                readOnly={isReadOnly}
                                className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                                    name="description"
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(exp.id, e)}
                                    rows="2"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => removeExperience(exp.id)}
                                className="remove-btn"
                            >
                                <FiTrash2 /> Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addExperience}
                        className="add-btn"
                    >
                        <FiPlus /> Add
                    </button>
                </section>

                <div className="form-group">
                    <label><FiAward className="icon" /> Bio/Achievements</label>
                    <textarea
                    readOnly={isReadOnly}
                    className={`form-control pe-5 ${isReadOnly ? 'opacity-50' : ''}`}
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        placeholder="Mention your background, skills, or achievements..."
                        rows="3"
                    />
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
