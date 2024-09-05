<script>
import axios from 'axios';
import CardComponent from '../../components/CardComponent.vue';
import DashboardComponent from '../dashboard/DashboardComponent.vue';

export default {
    components: { DashboardComponent, CardComponent },
    name: 'HomeComponent',

    data() {
        return {
            motoristas: [],
            veiculos: [],
            deslocamentos: [],
        }
    },
    mounted() {
        this.getMotoristas()
        this.getVeiculos()
        this.getDeslocamentos()
    },
    methods: {
        async getMotoristas() {
            let response = await axios.get('http://localhost:8000/api/motoristas')
            this.motoristas = response.data
        },
        async getVeiculos() {
            let response = await axios.get('http://localhost:8000/api/veiculos')
            this.veiculos = response.data
        },
        async getDeslocamentos() {
            let response = await axios.get('http://localhost:8000/api/deslocamentos')
            this.deslocamentos = response.data
        }
    }
}
</script>

<template>
    <dashboard-component>
        <template v-slot:pagina>
            <div class="conteudo">
                <header class="titulo-pagina">
                    <h1>Inicio</h1>
                </header>

                <div class="cards">
                    <div class="row">
                        <div class="col-12 col-md-4">
                            <card-component :tipo="'Motoristas'" :icone="'fa fa-user'" :qtd="motoristas.length" />
                        </div>
                        <div class="col-12 col-md-4">
                            <card-component :tipo="'Veículos'" :icone="'fa-solid fa-car'" :qtd="veiculos.length" />
                        </div>
                        <div class="col-12 col-md-4">
                            <card-component :tipo="'Deslocamentos'" :icone="'fa-solid fa-person-walking-arrow-right'"
                                :qtd="deslocamentos.length" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </dashboard-component>
</template>

<style src="./style.css" scoped />
