<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'LoginComponent',
    data() {
        return {
            email: '',
            password: '',
        }
    },
    setup() {
        const router = useRouter();
        return { router } ;
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:8000/api/login', {
                    email: this.email,
                    password: this.password
                });

                if(response.data.token) {
                    const token = response.data.token;
                    localStorage.setItem('token', token);
    
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    this.router.push({ name: 'home' });
                }

                if(response.data.erro){
                    alert(response.data.erro);
                }

            } catch (error) {
                alert('Usuário ou senha incorretos!')
            }
        }
    },
}
</script>

<template>
    <div class="main">
        <div class="box-login">
            <header>
                <h1>Login</h1>
            </header>

            <div class="form">
                <form @submit.prevent="login()">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" type="email" class="form-control" name="email" required autocomplete="email" autofocus v-model="email">
                    </div>
                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input id="password" type="password" class="form-control" name="password" required autocomplete="current-password" v-model="password">
                    </div>

                    <div class="links">
                        <label for="">
                            <input type="checkbox" name="" id="">
                            Lembrar senha
                        </label>
                        <a href="">Esqueceu sua senha?</a>
                    </div>

                    <button type="submit" class="btn btn-primary">Entrar</button>
                </form>
            </div>
        </div>
    </div>
</template>


<style src="./style.css" scoped />