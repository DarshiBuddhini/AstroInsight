// import React, { useState, useEffect } from 'react';
// import Data from '../components/assets/mars.json';

// function MarsRoverscreen() {
//   const [roverData, setRoverData] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [displayedData, setDisplayedData] = useState([]);
//   const [showMore, setShowMore] = useState(false);

//   useEffect(() => {
//     // Assuming Data is an array of objects from your imported JSON
//     setRoverData(Data.photos);
//     setDisplayedData(Data.photos.slice(0, 30)); // Initially display 30 items
//   }, []);

//   const handleShowMore = () => {
//     setDisplayedData(Data.photos); // Display all data
//     setShowMore(true);
//   };

//   const handleViewImage = (imageSrc) => {
//     setSelectedImage(imageSrc);
//   };

//   const handleCloseModal = () => {
//     setSelectedImage(null);
//   };

//   return (
//     <div >
//          {/* Title for the page at the bottom */}
//          <div style={{ marginTop: '10%', textAlign: 'center' }}>
//         <h1>Mars Rover Images</h1>
//       </div>
//       <div className="row row-cols-1 row-cols-md-2 g-4">
//         {displayedData.map((rover) => (
//           <div className="col" key={rover.id}>
//             <div className="card">
//               <div className="card-body">
//                 <h5 className="card-title">{rover.camera.full_name}</h5>
//                 <p className="card-text">Sol: {rover.sol}</p>
//                 <p className="card-text">Earth Date: {rover.earth_date}</p>
//                 <p className="card-text">Rover Name: {rover.rover.name}</p>
//                 <p className="card-text">Landing Date: {rover.rover.landing_date}</p>
//                 <p className="card-text">Launch Date: {rover.rover.launch_date}</p>
//                 <p className="card-text">Status: {rover.rover.status}</p>
//                 <p className="card-text">Max Sol: {rover.rover.max_sol}</p>
//                 <p className="card-text">Max Date: {rover.rover.max_date}</p>
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => handleViewImage(rover.img_src)}
//                 >
//                   View Image
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showMore ? null : (
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <button className="btn btn-primary" onClick={handleShowMore}>
//             Show More
//           </button>
//         </div>
//       )}

//       {/* Modal for displaying the selected image */}
//       {selectedImage && (
//         <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
//           <div className="modal-dialog" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">View Image</h5>
//                 <button type="button" className="close" onClick={handleCloseModal}>
//                   <span aria-hidden="true">&times;</span>
//                 </button>
//               </div>
//               <div className="modal-body">
//                 <img src={selectedImage} alt="Mars Rover" className="img-fluid" />
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

   
//     </div>
//   );
// }

// export default MarsRoverscreen;



import React, { useState, useEffect } from 'react';

function MarsRoverscreen() {
  const [roverData, setRoverData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayedData, setDisplayedData] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=niJ6tVmhdYqFRejIlV6SFPMd0APa3uIwHPcyP3TY'
        );
        const data = await response.json();
        setRoverData(data.photos);
        setDisplayedData(data.photos.slice(0, 30)); // Initially display 30 items
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleShowMore = () => {
    setDisplayedData(roverData); // Display all data
    setShowMore(true);
  };

  const handleViewImage = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div style={{ marginTop: '10%' }}>
      <h1 style={{ textAlign: 'center' }}>Mars Rover Images</h1>
      <div className="container d-flex justify-content-center">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {displayedData.map((rover) => (
            <div className="col" key={rover.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{rover.camera.full_name}</h5>
                  <p className="card-text">Sol: {rover.sol}</p>
                  <p className="card-text">Earth Date: {rover.earth_date}</p>
                  <p className="card-text">Rover Name: {rover.rover.name}</p>
                  <p className="card-text">Landing Date: {rover.rover.landing_date}</p>
                  <p className="card-text">Launch Date: {rover.rover.launch_date}</p>
                  <p className="card-text">Status: {rover.rover.status}</p>
                  <p className="card-text">Max Sol: {rover.rover.max_sol}</p>
                  <p className="card-text">Max Date: {rover.rover.max_date}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewImage(rover.img_src)}
                  >
                    View Image
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showMore ? null : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={handleShowMore}>
            Show More
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Image</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <img src={selectedImage} alt="Mars Rover" className="img-fluid" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarsRoverscreen;
