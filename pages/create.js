import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../components/Layout";
import campaignFactory from "../ethereum/campaignFactory";
import web3 from "../ethereum/web3";
import { useState } from 'react';
import { useRouter } from 'next/router'

const CampaignNew = props => {

	const router = useRouter();
	
	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [desc, setDesc] = useState("");
	const [minContribution, setMinContribution] = useState(0.1);
	
	const changeContribution = val => {
		setMinContribution(val);
	}
	
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrMsg("");
	
		try {
			const accounts = await web3.eth.getAccounts();
			await campaignFactory.methods
				.createCampaign(desc, web3.utils.toWei(`${minContribution}`, "ether"))
				.send({
					from: accounts[0],
				});
			router.push('/');
		}
		catch (err) {
			setErrMsg(err.message);
		}
		setLoading(false);
	}
	
	return (
		<Layout>
			<h3>Create Campaign</h3>
			<Form onSubmit={onSubmit}>
				<Form.Field>
					<label>Min. Contribution to Become Approver</label>
					<Input
						label="ether"
						labelPosition="right"
						value={minContribution}
						onChange={e => changeContribution(+e.target.value)}
						type="number"
					/>
				</Form.Field>
				<Form.Field>
					<label>Campaign Description</label>
					<Input
					  value={desc}
					  onChange={e => setDesc(e.target.value)}
					/>
				  </Form.Field>
				<Message error={!errMsg} header="Oops!" content={errMsg} />
				<Button loading={loading} primary>
					Create Campaign!
				</Button>
			</Form>
		</Layout>
	);
}

export default CampaignNew;