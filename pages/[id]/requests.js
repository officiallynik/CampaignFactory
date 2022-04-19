import { Button, Header, Table, TableBody, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Link from 'next/link';
import RequestRow from "../../components/RequestRow";
import Campaign from '../../ethereum/campaign';
import web3 from "../../ethereum/web3";

const RequestsPage = ({ address, requests, approversCount }) => {

    const onApprove = async id => {
        try{
            const campaign = Campaign(address);
    
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(id).send({
                from: accounts[0],
            });
        }
        catch (err) {

        }
    };

    const onFinalize = async id => {
        try {
            const campaign = Campaign(address);
    
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(id).send({
                from: accounts[0],
            });    
        } 
        catch (err) {
            
        }
    };

    const renderRows = () => {
        return requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={address}
                    approversCount={approversCount}
                    onApprove={onApprove}
                    onFinalize={onFinalize}
                />
            );
        });
    }

    return (
        <Layout>
            <h3>Requests</h3>
            <Link href={`/${address}/requests-new`}>
                <a>
                    <Button primary floated="left" style={{ marginBottom: 10 }}>
                        Add Request
                    </Button>
                </a>
            </Link>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>ID</TableHeaderCell>
                        <TableHeaderCell>Description</TableHeaderCell>
                        <TableHeaderCell>Amount</TableHeaderCell>
                        <TableHeaderCell>Recipient</TableHeaderCell>
                        <TableHeaderCell>Approval Count</TableHeaderCell>
                        <TableHeaderCell>Approve</TableHeaderCell>
                        <TableHeaderCell>Finalize</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderRows()}</TableBody>
            </Table>
        </Layout>
    );
}

RequestsPage.getInitialProps = async ({ query }) => {
    const campaign = Campaign(query.id);

    const requestCount = await campaign.methods.requestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
        Array(parseInt(requestCount))
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call();
            })
    );

    return { address: query.id, requests, approversCount }
}

export default RequestsPage;