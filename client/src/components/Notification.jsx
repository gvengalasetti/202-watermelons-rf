import React from 'react';
import { CheckCircle } from 'lucide-react';

const Notification = ({ message }) => (
  <div className="fixed top-4 right-4 z-50">
    <div className="
      flex items-center 
      bg-green-500 text-white 
      px-4 py-2 rounded-md 
      shadow-lg transition-all
    ">
      <CheckCircle className="mr-2" />
      {message}
    </div>
  </div>
);

export default Notification;