//hooks
import { useState, useEffect } from 'react';
import useService from '../../services/Service';
//Components
import Modal from '../modal/modal';
import Form from '../form/Form';
//Styles
import './ClientsList.css';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ClientsList = (props) => {
	//States
	const [clients, setClients] = useState([]);
	const [modalActive, setModalActive] = useState(false);
	const [modalDelete, setModalDelete] = useState(false);
	const [deleteClient, setDeleteClient] = useState(null);
	const [editClient, setEditClient] = useState(null);
	//Props
	const { addressId, addressStr } = props;
	//useService
	const { loading, error, getClients, delClient } = useService();

	useEffect(() => {
		updateClients();
	}, [addressId]);

	const updateClients = () => {
		getClients(addressId).then(setClients);
	};

	const deleteCurrentClient = (item) => {
		setDeleteClient(item);
		setModalDelete(true);
		setModalActive(true);
	};

	const editCurrentClient = (item) => {
		setModalDelete(false);
		setEditClient(item);
		setModalActive(true);
	};

	const confirmDelete = async () => {
		await delClient(deleteClient.bindId);
		updateClients();
		setModalActive(false);
	};

	//render clients in current flat
	const renderClientList = () => {
		const items = clients.map((item) => {
			return (
				<li key={item.id}>
					<div className="client-item">
						<div className="client-item__content">
							<div className="client-item__img-wrapper">
								<i className="far fa-user client-item__img"></i>
							</div>

							<div className="client-item__data">
								<p className="client-item__data-name ">{item.name}</p>
								<p className="client-item__data-phone">
									<i className="fas fa-phone client-item__data-icon"></i>
									{item.phone}
								</p>
								<p className="client-item__data-email">
									{item.email ? <i className="far fa-envelope client-item__data-icon"></i> : null}

									{item.email}
								</p>
							</div>
						</div>
						<div className="client-item__control">
							<button className="client-item__control-item" onClick={() => deleteCurrentClient(item)}>
								<i className="far fa-trash-alt"></i>
							</button>
							<button className="client-item__control-item" onClick={() => editCurrentClient(item)}>
								<i className="far fa-edit"></i>
							</button>
						</div>
					</div>
				</li>
			);
		});
		return <ul className="clients-wrapper">{items}</ul>;
	};

	const renderDeleteModal = () => {
		return (
			<>
				<p>
					Вы действительно хотите отвязать пользователя {deleteClient.name} с номером телефона {deleteClient.phone} от квартиры по адресу{' '}
					{props.addressStr}?
				</p>
				<div className="client-form__buttons">
					<button className="client-form__button" onClick={confirmDelete}>
						УДАЛИТЬ
					</button>
					<button className="client-form__button" onClick={() => setModalActive(false)}>
						OТМЕНА
					</button>
				</div>
			</>
		);
	};

	const button = (
		<button
			className="newClient"
			onClick={() => {
				setEditClient(null);
				setModalActive(true);
				setModalDelete(false);
			}}
		>
			<i className="fas fa-user-plus"></i>
		</button>
	);

	const items = renderClientList();
	const content = addressStr && !loading && !error ? items : null;
	const spinner = loading ? <Spinner /> : null;
	const errorGif = error ? <ErrorMessage /> : null;

	return (
		<>
			<div className="clients__address">
				<p>{addressId === -1 && addressStr ? 'Такого адреса в жилищном фонде нет' : addressStr}</p>
				{addressStr && addressId !== -1 ? button : null}
			</div>
			{content}
			{spinner}
			{errorGif}
			<Modal active={modalActive} setActive={setModalActive}>
				{modalDelete ? renderDeleteModal() : <Form update={updateClients} editClient={editClient} addressId={addressId} setActive={setModalActive} />}
			</Modal>
		</>
	);
};
export default ClientsList;
