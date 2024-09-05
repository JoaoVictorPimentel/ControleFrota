<script>
import axios from 'axios';
import AlertComponent from '../../components/AlertComponent.vue';
import InputContainer from '../../components/InputContainer.vue';
import ModalComponent from '../../components/ModalComponent.vue';
import TabelaComponent from '../../components/TabelaComponent.vue';
import DashboardComponent from '../dashboard/DashboardComponent.vue';

export default {
    components: { DashboardComponent, TabelaComponent, ModalComponent, InputContainer, AlertComponent },
    name: 'VeiculosComponent',

    data() {
        return {
            veiculos: [],
            colunas: ['placa', 'modelo', 'marca', 'km_total'],
            urlBase: 'http://localhost:8000/api/veiculos',

            placaVeiculo: '',
            modeloVeiculo: '',
            marcaVeiculo: '',
            kmVeiculo: '',

            cadastroStatus: '',
            cadastroDetalhes: {},

            form: {
                placa: null,
                modelo: null,
                marca: null,
                km_total: null,
            },
        }
    },
    mounted() {
        this.getVeiculos()
    },
    methods: {
        async getVeiculos() {
            try {
                let response = await axios.get(this.urlBase)
                this.veiculos = response.data
            } catch (error) {
                return alert(
                    "Erro ao buscar veículos! Atualize a página ou tente novamente mais tarde."
                );
            }
        },

        async salvar() {
            let params = new URLSearchParams();
            params.append('placa', this.placaVeiculo)
            params.append('modelo', this.modeloVeiculo)
            params.append('marca', this.marcaVeiculo)
            params.append('km_total', this.kmVeiculo)

            let config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                }
            }

            try {
                let response = await axios.post(this.urlBase, params, config);

                this.cadastroStatus = 'sucesso';
                this.cadastroDetalhes = {
                    mensagem: 'ID do registro: ' + response.data.id
                };

                this.getVeiculos()
                this.limparCamposAdd()
            } catch (errors) {
                this.cadastroStatus = 'erro';
                this.cadastroDetalhes = {
                    mensagem: errors.response.data.message || 'Erro desconhecido',
                    listarErros: errors.response.data.errors || []
                };
            }
        },

        async remover() {
            let confirmacao = confirm('Tem certeza que deseja remover esse veículo?')

            if(!confirmacao) {return false}
            
            let params = new URLSearchParams()
            params.append('_method', 'delete')

            let config = {
                headers: {
                    'Accept': 'application/json',
                }
            }

            let url = this.urlBase + '/' + this.form.id
            
            try {
                await axios.post(url, params, config)

                this.cadastroStatus = 'sucesso';
                
                this.getVeiculos()
            } catch(errors) {
                return alert('Erro ao remover veiculo!')
            }   
        },

        async atualizar() {
            let params = new URLSearchParams()
            params.append('_method', 'patch')
            params.append('placa', this.form.placa)
            params.append('modelo', this.form.modelo)
            params.append('marca', this.form.marca)
            params.append('km_total', this.form.km_total)

            let config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                }
            }

            let url = this.urlBase + '/' + this.form.id

            try {
                await axios.post(url, params, config)

                this.cadastroStatus = 'sucesso';

                this.getVeiculos()
            } catch (errors) {
                this.cadastroStatus = 'erro';
                this.cadastroDetalhes = {
                    mensagem: errors.response.data.message || 'Erro desconhecido',
                    listarErros: errors.response.data.errors || []
                };
            }
        },  

        limparCampos() {
            this.placaVeiculo = ''
            this.modeloVeiculo = ''
            this.marcaVeiculo = ''
            this.kmVeiculo = ''
            this.cadastroStatus = ''
            this.cadastroDetalhes = {}
        },

        limparCamposAdd() {
            this.placaVeiculo = ''
            this.modeloVeiculo = ''
            this.marcaVeiculo = ''
            this.kmVeiculo = ''
        },

        handleSelectItem(item) {
            this.form = { ...item };

            this.cadastroStatus = null;
            this.cadastroDetalhes = {};
        },
    }
}
</script>

