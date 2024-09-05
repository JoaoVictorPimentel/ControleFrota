<script>
import axios from "axios";
import AlertComponent from "../../components/AlertComponent.vue";
import InputContainer from "../../components/InputContainer.vue";
import ModalComponent from "../../components/ModalComponent.vue";
import TabelaComponent from "../../components/TabelaComponent.vue";
import DashboardComponent from "../dashboard/DashboardComponent.vue";

export default {
    components: {
        DashboardComponent,
        TabelaComponent,
        ModalComponent,
        InputContainer,
        AlertComponent,
    },
    name: "MotoristasComponent",

    data() {
        return {
            motoristas: [],
            colunas: ["nome", "cpf", "cnh", "dt_nascimento", "dt_vencimento_cnh"],
            urlBase: "http://localhost:8000/api/motoristas",

            nomeMotorista: "",
            cpfMotorista: "",
            cnhMotorista: "",
            dataNascimentoMotorista: "",
            vencimentoCnhMotorista: "",

            cadastroStatus: "",
            cadastroDetalhes: {},

            form: {
                nome: null,
                cpf: null,
                cnh: null,
                dt_nascimento: null,
                dt_vencimento_cnh: null,
            },
        };
    },
    mounted() {
        this.getMotoristas();
    },
    methods: {
        async getMotoristas() {
            try {
                let response = await axios.get(this.urlBase);
                this.motoristas = response.data;
                console.log(this.motoristas);
            } catch (error) {
                return alert(
                    "Erro ao buscar motoristas! Atualize a página ou tente novamente mais tarde."
                );
            }
        },

        async salvar() {
            let params = new URLSearchParams();
            params.append("nome", this.nomeMotorista);
            params.append("cpf", this.cpfMotorista);
            params.append("cnh", this.cnhMotorista);
            params.append("dt_nascimento", this.dataNascimentoMotorista);
            params.append("dt_vencimento_cnh", this.vencimentoCnhMotorista);

            let config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
            };

            try {
                let response = await axios.post(this.urlBase, params, config);

                this.cadastroStatus = "sucesso";
                this.cadastroDetalhes = {
                    mensagem: "ID do registro: " + response.data.id,
                };

                this.getMotoristas();
                this.limparCamposAdd();
            } catch (errors) {
                this.cadastroStatus = "erro";
                this.cadastroDetalhes = {
                    mensagem: errors.response.data.message || "Erro desconhecido",
                    listarErros: errors.response.data.errors || [],
                };
            }
        },

        async remover() {
            let confirmacao = confirm(
                "Tem certeza que deseja remover esse motorista?"
            );

            if (!confirmacao) {
                return false;
            }

            let params = new URLSearchParams();
            params.append("_method", "delete");

            let config = {
                headers: {
                    Accept: "application/json",
                },
            };

            let url = this.urlBase + "/" + this.form.id;

            try {
                await axios.post(url, params, config);

                this.cadastroStatus = "sucesso";

                this.getMotoristas();
            } catch (errors) {
                return alert("Erro ao remover deslocamento!");
            }
        },

        async atualizar() {
            let params = new URLSearchParams();
            params.append("_method", "patch");
            params.append("nome", this.form.nome);
            params.append("cpf", this.form.cpf);
            params.append("cnh", this.form.cnh);
            params.append("dt_nascimento", this.form.dt_nascimento);
            params.append("dt_vencimento_cnh", this.form.dt_vencimento_cnh);

            let config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Accept': "application/json",
                },
            };

            let url = this.urlBase + '/' + this.form.id

            try {
                await axios.post(url, params, config);

                this.cadastroStatus = "sucesso";
                this.getMotoristas(); 
            } catch (errors) {
                this.cadastroStatus = "erro";
                this.cadastroDetalhes = {
                    mensagem: errors.response.data.message || "Erro desconhecido",
                    listarErros: errors.response.data.errors || [],
                };
            }
        },

        limparCampos() {
            this.nomeMotorista = "";
            this.cpfMotorista = "";
            this.cnhMotorista = "";
            this.dataNascimentoMotorista = "";
            this.vencimentoCnhMotorista = "";
            this.cadastroStatus = "";
            this.cadastroDetalhes = {};
        },

        limparCamposAdd() {
            this.nomeMotorista = "";
            this.cpfMotorista = "";
            this.cnhMotorista = "";
            this.dataNascimentoMotorista = "";
            this.vencimentoCnhMotorista = "";
        },

        handleSelectItem(item) {
            this.form = { ...item };

            this.cadastroStatus = null;
            this.cadastroDetalhes = {};
        },
    },
};
</script>

