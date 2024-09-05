<script>
    export default {
        name: 'CardComponent',
        props: {
            tipo: String,
            icone: String,
            qtd: Number
        }
    }
</script>

<template>
    <div class="meu-card">
        <div class="topo">
            <h3>{{ tipo }}</h3>
        </div>

        <div class="footer">
            <i :class="['fa icone', icone]"/>
            <p class="qtd">{{ qtd }}</p>
        </div>
    </div>
</template>

<style scoped>
.meu-card {
    display: flex;
    flex-direction: column;
    background-color: #0C7489;
    padding: 15px;
    border-radius: 10px;
    color: white;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}

.topo{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
}

.footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
}

.icone {
    font-size: 30px;
}

.qtd {
    font-size: 25px;
}
</style>