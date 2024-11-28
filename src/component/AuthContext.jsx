import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedNickname = localStorage.getItem('userNickname');
    return storedNickname ? { nickname: storedNickname } : null;
  });

  const login = (nickname) => {
    setUser({ nickname });
    localStorage.setItem('userNickname', nickname);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userNickname');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