<template>
    <dashboard-component>
        <template v-slot:pagina>
            <div class="conteudo">
                <header class="titulo-pagina">
                    <h1>Motoristas</h1>
                </header>

                <div class="mt-5 tabela">
                    <div class="d-flex justify-content-between">
                        <div class="row g-3">
                            <div class="col mb-3">
                                <input-container id="inputId" id-help="idHelp">
                                    <input type="number" class="form-control" id="inputId" aria-describedby="idHelp"
                                        placeholder="ID" />
                                </input-container>
                            </div>
                            <div class="col mb-3">
                                <input-container id="inputNome" id-help="nomeHelp">
                                    <input type="text" class="form-control" id="inputNome" aria-describedby="nomeHelp"
                                        placeholder="Nome" />
                                </input-container>
                            </div>
                            <div class="pesquisar">
                                <button type="submit" class="btn btn-secondary">
                                    <i class="fa fa-search" />
                                </button>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                            data-bs-target="#modalMotorista" @click.prevent="limparCampos">
                            Adicionar
                        </button>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <tabela-component :descricao="'Motoristas'" :dados="motoristas" :colunas="colunas">
                                <template v-slot:default="{ item }">
                                    <button class="btn btn-outline-secondary edit" style="margin-right: 6px;" data-bs-toggle="modal"
                                        data-bs-target="#modalAtualizarMotorista" @click="handleSelectItem(item)">
                                        Editar
                                    </button>

                                    <button data-bs-toggle="modal" data-bs-target="#modalRemoverMotorista"
                                        class="btn btn-outline-danger" @click="handleSelectItem(item)">
                                        Excluir
                                    </button>
                                </template>
                            </tabela-component>
                        </div>
                    </div>
                </div>

                <!-- Adicionar motorista -->
                <modal-component id="modalMotorista" titulo="Cadastrar Motorista">
                    <template v-slot:alertas>
                        <alert-component tipo="success" titulo="Cadastro realizado com sucesso!"
                            v-if="cadastroStatus == 'sucesso'" :detalhes="cadastroDetalhes"></alert-component>
                        <alert-component tipo="danger" titulo="Erro no cadastro!" :detalhes="cadastroDetalhes"
                            v-if="cadastroStatus == 'erro'"></alert-component>
                    </template>

                    <template v-slot:conteudo>
                        <div class="form-group mb-3">
                            <input-container titulo="Nome do motorista" id="novoNome" id-help="novoNomeHelp"
                                texto-ajuda="Informe o nome da motorista!">
                                <input type="text" class="form-control" id="novoNome" aria-describedby="novoNomeHelp"
                                    placeholder="Nome" v-model="nomeMotorista" />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="CPF" id="novoCpf" id-help="novoCpfHelp"
                                texto-ajuda="Informe o CPF da motorista!">
                                <input type="text" class="form-control" id="novoCpf" aria-describedby="novoCpfHelp"
                                    placeholder="CPF" v-model="cpfMotorista" />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="CNH" id="novoCnh" id-help="novoCnhHelp"
                                texto-ajuda="Informe a CNH do motorista!">
                                <input type="text" class="form-control" id="novoCnh" aria-describedby="novoCnhHelp"
                                    placeholder="CNH" v-model="cnhMotorista" />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Data de nascimento" id="novoDataNascimento"
                                id-help="novoDataNascimentoHelp"
                                texto-ajuda="Informe a data de nascimento do motorista!">
                                <input type="date" class="form-control" id="novoDataNascimento"
                                    aria-describedby="novoDataNascimentoHelp" v-model="dataNascimentoMotorista" />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Vencimento da CNH" id="novoVencimentoCnh"
                                id-help="novoVencimentoCnhHelp"
                                texto-ajuda="Informe a data de nascimento do motorista!">
                                <input type="date" class="form-control" id="novoVencimentoCnh"
                                    aria-describedby="novoVencimentocnhHelp" v-model="vencimentoCnhMotorista" />
                            </input-container>
                        </div>
                    </template>

                    <template v-slot:rodape>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Fechar
                        </button>
                        <button type="button" class="btn btn-primary" @click="salvar">
                            Salvar
                        </button>
                    </template>
                </modal-component>

                <!-- Remover motorista -->
                <modal-component id="modalRemoverMotorista" titulo="Remover Motoristas">
                    <template v-slot:alertas>
                        <alert-component tipo="success" titulo="Motorista removido com sucesso!"
                            v-if="cadastroStatus == 'sucesso'" :detalhes="cadastroDetalhes"></alert-component>
                        <alert-component tipo="danger" titulo="Erro no cadastro!" :detalhes="cadastroDetalhes"
                            v-if="cadastroStatus == 'erro'"></alert-component>
                    </template>

                    <template v-slot:conteudo>
                        <div class="form-group mb-3">
                            <input-container titulo="ID">
                                <input type="text" class="form-control" :value="this.form.id" disabled />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Nome do motorista">
                                <input type="text" class="form-control" :value="this.form.nome" disabled />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="CPF">
                                <input type="text" class="form-control" :value="this.form.cpf" disabled />
                            </input-container>
                        </div>
                    </template>

                    <template v-slot:rodape>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Fechar
                        </button>
                        <button type="button" class="btn btn-danger" @click="remover">
                            Remover
                        </button>
                    </template>
                </modal-component>

                <!-- Atualizar motorista -->
                <modal-component id="modalAtualizarMotorista" titulo="Atualizar Motorista">
                    <template v-slot:alertas>
                        <alert-component tipo="success" titulo="Atualização realizada com sucesso!"
                            v-if="cadastroStatus == 'sucesso'" :detalhes="cadastroDetalhes"></alert-component>
                        <alert-component tipo="danger" titulo="Erro no cadastro!" :detalhes="cadastroDetalhes"
                            v-if="cadastroStatus == 'erro'"></alert-component>
                    </template>

                    <template v-slot:conteudo>
                        <div class="form-group mb-3">
                            <input-container titulo="ID">
                                <input type="text" class="form-control" :value="this.form.id" disabled />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Nome do motorista" texto-ajuda="Informe o nome da motorista!">
                                <input type="text" class="form-control" placeholder="Nome" v-model="form.nome" />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="CPF" id="atualizarCpf" id-help="atualizarCpfHelp"
                                texto-ajuda="Informe o CPF da motorista!">
                                <input type="text" class="form-control" id="atualizarCpf"
                                    aria-describedby="atualizarCpfHelp" placeholder="CPF" v-model="form.cpf" />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="CNH" id="atualizarCnh" id-help="atualizarCnhHelp"
                                texto-ajuda="Informe a CNH do motorista!">
                                <input type="text" class="form-control" id="atualizarCnh"
                                    aria-describedby="atualizarCnhHelp" placeholder="CNH" v-model="form.cnh" />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Data de nascimento" id="atualizarDataNascimento"
                                id-help="atualizarDataNascimentoHelp"
                                texto-ajuda="Informe a data de nascimento do motorista!">
                                <input type="date" class="form-control" id="atualizarDataNascimento"
                                    aria-describedby="atualizarDataNascimentoHelp" v-model="form.dt_nascimento" />
                            </input-container>
                        </div>
                        <div class="form-group mb-3">
                            <input-container titulo="Vencimento da CNH" id="atualizarVencimentoCnh"
                                id-help="atualizarVencimentoCnhHelp"
                                texto-ajuda="Informe a data de nascimento do motorista!">
                                <input type="date" class="form-control" id="atualizarVencimentoCnh"
                                    aria-describedby="atualizarVencimentoCnhHelp" v-model="form.dt_vencimento_cnh" />
                            </input-container>
                        </div>
                    </template>

                    <template v-slot:rodape>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Fechar
                        </button>
                        <button type="button" class="btn btn-primary" @click="atualizar">
                            Atualizar
                        </button>
                    </template>
                </modal-component>
            </div>
        </template>
    </dashboard-component>
</template>

<style src="./style.css" scoped />
