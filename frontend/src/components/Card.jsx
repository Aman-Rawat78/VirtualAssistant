import React from 'react'
import { userDataContext } from '../context/UserContext';



const Card = ({ image }) => {
  const {selectedImage, setSelectedImage} = React.useContext(userDataContext);
  return (
    <div onClick={() => setSelectedImage(image)} className={`w-50 h-75 bg-[#030326] border-2 border-[#0000ff0e] rounded-2xl
     overflow-hidden hover:shadow-2xl hover:shadow-blue-500 transition-shadow duration-300 ${selectedImage === image ? 'border-white' : ''}`}>
        <img src={image} alt="Card" className='h-full object-cover '/>
    </div>
  )
}

export default Card 