<template>
    <dashboard-component>
        <template v-slot:pagina>
            <div class="conteudo">
                <header class="titulo-pagina">
                    <h1>Veículos</h1>
                </header>

                <div class="mt-5 tabela">
                    <div class="d-flex justify-content-between">
                        <div class="row g-3">
                            <div class="col mb-3">
                                <input-container id="inputId" id-help="idHelp">
                                    <input type="number" class="form-control" id="inputId" aria-describedby="idHelp"
                                        placeholder="ID">
                                </input-container>
                            </div>
                            <div class="col mb-3">
                                <input-container id="inputNome" id-help="nomeHelp">
                                    <input type="text" class="form-control" id="inputNome" aria-describedby="nomeHelp"
                                        placeholder="Nome">
                                </input-container>
                            </div>
                            <div class="pesquisar">
                                <button type="submit" @click="pesquisar"
                                class="btn btn-secondary"><i class="fa fa-search"/></button>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                            data-bs-target="#modalVeiculos" @click.prevent="limparCampos">
                            Adicionar</button>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <tabela-component :descricao="'Veiculos'" :dados="veiculos" :colunas="colunas">
                                <template v-slot:default="{ item }">
                                    <button class="btn btn-outline-secondary edit" style="margin-right: 6px;" data-bs-toggle="modal"
                                        data-bs-target="#modalAtualizarVeiculo" @click="handleSelectItem(item)">
                                        Editar
                                    </button>

                                    <button data-bs-toggle="modal" data-bs-target="#modalRemoverVeiculo"
                                        class="btn btn-outline-danger" @click="handleSelectItem(item)">
                                        Excluir
                                    </button>
                                </template>
                            </tabela-component>
                        </div>
                    </div>
                </div>

                <!-- Remover Veiculo -->
                <modal-component id="modalVeiculos" titulo="Cadastrar Veículo">
                    <template v-slot:alertas>
                        <alert-component tipo="success" titulo="Cadastro realizado com sucesso!"
                            v-if="cadastroStatus == 'sucesso'" :detalhes="cadastroDetalhes"></alert-component>
                        <alert-component tipo="danger" titulo="Erro no cadastro!" :detalhes="cadastroDetalhes"
                            v-if="cadastroStatus == 'erro'"></alert-component>
                    </template>

                    <template v-slot:conteudo>
                        <div class="form-group mb-3">
                            <input-container titulo="Placa do veículo" id="novoPlaca" id-help="novoPlacaHelp"
                                texto-ajuda="Informe a placa do veículo!">
                                <input type="text" class="form-control" id="novoPlaca" aria-describedby="novoNomeHelp"
                                    placeholder="Placa" v-model="placaVeiculo">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Modelo do veículo" id="novoModelo" id-help="novoModeloHelp"
                                texto-ajuda="Informe o modelo do veículo!">
                                <input type="text" class="form-control" id="novoModelo" aria-describedby="novoModeloHelp"
                                    placeholder="Modelo" v-model="modeloVeiculo">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Marca" id="novoMarca" id-help="novoMarcaHelp"
                                texto-ajuda="Informe a marca do veículo!">
                                <input type="text" class="form-control" id="novoMarca" aria-describedby="novoMarcaHelp"
                                    placeholder="Marca" v-model="marcaVeiculo">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Quilometragem" id="novoKM" id-help="novoKmHelp"
                                texto-ajuda="Informe a quilometragem do veículo!">
                                <input type="text" class="form-control" id="novoKm" aria-describedby="novoKmHelp"
                                    placeholder="KM" v-model="kmVeiculo">
                            </input-container>
                        </div>
                    </template>

                    <template v-slot:rodape>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" @click="salvar">Salvar</button>
                    </template>
                </modal-component>

                <!-- Remover Veiculo --> 
                <modal-component id="modalRemoverVeiculo" titulo="Remover Motoristas">
                    <template v-slot:alertas>
                        <alert-component tipo="success" titulo="Motorista removido com sucesso!"
                            v-if="cadastroStatus == 'sucesso'" :detalhes="cadastroDetalhes"></alert-component>
                        <alert-component tipo="danger" titulo="Erro no cadastro!" :detalhes="cadastroDetalhes"
                            v-if="cadastroStatus == 'erro'"></alert-component>
                    </template>

                    <template v-slot:conteudo>
                        <div class="form-group mb-3">
                            <input-container titulo="ID">
                                    <input type="text" class="form-control" :value="this.form.id" disabled>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Placa do veículo">
                                    <input type="text" class="form-control" :value="this.form.placa" disabled>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Modelo">
                                    <input type="text" class="form-control" :value="this.form.modelo" disabled>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Marca">
                                    <input type="text" class="form-control" :value="this.form.marca" disabled>
                            </input-container>
                        </div>
                    </template>

                    <template v-slot:rodape>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-danger" @click="remover">Remover</button>
                    </template>
                </modal-component>

                <!-- Atualizar veiculo -->
                <modal-component id="modalAtualizarVeiculo" titulo="Atualizar Veiculo">
                    <template v-slot:alertas>
                        <alert-component tipo="success" titulo="Atualização realizada com sucesso!"
                            v-if="cadastroStatus == 'sucesso'" :detalhes="cadastroDetalhes"></alert-component>
                        <alert-component tipo="danger" titulo="Erro no cadastro!" :detalhes="cadastroDetalhes"
                            v-if="cadastroStatus == 'erro'"></alert-component>
                    </template>

                    <template v-slot:conteudo>
                        <div class="form-group mb-3">
                            <input-container titulo="ID">
                                <input type="text" class="form-control" :value="form.id" disabled>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Placa do veículo" id="atualizarPlaca" id-help="atualizarPlacaHelp"
                                texto-ajuda="Informe a placa do veículo!">
                                <input type="text" class="form-control" id="atualizarPlaca" aria-describedby="atualizarPlacaHelp"
                                    placeholder="Placa" v-model="form.placa">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Modelo" id="atualizarModelo" id-help="atualizarModeloHelp"
                                texto-ajuda="Informe o modelo do veículo!">
                                <input type="text" class="form-control" id="atualizarModelo" aria-describedby="atualizarModeloHelp"
                                    placeholder="Modelo" v-model="form.modelo">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Marca" id="atualizarMarca" id-help="atualizarMarcaHelp"
                                texto-ajuda="Informe a marca do veículo!">
                                <input type="text" class="form-control" id="atualizarMarca" aria-describedby="atualizarMarcaHelp"
                                    placeholder="Marca" v-model="form.marca">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Quilometragem" id="atualizarKm" id-help="atualizarKmHelp"
                                texto-ajuda="Informe a quilometragem do veículo!">
                                <input type="text" class="form-control" id="atualizarKm" aria-describedby="atualizarKmHelp"
                                    placeholder="Quilometragem total" v-model="form.km_total">
                            </input-container>
                        </div>    
                    </template>

                    <template v-slot:rodape>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" @click="atualizar">Atualizar</button>
                    </template>
                </modal-component>
            </div>
        </template>
    </dashboard-component>
</template>

<style src="./style.css" scoped />
