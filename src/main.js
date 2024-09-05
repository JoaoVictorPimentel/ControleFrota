import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import axios from 'axios';
import 'bootstrap';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App.vue';
import { getToken, isAuthenticated } from './services/auth';
import './style.css';

// Componentes
import DeslocamentosComponent from './pages/deslocamentos/DeslocamentosComponent.vue';
import HomeComponent from './pages/home/HomeComponent.vue';
import LoginComponent from './pages/login/LoginComponent.vue';
import MotoristasComponent from './pages/motoristas/MotoristasComponent.vue';
import VeiculosComponent from './pages/veiculos/VeiculosComponent.vue';

const routes = [
    { path: '/', name: 'login', component: LoginComponent },
    { 
        path: '/home', 
        name: 'home', 
        component: HomeComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/motoristas', 
        name: 'motoristas', 
        component: MotoristasComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/veiculos', 
        name: 'veiculos', 
        component: VeiculosComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/deslocamentos', 
        name: 'deslocamentos', 
        component: DeslocamentosComponent,
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated()) {
            next({ name: 'login' });
        } else {
            next();
        }
    } else {
        next();
    }
});

const token = getToken();
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const app = createApp(App);
app.use(router);
app.mount('#app');
