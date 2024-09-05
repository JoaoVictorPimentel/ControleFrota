<script>
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
    name: 'DashboardComponent',
    setup() {
        const router = useRoute();
        return { router };
    },
    methods: {
        async logout() {
            try {
                const response = await axios.post('http://localhost:8000/api/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                this.$router.push({ name: 'login' });
            } catch (error) {
                alert('Erro ao deslogar!');
            }
        }
    }
}
</script>

<template>
    <div class="main">
        <div class="sidebar">
            <div class="top">
                <div class="avatar">
                    <span><i class="fa fa-user" /></span>
                </div>

                <div class="info">
                    <p class="name">João Victor</p>
                </div>
            </div>

            <div class="menu">
                <ul>
                    <li>
                        <router-link :to="{ name: 'home' }"><i class="fa fa-home" aria-hidden="true" />
                            Início</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'motoristas'}"><i class="fa fa-user" aria-hidden="true" />
                            Motoristas</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'veiculos'}"><i class="fa-solid fa-car" aria-hidden="true" />
                                Veículos
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'deslocamentos'}"><i class="fa-solid fa-person-walking-arrow-right" aria-hidden="true" />
                                Deslocamento
                        </router-link>
                    </li>
                    <li>
                        <i class="fa-solid fa-phone" aria-hidden="true" />
                            Suporte
                    </li>
                </ul>

                <div class="sair">
                    <hr>
                    <a @click="logout">
                        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                        Sair</a>
                </div>
            </div>
        </div>



        <div class="conteudo">
            <slot name="pagina"></slot>
        </div>
    </div>
</template>

<style src="./style.css" scoped />