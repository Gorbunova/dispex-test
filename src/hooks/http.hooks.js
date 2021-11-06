//States
import { useState, useCallback } from 'react';

export const useHttp = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const request = useCallback(async (url, method = 'GET', body = null, headers = { 'Content-type': 'application/json' }) => {
		setLoading(true);

		try {
			const response = await fetch(url, { method, body, headers });
			if (!response.ok) {
				throw new Error(`Could now fetch ${url}, status: ${response.status}`);
			}
			setLoading(false);
			if (response.status === 204) return [];
			if (method === 'DELETE' || method === 'PUT') return response;
			const data = await response.json();
			return data;
		} catch (e) {
			setLoading(false);
			setError(e.message);
			throw e;
		}
	}, []);

	const requestPeople = useCallback(async (url, method = 'GET', body = null, headers = { 'Content-type': 'application/json' }) => {
		setLoading(true);

		try {
			const response = await fetch(url, { method, body, headers });
			if (!response.ok) {
				throw new Error(`Could now fetch ${url}, status: ${response.status}`);
			}
			const data = await response;
			setLoading(false);
			return data;
		} catch (e) {
			setLoading(false);
			setError(e.message);
			throw e;
		}
	}, []);

	const requestPost = useCallback(async (url, body, method = 'POST', headers = { 'Content-type': 'application/json' }) => {
		setLoading(true);

		try {
			const response = await fetch(url, { method, body, headers });
			if (!response.ok) {
				throw new Error(`Could now fetch ${url}, status: ${response.status}`);
			}
			const data = await response.json();
			setLoading(false);
			return data;
		} catch (e) {
			setLoading(false);
			setError(e.message);
			throw e;
		}
	}, []);

	const requestPut = useCallback(async (url, body, method = 'PUT', headers = { 'Content-type': 'application/json' }) => {
		setLoading(true);

		try {
			const response = await fetch(url, { method, body, headers });
			if (!response.ok) {
				throw new Error(`Could now fetch ${url}, status: ${response.status}`);
			}
			const data = response;
			setLoading(false);
			return data;
		} catch (e) {
			setLoading(false);
			setError(e.message);
			throw e;
		}
	}, []);

	const clearError = useCallback(() => setError(null), []);
	return { loading, request, error, clearError, requestPost, requestPut, requestPeople };
};
