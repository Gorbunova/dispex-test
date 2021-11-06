import './App.css';
import SearchPanel from '../address/SearchPanel';
import { useState } from 'react';
import ClientsList from '../clientsList/ClientsList';

function App() {
	const [addressStr, setAddressStr] = useState('');
	const [addressId, setAddressId] = useState(null);

	const setAddrId = (id) => {
		setAddressId(id);
	};

	const setAddrStr = (string) => {
		setAddressStr(string);
	};
	return (
		<div className="App">
			<SearchPanel setAddressStr={setAddrStr} setAddressId={setAddrId} />
			<ClientsList addressStr={addressStr} addressId={addressId} />
		</div>
	);
}

export default App;
