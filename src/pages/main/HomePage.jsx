import React from 'react';
import HeaderComponnet from '../../components/main/HeaderComponent';
import NewProductsComponent from '../../components/main/NewProductsComponent';
import OurPolicyComponent from '../../components/main/OurPolicyComponnet';
import OfferProductsComponent from '../../components/main/OfferProductsComponent';

const HomePage = () => {
  return (
    <div>
      <HeaderComponnet />
      <NewProductsComponent />
      <OfferProductsComponent />
      <OurPolicyComponent />
    </div>
  );
};

export default HomePage;
