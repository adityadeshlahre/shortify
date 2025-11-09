import axios from "axios";

const axiosinstance = axios.create({
	baseURL: "https://api.spotify.com/v1",
	timeout: 10000,
});

axiosinstance.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosinstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default axiosinstance;
