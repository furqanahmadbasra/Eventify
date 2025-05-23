import imageCompression from 'browser-image-compression';
import { CLOUD_NAME , UPLOAD_PRESET_NAME } from '../config';

/**
 * Compresses and converts the uploaded image file to base64.
 */
// const handleImageUpload = async (file) => {
//   try {

//     // dlm5yrb0q

//     console.log("Original file:", file);
    
//     const compressedFile = await imageCompression(file, {
//       maxSizeMB: 0.2,
//       maxWidthOrHeight: 800,
//       useWebWorker: true,
//     });

//     console.log("Compressed file:", compressedFile);

//     const base64Image = await convertToBase64(compressedFile);
//     console.log("Base64 result:", base64Image);
    
//     return base64Image;
//   } catch (error) {
//     console.error("Image processing failed:", error);
//     return null;
//   }
// };

async function handleImageUpload(imageFile) {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); // <-- replace with your unsigned preset

    console.log("the image file is ", imageFile)
     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    

    const data = await response.json();

    console.log("we have got the data"  , data)

    if (data.secure_url) {
      return data.secure_url;  // this is the uploaded image URL from Cloudinary
    } else {
      console.error('Upload failed:', data);
      return null;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}


/**
 * Converts file to Base64.
 */
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      console.log("reader result:", reader.result);  // Should show Base64 string
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(error);
    };
  });
};


/**
 * Sends event data to the backend.
 * Compresses the image and adds it as a base64 string.
 */
export const addEvent = async (eventData) => {
  const {
    title,
    description,
    date,
    time,
    location,
    latitude,
    longitude,
    city,
    country,
    category,
    seatsAvailable,
    price,
    is_online,
    eventType,
    skillLevel,
    audience,
    mode,
    image,         // Actual image file input
    endTime,
    eventLink,
    contactInfo,
  } = eventData;

  let base64Image = '';
  if (image) {
    base64Image = await handleImageUpload(image);
    console.log(base64Image)
    if (!base64Image) {
      alert("Image processing failed. Please try another image.");
      console.log("we cant maek the base 64 image ")
      return;
    }
    
  }

  // console.log("base 64 image is : ", base64Image)

  // console.log("we are in the addevent , " , image)

  // console.log("eventData.image:", eventData.image);


  const url = "http://localhost:5000/api/event/addEvent";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        description,
        date,
        time,
        location,
        latitude,
        longitude,
        city,
        country,
        category,
        seatsAvailable,
        price,
        is_online,
        eventType,
        skillLevel,
        audience,
        mode,
        image: base64Image,  // Send compressed Base64 image
        endTime,
        eventLink,
        contactInfo
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Submission failed:", errorData);
      alert(`Error: ${errorData.message || "Unknown error"}`);
      return;
    }

    const result = await response.json();
    // console.log("Event submitted successfully:", result);
    alert("Event created successfully!");

  } catch (error) {
    console.error("Network or server error:", error);
    alert("Network error. Please try again later.");
  }
};
