<script>
import axios from 'axios';
import AlertComponent from '../../components/AlertComponent.vue';
import InputContainer from '../../components/InputContainer.vue';
import ModalComponent from '../../components/ModalComponent.vue';
import TabelaComponent from '../../components/TabelaComponent.vue';
import DashboardComponent from '../dashboard/DashboardComponent.vue';

export default {
    components: { DashboardComponent, TabelaComponent, ModalComponent, InputContainer, AlertComponent },
    name: 'DeslocamentosComponent',

    data() {
        return {
            deslocamentos: [],
            motoristas: [],
            veiculos: [],
            colunas: ['motorista', 'veiculo', 'dt_saida', 'dt_chegada', 'km_saida', 'km_chegada'],
            urlBase: 'http://localhost:8000/api/deslocamentos',

            motoristaId: '',
            veiculoId: '',
            dataSaida: '',
            dataChegada: '',
            kmSaida: '',
            kmChegada: '',

            cadastroStatus: '',
            cadastroDetalhes: {},

            form: {
                motorista_id: null,
                veiculo_id: null,
                dt_saida: null,
                dt_chegada: null,
                km_saida: null,
                km_chegada: null,
            },
        }
    },
    mounted() {
        this.getDeslocamentos()
        this.getMotoristas()
        this.getVeiculos()
    },
    methods: {
        async getDeslocamentos() {
            try {
                let response = await axios.get(this.urlBase)

                this.deslocamentos = response.data
            } catch (error) {
                return alert(
                    "Erro ao buscar deslocamentos! Atualize a página ou tente novamente mais tarde."
                );
            }
        },
        async getMotoristas() {
            try {
                let response = await axios.get('http://localhost:8000/api/motoristas');
                this.motoristas = response.data;
            } catch (error) {
                console.error('Erro ao buscar motoristas:', error);
            }
        },
        async getVeiculos() {
            try {
                let response = await axios.get('http://localhost:8000/api/veiculos');
                this.veiculos = response.data;
            } catch (error) {
                console.error('Erro ao buscar veículos:', error);
            }
        },

        async salvar() {
            let params = new URLSearchParams();
            params.append('motorista_id', this.motoristaId)
            params.append('veiculo_id', this.veiculoId)
            params.append('dt_saida', this.dataSaida)
            params.append('dt_chegada', this.dataChegada)
            params.append('km_saida', this.kmSaida)
            params.append('km_chegada', this.kmChegada)

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

                this.getDeslocamentos()
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
            let confirmacao = confirm('Tem certeza que deseja remover esse deslocamento?')

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

                this.getDeslocamentos()
            } catch(errors) {
                return alert('Erro ao remover deslocamento!')
            }   
        },

        async atualizar() {
            let params = new URLSearchParams()
            params.append('_method', 'patch')
            params.append('motorista_id', this.form.motorista_id)
            params.append('veiculo_id', this.form.veiculo_id)
            params.append('dt_saida', this.form.dt_saida)
            params.append('dt_chegada', this.form.dt_chegada)
            params.append('km_saida', this.form.km_saida)
            params.append('km_chegada', this.form.km_chegada)


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

                this.getDeslocamentos()
                this.cadastroDetalhes = {}
            } catch (errors) {
                this.cadastroStatus = 'erro';
                this.cadastroDetalhes = {
                    mensagem: errors.response.data.message || 'Erro desconhecido',
                    listarErros: errors.response.data.errors || []
                };
            }
        },  

        limparCampos() {
            this.cadastroStatus = ''
            this.cadastroDetalhes = {}
        },

        limparCamposAdd() {
            this.motoristaId = ''
            this.veiculoId = ''
            this.dataSaida = ''
            this.dataChegada = ''
            this.kmSaida = ''
            this.kmChegada = ''
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
                    <h1>Deslocamentos</h1>
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
                                <button type="submit" class="btn btn-secondary"><i class="fa fa-search" /></button>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                            data-bs-target="#modalDeslocamentos" @click.prevent="limparCampos">
                            Adicionar</button>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <tabela-component :descricao="'Deslocamentos'" :dados="deslocamentos" :colunas="colunas">
                                <template v-slot:default="{ item }">
                                    <button class="btn btn-outline-secondary edit" style="margin-right: 6px;" data-bs-toggle="modal"
                                        data-bs-target="#modalAtualizarDeslocamento" @click="handleSelectItem(item)">
                                        Editar
                                    </button>

                                    <button data-bs-toggle="modal" data-bs-target="#modalRemoverDeslocamento"
                                        class="btn btn-outline-danger" @click="handleSelectItem(item)">
                                        Excluir
                                    </button>
                                </template>
                            </tabela-component>
                        </div>
                    </div>
                </div>

                <!-- Adicionar deslocamento -->
                <modal-component id="modalDeslocamentos" titulo="Cadastrar Deslocamentos">
                    <template v-slot:alertas>
                        <alert-component tipo="success" titulo="Cadastro realizado com sucesso!"
                            v-if="cadastroStatus == 'sucesso'" :detalhes="cadastroDetalhes"></alert-component>
                        <alert-component tipo="danger" titulo="Erro no cadastro!" :detalhes="cadastroDetalhes"
                            v-if="cadastroStatus == 'erro'"></alert-component>
                    </template>

                    <template v-slot:conteudo>
                        <div class="form-group mb-3">
                            <input-container titulo="Motorista" id="novoMotorista" id-help="novoMotoristaHelp"
                                texto-ajuda="Selecione o motorista!">
                                <select class="form-select" id="novoMotorista" aria-describedby="novoMotoristaHelp"
                                    v-model="motoristaId">
                                    <option value="" disabled selected>Selecione o motorista</option>
                                    <option v-for="motorista in motoristas" :key="motorista.id" :value="motorista.id">
                                        {{ motorista.nome }}
                                    </option>
                                </select>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Veículo" id="novoVeiculo" id-help="novoVeiculoHelp"
                                texto-ajuda="Selecione o veículo!">
                                <select class="form-select" id="novoVeiculo" aria-describedby="novoVeiculoHelp"
                                    v-model="veiculoId">
                                    <option value="" disabled selected>Selecione o veículo</option>
                                    <option v-for="veiculo in veiculos" :key="veiculo.id" :value="veiculo.id">
                                        {{ veiculo.id }}
                                    </option>
                                </select>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Data de saida" id="novoDataSaida" id-help="novoDataSaidaHelp"
                                texto-ajuda="Informe a data de saída!">
                                <input type="date" class="form-control" id="novoDataSaida"
                                    aria-describedby="novoDataSaidaHelp" v-model="dataSaida">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Data de chegada" id="novoDataChegada" id-help="novoDataChegadaHelp"
                                texto-ajuda="Informe a data de chegada!">
                                <input type="date" class="form-control" id="novoDataChegada"
                                    aria-describedby="novoDataChegadaHelp" v-model="dataChegada">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Quilometragem de saida" id="novoKmSaida" id-help="novoKmSaidaHelp"
                                texto-ajuda="Informe a quilometragem de saida do veículo!">
                                <input type="text" class="form-control" id="novoKmSaida"
                                    aria-describedby="novoKmSaidaHelp" placeholder="KM" v-model="kmSaida">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Quilometragem de chegada" id="novoKmChegada"
                                id-help="novoKmChegadaHelp"
                                texto-ajuda="Informe a quilometragem de chegada do veículo!">
                                <input type="text" class="form-control" id="novoKmChegada"
                                    aria-describedby="novoKmChegadaHelp" placeholder="KM" v-model="kmChegada">
                            </input-container>
                        </div>
                    </template>

                    <template v-slot:rodape>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" @click="salvar">Salvar</button>
                    </template>
                </modal-component>

                <!-- Remover deslocamento -->
                <modal-component id="modalRemoverDeslocamento" titulo="Remover Deslocamentos">
                    <template v-slot:alertas>
                        <alert-component tipo="success" titulo="Deslocamento removido com sucesso!"
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
                            <input-container titulo="Motorista">
                                    <input type="text" class="form-control" :value="form.motorista" disabled>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Veiculo">
                                    <input type="text" class="form-control" :value="form.veiculo" disabled>
                            </input-container>
                        </div>
                    </template>

                    <template v-slot:rodape>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-danger" @click="remover">Remover</button>
                    </template>
                </modal-component>

                <!-- Atualizar deslocamento -->
                <modal-component id="modalAtualizarDeslocamento" titulo="Atualizar Deslocamento">
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
                            <input-container titulo="Motorista" id="novoMotorista" id-help="novoMotoristaHelp"
                                texto-ajuda="Selecione o motorista!">
                                <select class="form-select" id="novoMotorista" aria-describedby="novoMotoristaHelp"
                                    v-model="form.motorista_id">
                                    <option value="" disabled selected>Selecione o motorista</option>
                                    <option v-for="motorista in motoristas" :key="motorista.id" :value="motorista.id">
                                        {{ motorista.nome }}
                                    </option>
                                </select>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Veículo" id="novoVeiculo" id-help="novoVeiculoHelp"
                                texto-ajuda="Selecione o veículo!">
                                <select class="form-select" id="novoVeiculo" aria-describedby="novoVeiculoHelp"
                                    v-model="form.veiculo_id">
                                    <option value="" disabled selected>Selecione o veículo</option>
                                    <option v-for="veiculo in veiculos" :key="veiculo.id" :value="veiculo.id">
                                        ID: {{ veiculo.id }} - Placa ({{ veiculo.placa }})
                                    </option>
                                </select>
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Data de saida" id="atualizarDataSaida"
                                id-help="atualizarDataSaidaHelp"
                                texto-ajuda="Informe a data de saida!">
                                <input type="date" class="form-control" id="atualizarDataSaida"
                                    aria-describedby="atualizarDataSaidaHelp" v-model="form.dt_saida">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Data de chegada" id="atualizarDataChegada"
                                id-help="atualizarDataChegadaHelp"
                                texto-ajuda="Informe a data de chegada!">
                                <input type="date" class="form-control" id="atualizarDataChegada"
                                    aria-describedby="atualizarDataChegadaHelp" v-model="form.dt_chegada">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Quilometragem de saída" id="atualizarKm" id-help="atualizarKmHelp"
                                texto-ajuda="Informe a quilometragem de saida!">
                                <input type="text" class="form-control" id="atualizarKm" aria-describedby="atualizarKmHelp"
                                    placeholder="KM" v-model="form.km_saida">
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Quilometragem de chegada" id="atualizarKm" id-help="atualizarKmHelp"
                                texto-ajuda="Informe a quilometragem de chegada!">
                                <input type="text" class="form-control" id="atualizarKm" aria-describedby="atualizarKmHelp"
                                    placeholder="KM" v-model="form.km_chegada">
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
