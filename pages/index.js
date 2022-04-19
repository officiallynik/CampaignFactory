import CampaignFactory from '../ethereum/campaignFactory';
import Layout from '../components/Layout';
import Link from 'next/link';
import { Card, Dimmer, Image, Loader, Segment } from "semantic-ui-react";
import { useEffect, useState } from 'react';

const HomePage = () => {

	const [campaignsInfo, setCampaignsInfo] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const campaigns = await CampaignFactory.methods.getDeployedCampaigns().call();
		  
			const campaignsInfo = {};
			for(let i=0; i<campaigns.length; i++){
				campaignsInfo[campaigns[i]] = await CampaignFactory.methods.getCampaignDescription(campaigns[i]).call()
			}
			
			setCampaignsInfo(campaignsInfo);
		}
		fetchData();
	}, []);


	const renderCampaigns = () => {
		if(!campaignsInfo) {
			return (
				<>
					<Segment><Loader disabled></Loader><Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" /></Segment>
					<Segment><Loader disabled></Loader><Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" /></Segment>
					<Segment><Loader disabled></Loader><Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" /></Segment>
					<Segment><Loader disabled></Loader><Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" /></Segment>
				</>
			);
		}

		const items = Object.keys(campaignsInfo).map(address => {
			return {
				header: `Campaign Description: ${campaignsInfo[address]}`,
				description: (
					<div>
						<div>Campaign Creator Address: {address}</div>
						<Link href={`/${address}`}>
							<a>View Campaign</a>
				  		</Link>
					</div>
				),
				fluid: true
			}
		});
		return <Card.Group items={items} />;
	}
	
	return (
		<Layout>
        <div>
			{renderCampaigns()}
        </div>
      </Layout>
	);	
}

export default HomePage;