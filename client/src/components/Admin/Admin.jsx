import React from 'react';
import { RestaurantsContextProvider } from '../../context/RestaurantsContext';
import FindDuplicates from './FindDuplicates';
import Header from "../Header";
const AdminPage = () => {
  return (
    <RestaurantsContextProvider>
    <div>
    <Header />
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <FindDuplicates />
      </div>
      </div>
    </RestaurantsContextProvider>
  );
};

export default AdminPage;