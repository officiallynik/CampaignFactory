import { Form, Button, Message, Input } from "semantic-ui-react";
import Link from 'next/link';
import Layout from "../../components/Layout";
import { useState } from "react";
import Campaign from "../../ethereum/campaign";
import { useRouter } from 'next/router';
import web3 from "../../ethereum/web3";

const RequestNew = ({ address }) => {

    const router = useRouter(); 

    const [value, setValue] = useState(0.1);
    const [desc, setDesc] = useState("");
    const [recipient, setRecipient] = useState("");
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const onSubmit = async e => {
        e.preventDefault();

        const campaign = Campaign(address);
        setLoading(true);
        setErrMsg("");

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(desc, web3.utils.toWei(value, "ether"), recipient)
                .send({ from: accounts[0] });
            
            router.push(`/${address}/requests`);
        } 
        catch (err) {
            setErrMsg(err.message);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <Link href={`/${address}/requests`}>
                <a>Back</a>
            </Link>
            <h3>Create a Request</h3>
            <Form onSubmit={onSubmit} error={!!errMsg}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={desc}
                        onChange={e => { setDesc(e.target.value) }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        type="number"
                        value={value}
                        onChange={e => { setValue(e.target.value) }}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={recipient}
                        onChange={e => { setRecipient(e.target.value) }}
                    />
                </Form.Field>
                <Message error header="Oops!" content={errMsg} />
                <Button primary loading={loading}>
                    Create!
                </Button>
            </Form>
        </Layout>
    );
}

RequestNew.getInitialProps = async ({ query }) => {
    return { address: query.id };
}

export default RequestNew;