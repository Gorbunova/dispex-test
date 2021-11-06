import { useHttp } from '../hooks/http.hooks';

const useService = () => {
	const { loading, request, error, clearError } = useHttp();
	const _apiBase = 'https://dispex.org/api/vtest/';

	const getStreets = async () => {
		const res = await request(`${_apiBase}Request/streets`);
		return res.map(_transformStreet);
	};

	const getHouses = async (idStreet) => {
		const res = await request(`${_apiBase}Request/houses/${idStreet}`);
		return res.map(_transformHouse);
	};

	const getFlats = async (idHouse) => {
		const res = await request(`${_apiBase}Request/house_flats/${idHouse}`);
		return res.map(_transformFlat);
	};

	const getAddressId = async (houseId, inputFlats) => {
		const res = await request(`${_apiBase}HousingStock?houseId=${houseId}`);
		return _transformAddressId(res, inputFlats);
	};

	const getClients = async (addressId) => {
		if (addressId === null || addressId === -1) return [];
		const res = await request(`${_apiBase}HousingStock/clients?addressId=${addressId}`);
		return res;
	};

	const delClient = async (bindId) => {
		return await request(`${_apiBase}HousingStock/bind_client/${bindId}`, 'DELETE');
	};

	const createClient = async (body) => {
		return await request(`${_apiBase}HousingStock/client`, 'POST', body);
	};

	const bindClient = async (body) => {
		await request(`${_apiBase}HousingStock/bind_client`, 'PUT', body);
	};

	const _transformStreet = (street) => {
		return {
			id: street.id,
			name: street.name,
			cityId: street.cityId,
			prefix: street.prefix.name,
		};
	};

	const _transformHouse = (house) => {
		return {
			id: house.id,
			name: house.name,
		};
	};

	const _transformFlat = (flat) => {
		return {
			id: flat.id,
			name: flat.flat,
			typeId: flat.typeId,
		};
	};

	const _transformAddressId = (address, inputFlats) => {
		let addrID = -1;
		address.forEach((addr) => {
			if (addr.flat === inputFlats) addrID = addr.addressId;
		});
		return addrID;
	};

	return { loading, error, clearError, getStreets, getHouses, getFlats, getAddressId, getClients, delClient, createClient, bindClient };
};

export default useService;
