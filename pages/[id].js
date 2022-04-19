import Campaign from '../ethereum/campaign';
import Layout from "../components/Layout";
import ContributeForm from "../components/ContributeForm";
import { Card, Grid, Button } from "semantic-ui-react";
import Link from 'next/link';
import { useState } from 'react';
import web3 from '../ethereum/web3';
import { useRouter } from 'next/router';

const CampaignPage = ({ summary, address }) => {
	
  const router = useRouter();

  const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [contributionValue, setContributionValue] = useState(0.1);
	
	const renderCards = () => {
		const [
        _,
			  manager,
			  minimumContribution,
			  requestsCount,
			  approversCount,
			  balance
			] = summary;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(minimumContribution, "ether"),
        meta: "Minimum Contribution to Become Approver (ether)",
        description:
          "You must contribute at least this much ether to become an approver",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(`${balance}`, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
      },
    ];

    return <Card.Group items={items} />;
  }

  const onSubmit = async e => {
    e.preventDefault();
		setLoading(true);
		setErrMsg("");
	
		try {
			const accounts = await web3.eth.getAccounts();
			await Campaign(address).methods
				.contribute()
				.send({
          value: web3.utils.toWei(`${contributionValue}`, "ether"),
					from: accounts[0]
				});
        setSuccessMsg("Contribution successful to the campaign");
        setTimeout(() => {
          router.reload(window.location.pathname);
        }, 5000);
		}
		catch (err) {
			setErrMsg(err.message);
		}
		setLoading(false);
  }
	
	return (
		<Layout>
        <h3>{summary[0]}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{renderCards()}</Grid.Column>
            <Grid.Column width={6}>
				<ContributeForm 
					value={contributionValue}
					changeValue={setContributionValue}
          onSubmit={onSubmit}
          loading={loading}
          errMsg={errMsg}
          successMsg={successMsg}
				/>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link href={`/${address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
	);
}

CampaignPage.getInitialProps = async ({ query }) => {
	const campaign = Campaign(query.id);
	
	const summary = await campaign.methods.summary().call();
	
	return {
		summary: Object.values(summary),
		address: query.id
	}
}

export default CampaignPage;