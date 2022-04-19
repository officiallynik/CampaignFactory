import { useState } from "react";
import { Table, Button, TableRow } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { useRouter } from 'next/router';

const RequestRow = props => {

    const router = useRouter();

    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingFinalize, setLoadingFinalize] = useState(false);

    const { Cell } = Table;
    const { id, request, approversCount } = props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    const approve = async () => {
        setLoadingApprove(true);
        await props.onApprove(id);
        setLoadingApprove(false);
        setTimeout(() => {
            router.reload(window.location.pathname);
        }, 3000);
    }

    const finalize = async () => {
        setLoadingFinalize(true);
        await props.onFinalize(id);
        setLoadingFinalize(false);
        setTimeout(() => {
            router.reload(window.location.pathname);
        }, 3000);
    }

    return (
        <TableRow
            disabled={request.complete}
            positive={readyToFinalize && !request.complete}
        >
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>
                {request.approvalCount}/{approversCount}
            </Cell>
            <Cell>
                {request.complete ? null : (
                    <Button loading={loadingApprove} color="green" basic onClick={approve}>
                        Approve
                    </Button>
                )}
            </Cell>
            <Cell>
                {request.complete ? null : (
                    <Button loading={loadingFinalize} color="teal" basic onClick={finalize}>
                        Finalize
                    </Button>
                )}
            </Cell>
        </TableRow>
    );
}

export default RequestRow;