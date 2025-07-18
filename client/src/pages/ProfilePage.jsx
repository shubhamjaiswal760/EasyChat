import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authUser, updateProfile, axios} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)
  const [preferredLanguage, setPreferredLanguage] = useState(authUser?.preferredLanguage || 'default')
  const [supportedLanguages, setSupportedLanguages] = useState([
    { code: 'default', name: 'Default (No Translation)' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' }
  ])

  // Fetch supported languages on component mount
  useEffect(() => {
    const fetchSupportedLanguages = async () => {
      if (!axios) return;
      
      try {
        console.log('Fetching supported languages...');
        const response = await axios.get('/api/auth/supported-languages');
        const data = response.data;
        console.log('Languages response:', data);
        if (data.success) {
          setSupportedLanguages(data.languages);
        }
      } catch (error) {
        console.error('Error fetching supported languages:', error);
        // Fallback languages are already set in initial state
      }
    };

    fetchSupportedLanguages();
  }, [axios]);

  // Update preferredLanguage when authUser changes
  useEffect(() => {
    if (authUser?.preferredLanguage) {
      setPreferredLanguage(authUser.preferredLanguage);
    }
  }, [authUser]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio, preferredLanguage});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio, preferredLanguage});
      navigate('/');
    }
    
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            upload profile image
          </label>
          <input onChange={(e)=>setName(e.target.value)} value={name}
           type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
           <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder="Write profile bio" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" rows={4}></textarea>

           <div className="flex flex-col gap-2">
             <label htmlFor="language" className="text-sm text-gray-400">Preferred Language</label>
             <select 
               id="language"
               value={preferredLanguage} 
               onChange={(e) => setPreferredLanguage(e.target.value)}
               className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-800 text-gray-300"
             >
               {supportedLanguages.map((language) => (
                 <option key={language.code} value={language.code}>
                   {language.name}
                 </option>
               ))}
             </select>
             <p className="text-xs text-gray-500">
               Choose 'Default' to receive messages as they are, or select a language to auto-translate incoming messages.
             </p>
           </div>

           <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer">Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
     
    </div>
  )
}

export default ProfilePage
