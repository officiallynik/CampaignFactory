import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0x7eD9843f196b02C6ec02e0eDAA5F1751A6442E53'
);

export default instance;