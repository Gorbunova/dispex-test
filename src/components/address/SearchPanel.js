//Hooks
import { useState, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hooks';
import useService from '../../services/Service';
//Components
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
//Styles
import './SearchPanel.css';

const SearchPanel = (props) => {
	//States
	const [streets, setStreets] = useState([]);
	const [houses, setHouses] = useState([]);
	const [flats, setFlats] = useState([]);

	const [inputStreets, setInputStreets] = useState('');
	const [inputHouses, setInputHouses] = useState('');
	const [inputFlats, setInputFlats] = useState('');

	const { loading, error, clearError } = useHttp();

	const { getStreets, getHouses, getFlats, getAddressId } = useService();
	const { setAddressId, setAddressStr } = props;

	//Run street search on first render
	useEffect(() => {
		getStreets().then(setStreets);
	}, []);

	useEffect(() => {
		setAddressStr('');
		setAddress();
		clearError();
	}, [inputHouses, inputFlats]);

	//Implement the managed component
	const onStreetChange = (e) => {
		setInputHouses('');
		setInputFlats('');
		setInputStreets(e.target.value);
	};

	const onHouseChange = (e) => {
		setInputFlats('');
		setInputHouses(e.target.value);
	};

	const onFlatChange = (e) => {
		setInputFlats(e.target.value);
	};

	//Search by houses
	const houseSearch = () => {
		getHouses(seachExist(streets, inputStreets)).then(setHouses);
	};

	useEffect(houseSearch, [inputStreets]);

	//Search by flats
	const flatsSearch = () => {
		getFlats(seachExist(houses, inputHouses)).then(setFlats);
	};

	useEffect(flatsSearch, [inputHouses, inputFlats]);

	const seachExist = (arr, input) => {
		let founded = null;
		arr.forEach((item, i) => {
			if (input === item.name) {
				founded = item.id;
			}
		});
		return founded;
	};

	//Getting addressId
	const setAddress = () => {
		if (seachExist(streets, inputStreets) && seachExist(houses, inputHouses) && seachExist(flats, inputFlats)) {
			const houseId = seachExist(houses, inputHouses);
			getAddressId(houseId, inputFlats).then(setAddressId);
			createString();
		}
	};

	const createString = () => {
		let prefix = '',
			street = '',
			house = '',
			flat = '';
		streets.forEach((item) => {
			if (item.name === inputStreets) {
				street = item.name;
				prefix = item.prefix;
			}
		});
		houses.forEach((item) => {
			if (item.name === inputHouses) house = item.name;
		});
		flats.forEach((item) => {
			if (item.name === inputFlats) flat = item.name;
		});
		setAddressStr(prefix + ' ' + street + ', ' + house + ', ' + flat);
	};

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	return (
		<>
			<span className="search-panel__title">Адрес</span>
			<div className="search-panel">
				<input onChange={onStreetChange} list="streets" className="search-panel__input" name="streets" value={inputStreets} placeholder="Улица" />
				<datalist id="streets">
					{streets.map((item) => {
						return item.cityId === 1 ? <option key={item.id} value={item.name} /> : null;
					})}
				</datalist>

				<input
					disabled={houses.length > 0 ? false : true}
					onChange={onHouseChange}
					list="houses"
					className="search-panel__input"
					value={inputHouses}
					placeholder="Дом"
				/>
				<datalist id="houses">
					{houses.map((item, i) => {
						return <option key={item.id} value={item.name} />;
					})}
				</datalist>

				<input
					disabled={houses.length > 0 && flats.length >= 1 ? false : true}
					onChange={onFlatChange}
					list="flats"
					className="search-panel__input"
					value={inputFlats}
					placeholder="Квартира"
				/>
				<datalist id="flats">
					{flats.length !== 1 ? (
						flats.map((item) => (item.typeId === 3 ? <option key={item.id} value={item.name} /> : null))
					) : (
						<option key={flats[0].id} value={flats[0].name} />
					)}
				</datalist>

				{spinner}
				{errorMessage}
			</div>
		</>
	);
};

export default SearchPanel;
