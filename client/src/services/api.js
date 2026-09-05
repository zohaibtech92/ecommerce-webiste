import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',headers:{'Content-Type':'application/json'}});
api.interceptors.request.use(config=>{try{const raw=localStorage.getItem('userInfo');const user=raw?JSON.parse(raw):null;if(user?.token)config.headers.Authorization=`Bearer ${user.token}`;}catch{localStorage.removeItem('userInfo');}return config;});
export default api;
