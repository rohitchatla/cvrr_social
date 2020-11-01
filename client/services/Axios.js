import Axios from "axios";

const baseURL = "http://localhost:3000/api";
//const baseURL = "https://cvrrlearn.herokuapp.com/api";

Axios.defaults.baseURL = baseURL;

export default Axios;
export { baseURL }; //assetsURL
