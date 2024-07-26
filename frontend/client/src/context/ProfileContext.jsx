import React, { createContext, useState } from 'react';


const ProfileContext = createContext({
  profile: {},
  setProfile: () => {}
});


export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({});


  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );

  
};

export default ProfileContext;
