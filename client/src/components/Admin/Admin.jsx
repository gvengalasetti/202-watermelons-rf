import React from 'react';
import { RestaurantsContextProvider } from '../../context/RestaurantsContext';
import FindDuplicates from './FindDuplicates';

const AdminPage = () => {
  return (
    <RestaurantsContextProvider>
      <div className="admin-page">
        <h1>Admin Dashboard</h1>
        <FindDuplicates />
      </div>
    </RestaurantsContextProvider>
  );
};

export default AdminPage;
