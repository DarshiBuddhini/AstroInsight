// import React, { useState } from "react";

// function Apodscreen() {
//   const apodData = {
//     copyright: "\nRowan Prangley\n",
//     date: "2024-04-24",
//     explanation:
//       "How did a star form this beautiful nebula?  In the middle of emission nebula NGC 6164 is an unusually massive star.  The central star has been compared to an oyster's pearl and an egg protected by the mythical sky dragons of Ara.  The star, visible in the center of the featured image and catalogued as HD 148937, is so hot that the ultraviolet light it emits heats up gas that surrounds it.  That gas was likely thrown off from the star previously, possibly the result of a gravitational interaction with a looping stellar companion.  Expelled material might have been channeled by the magnetic field of the massive star, in all creating the symmetric shape of the bipolar nebula.  NGC 6164 spans about four light years and is located about 3,600 light years away toward the southern constellation Norma.   New Mirror: APOD now available via WhatsApp",
//     hdurl: "https://apod.nasa.gov/apod/image/2404/DragonsEgg_Prangley_4688.jpg",
//     media_type: "image",
//     service_version: "v1",
//     title: "Dragon's Egg Bipolar Emission Nebula",
//     url: "https://apod.nasa.gov/apod/image/2404/DragonsEgg_Prangley_960.jpg",
//   };

//   return (
//     <div className="container mt-4">
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <h1 className="text-center mb-4">Astronomy Picture of the Day</h1>

//       <div className="card mx-auto" style={{ maxWidth: "58rem" }}>
//         <img
//           src={apodData.hdurl}
//           className="card-img-top"
//           alt={apodData.title}
//         />
//         <div className="card-body">
//           <h5 className="card-title">{apodData.title}</h5>
//           <p className="card-text">{apodData.explanation}</p>
//           <a
//             href={apodData.hdurl}
//             className="btn btn-primary"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             View Image
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Apodscreen;


//using api

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from '../components/assets/space.jpg'; // Assuming this is the correct path to your background image

function Apodscreen() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.nasa.gov/planetary/apod?api_key=niJ6tVmhdYqFRejIlV6SFPMd0APa3uIwHPcyP3TY');
        setApodData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openImage = () => {
    window.open(apodData.hdurl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`, // Applying the background image here
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
      
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '150vh',
      }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="card" style={{ maxWidth: '700px', textAlign: 'center' ,margin: '10%'}}>
          <div className="card-header">{apodData.title}</div>
          <div className="card-body">
            <img src={apodData.url} alt={apodData.title} className="card-img-top" style={{ maxWidth: '100%', height: 'auto' }} />
            <p className="card-text">{apodData.explanation}</p>
            <button className="btn btn-primary" onClick={openImage}>
              View Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Apodscreen;
