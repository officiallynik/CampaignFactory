import { Menu } from "semantic-ui-react";
import Link from 'next/link';
import { Button } from "semantic-ui-react";
import styles from './Header.module.css'

const Header = () => {
  return (
    <Menu>
      <div className="item">Campaign Factory</div>
      <Menu.Menu position="right">
        <Link href="/">
          <a className="item">Open Campaigns</a>
        </Link>

		<Link href="/create">
			<a className={"item " + styles.create_campaign}>
			  Create Campaign
			</a>
		</Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
