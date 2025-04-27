import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  // Set the main theme color of the site
  const setThemeColor = (color = '#00ADEF') => {
    document.documentElement.style.setProperty('--color-main', color);
    document.documentElement.style.transition = 'all 0.3s ease';
  };

  // Set the site title
  const setSiteName = (name) => {
    document.title = name;
  };

  // Set the favicon (site icon)
  const setFavicon = async (id) => {
    if (!id) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/storage/${id}`);
      const loadedImage = `data:${res.data.body.contentType};base64,${res.data.body.data}`;

      const link = document.querySelector("link[rel='icon']") || document.createElement('link');
      link.rel = 'icon';
      link.href = loadedImage;
      document.head.appendChild(link);
    } catch (e) {
      console.error('Error setting favicon');
    }
  };

  // Fetch site settings from the API
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/setting`);
      setSettings(res.data.body);
      setThemeColor(res.data.body?.theme_color);
      setSiteName(res.data.body?.site_name);
      setFavicon(res.data.body?.favicon_image_id);
    } catch (err) {
      toast.error('Error fetching settings');
      setThemeColor(); // Set default color if error
    }
  };

  // Fetch images (logo or banner)
  const fetchImage = async (id, type) => {
    if (!id) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/storage/${id}`);
      const loadedImage = `data:${res.data.body.contentType};base64,${res.data.body.data}`;

      setSettings((prevSettings) => ({
        ...prevSettings,
        [type]: loadedImage,
      }));
    } catch (e) {
      console.error(`Error setting ${type}`);
    }
  };

  // Fetch settings and images on component mount
  useEffect(() => {
    fetchSettings();
  }, []); // Empty dependency array ensures this runs only once

  // Fetch logo and banner images only when the corresponding id is available and not fetched before
  useEffect(() => {
    if (settings?.logo_image_id && !settings.logo) {
      fetchImage(settings.logo_image_id, 'logo');
    }
    if (settings?.banner_image_id && !settings.banner) {
      fetchImage(settings.banner_image_id, 'banner');
    }
  }, [settings?.logo_image_id, settings?.banner_image_id]); // This effect runs when these specific ids change

  return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
