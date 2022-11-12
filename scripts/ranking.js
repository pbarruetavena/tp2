
ranking = storage.carregarRanking();
let rankingEl = [];
let quantidade_registros = 10;

function cria_elemento_registro(registro) {

    let posicao = ranking.indexOf(registro) + 1;

    let novo_registro_el = document.createElement('article');
    novo_registro_el.classList.add('celula-ranking');

    let prgf_posicaoEl = document.createElement('p');
    prgf_posicaoEl.classList.add('posicao-ranking');
    prgf_posicaoEl.innerHTML = '#' + posicao;
    novo_registro_el.appendChild(prgf_posicaoEl);

    let prgf_pontuacaoEl = document.createElement('p');
    prgf_pontuacaoEl.classList.add('pontuacao-ranking');
    prgf_pontuacaoEl.innerHTML = registro.pontuacao + ' pts';
    novo_registro_el.appendChild(prgf_pontuacaoEl);


    let container_perfil_rank = document.createElement('div');
    container_perfil_rank.classList.add('perfil-ranking');

    let prgf_nome_perfil = document.createElement('p');
    prgf_nome_perfil.innerHTML = perfis[registro.usuario].nome;
    container_perfil_rank.appendChild(prgf_nome_perfil);

    let img_perfil = document.createElement('img');
    img_perfil.src = 'imagens/' + perfis[registro.usuario].imagem;
    container_perfil_rank.appendChild(img_perfil);

    novo_registro_el.appendChild(container_perfil_rank);

    document.querySelector('#container-ranking').appendChild(novo_registro_el);
    rankingEl.push(novo_registro_el);
}

for(let i = 0; i < ranking.length && i < 10; i++){
    cria_elemento_registro(ranking[i]);
}

$('#expandir-minimizar-ranking').click(() => {
    for(let el of rankingEl){
        el.remove();
    }
    quantidade_registros+=10;
    rankingEl = [];
    for(let i = 0; i < ranking.length && i < quantidade_registros; i++){
        cria_elemento_registro(ranking[i]);
    }
});


let metodo_teste = {
    adiciona_registro_obj: function(user, pont) {
        ranking.push({
            usuario: user,
            pontuacao: pont
        });
    },
    adiciona_x_registro_obj: function(x, user, pont) {
        for(let i = 0; i < x; i++){
            ranking.push({
                usuario: user,
                pontuacao: pont
            });
        }
    } 
}