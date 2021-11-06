//Hooks
import { useEffect, useState } from 'react';
import useService from '../../services/Service';
//Styles
import './Form.css';

const Form = (props) => {
	//States
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	//Props
	const { update, editClient } = props;

	const { delClient, createClient, bindClient } = useService();

	useEffect(() => {
		if (editClient) {
			setName(editClient.name);
			setPhone(editClient.phone);
			setEmail(editClient.email);
		} else {
			setName('');
			setPhone('');
			setEmail('');
		}
	}, [editClient]);

	const formSubmit = async (e) => {
		e.preventDefault();
		createClient(
			JSON.stringify({
				Name: name,
				Phone: phone,
				Email: email,
			})
		)
			.then(bind)
			.then(update);
	};

	const bind = async (clientId) => {
		bindClient(
			JSON.stringify({
				AddressId: props.addressId,
				ClientId: clientId.id,
			})
		);
		props.setActive(false);
		setName('');
		setPhone('');
		setEmail('');
	};

	const onChangeName = (e) => {
		setName(e.target.value);
	};

	const onChangePhone = (e) => {
		setPhone(e.target.value);
	};

	const onChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const onChangeClient = (e) => {
		delClient(editClient.bindId);
		formSubmit(e);
	};

	return (
		<form className="client-form" onSubmit={formSubmit} action="">
			<div className="form-inputs">
				<input className="client-form__input" onChange={onChangeName} value={name} type="text" placeholder="ФИО" />
				<input
					className="client-form__input"
					onChange={onChangePhone}
					value={phone}
					required
					type="text"
					placeholder="Телефон"
					pattern="\+?[0-9\s\-\(\)]+"
				/>
				<input className="client-form__input" onChange={onChangeEmail} value={email} type="email" placeholder="E-mail" />
			</div>
			{!editClient ? <button className="client-form__button">Привязать к этой квартире</button> : null}
			{editClient ? (
				<button className="client-form__button" onClick={editClient.phone !== phone ? onChangeClient : formSubmit}>
					Изменить
				</button>
			) : null}
		</form>
	);
};

export default Form;
