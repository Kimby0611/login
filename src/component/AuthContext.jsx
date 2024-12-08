import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedId = localStorage.getItem('userId');
    const storedNickname = localStorage.getItem('userNickname');
    const storedEmail = localStorage.getItem('userEmail');
    const storedBirthday = localStorage.getItem('userBirthday');

    return storedId
      ? {
          id: storedId,
          nickname: storedNickname,
          email: storedEmail || '',
          birthday: storedBirthday || '',
        }
      : null;
  });

  const login = (id, nickname, email, birthday) => {
    const newUser = { id, nickname, email, birthday };
    setUser(newUser);
    localStorage.setItem('userId', id);
    localStorage.setItem('userNickname', nickname);
    localStorage.setItem('userEmail', email || '');
    localStorage.setItem('userBirthday', birthday || '');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userBirthday');
  };

  const updateUser = (updateUser) => {
    setUser((prevUser) => ({ ...prevUser, ...updateUser}));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
