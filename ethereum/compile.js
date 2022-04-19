const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

console.log("removed build folder...")

const CampaignFactoryPath = path.resolve(__dirname, "contracts", "CampaignFactory.sol");
const source = fs.readFileSync(CampaignFactoryPath, "utf8");

var input = {
  language: 'Solidity',
  sources: {
	  'CampaignFactory': {
		  content: source
	  }
  },
  settings: {
    outputSelection: {
	  '*': {
		'*': ['*']  
	  }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

fs.ensureDirSync(buildPath);


Object.keys(input['sources']).forEach(source => {
	Object.keys(output[source]).forEach(contract => {
		console.log("writing to file", contract);
		fs.outputJsonSync(
			path.resolve(buildPath, contract + ".json"),
			output[source][contract]
		);
	});
});