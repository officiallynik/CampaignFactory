import { Form, Input, Message, Button } from "semantic-ui-react";

const ContributeForm = props => {
	return (
		<Form onSubmit={props.onSubmit} error={false}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={props.value}
            onChange={e => props.changeValue(+e.target.value)}
            label="ether"
            labelPosition="right"
            type="number"
          />
        </Form.Field>
        <Message error={!props.errMsg} header="Oops!" content={props.errMsg} />
        <Message success={!props.successMsg} header="Congrats!" content={props.successMsg} />
        <Button primary loading={props.loading}>
          Contribute!
        </Button>
      </Form>
	)
}

export default ContributeForm;