// useNotify.js
import { toast } from 'react-hot-toast';
import { SuccessIcon, ErrorIcon } from './ToastIcons'; // Importa los iconos personalizados

const useNotify = () => {
  const notify = (message = 'Here is your toast.', type = 'success') => {
    const baseStyle = {
      background: 'rgba(116, 116, 116, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      boxShadow:
        '7px 7px 15px rgba(163, 177, 198, 0.5), -7px -7px 20px rgba(255, 255, 255, 0.7), inset 0px 0px 4px rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff',
    };

    const options = {
      success: { icon: <SuccessIcon />, style: { ...baseStyle, border: '1px solid #4caf50' } },
      error: { icon: <ErrorIcon />, style: { ...baseStyle, border: '1px solid #f44336' } },
      info: { icon: 'ℹ️', style: { ...baseStyle, border: '1px solid #2196f3' } },
    };

    toast(message, options[type] || { style: baseStyle });
  };

  return notify;
};

export default useNotify;
