$('#icone-pause').click(pause);
$('#icone-home').click(() => window.location.href = "../index.html");
$('#icone-resume').click(() => $('#pause-container').addClass('invisivel'));

inicializar();

function gera_int_exlusive(limite){
    return Math.floor(Math.random() * limite);
}

let cartasEl = document.querySelectorAll('.carta');
let cartas = [];
let cartasJogadorEl = document.querySelectorAll('#container-cartas-jogador .carta');
let estagioJogo = 0;
let quadro_jogo = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
let pontuacaoJogador = 0;


let displayResultado = document.querySelector('#display-res');

// iniciar pagina do jogo
let bots = [
    {img: 'user-spock.png', nome: 'Bot Spock'},
    {img: 'user-pedra.png', nome: 'Bot Pedra'},
    {img: 'user-papel.png', nome: 'Bot Papel'},
    {img: 'user-tesoura.png', nome: 'Bot Tesoura'},
    {img: 'user-lagarto.png', nome: 'Bot Lagarto'}
];

let nBot = gera_int_exlusive(5)
$('#container-dados-jogador img').attr("src", `../imagens/${perfis[perfilAtual].imagem}`);
document.querySelector('#nome-jogador').innerHTML = perfis[perfilAtual].nome;
$('#container-dados-bot img').attr("src", `../imagens/${bots[nBot].img}`);
document.querySelector('#nome-bot').innerHTML = bots[nBot].nome;


function jogadorVencedor(cartaJogador, valorJogador, cartaBot, valorBot){
    const playerVictory = 1;
    const botVictory = 0;

    if(valorJogador == 'A'){
        valorJogador = 1;
    }
    if(valorBot == 'A'){
        valorBot = 1;
    }

    /*  Caso ambos joguem a mesma carta avaliamos o maior valor numérico(considerando que
        não tem como ter exatamente a mesma carta)   */
    if(cartaJogador === cartaBot){
        if(valorBot > valorJogador)
            return botVictory;
        else
            return playerVictory;
    }
        

    //  'R' de rock(pedra em inglês)     
    if(cartaJogador === 'R'){
        if(cartaBot === 'S' || cartaBot === 'P')
            return botVictory;
        else
            return playerVictory;
    }
     
    //   Caso papel
    else if(cartaJogador === 'P'){
        if(cartaBot === 'T' || cartaBot === 'L')
            return botVictory;
        else
            return playerVictory;
    }

    //  Caso tesoura
    else if(cartaJogador === 'T'){
        if(cartaBot === 'R' || cartaBot === 'S')
            return botVictory;
        else
            return playerVictory;
    }

    //  Caso lagarto
    else if(cartaJogador === 'L'){
        if(cartaBot === 'R' || cartaBot === 'T')
            return botVictory;
        else
            return playerVictory;
    }

    //Último caso, se o jogador usar o Spock
    else{
        if(cartaBot === 'P' || cartaBot === 'L')
            return botVictory;
        else
            return playerVictory;
    }

}

function compara_carta(c1, c2){
    if(c1.valor == c2.valor){
        if(c1.naipe == c2.naipe){ return 1; }
    }
    return 0;
}

function embaralha_vet(){
    let naipes = ['R', 'P', 'T', 'L', 'S'];
    let valores = ['A', 2, 3, 4, 5, 6, 7];

    let naipe;
    let valor;

    let cartas_mao = [];

    for(let i = 0; i < 8; i++){

        let aux;
        while(true){
            aux = true;
            naipe = naipes[gera_int_exlusive(naipes.length)];
            valor = valores[gera_int_exlusive(valores.length)];
            let cartaObj = {
                naipe: naipe,
                valor: valor
            };

            for(let j = 0; j < cartas_mao.length; j++){
                if(compara_carta(cartaObj, cartas_mao[j])){
                    aux = false;
                    break;
                }
            }

            if(aux == true){
                cartas_mao.push(cartaObj);
                break;
            }
        }

    }
    
    return cartas_mao;
}

function da_carta(){
    cartas = embaralha_vet();

    for(let i = 0; i < cartas.length; i++){
        cartasEl[i].childNodes[1].innerHTML = cartas[i].valor;
        cartasEl[i].childNodes[3].innerHTML = cartas[i].valor;

        let naipe;
        switch(cartas[i].naipe){
            case 'R': 
                naipe = 'pedra'; 
                break;

            case 'P': 
                naipe = 'papel'; 
                break;

            case 'T': 
                naipe = 'tesoura'; 
                break;

            case 'L': 
                naipe = 'lagarto'; 
                break;
            case 'S': 
                naipe = 'spock'; 
                break;
        }
        cartasEl[i].style.backgroundImage = `url(../imagens/user-${naipe}.png)`;
    }
}

function move_carta_bot(carta_mover) {
    carta_mover.classList.add('mov-card-bot');
}

function acumulador(n) {
    let q = 0;
    let valor = 0;

    for(let i = 0; i < 5; i++){
        if(quadro_jogo[n][i] > 0){
            q++;
            valor += 7 + q;
        }
    }

    return valor;
}

function calculaPontuacao(res, valorJ, naipe, valorB) {
    if(!res){
        return 0;
    }
    
    if(valorJ == 'A'){
        valorJ = 1;
    }
    if(valorB == 'A'){
        valorB = 1;
    }

    let x = Math.abs(valorB - valorJ) + 3;
    if(naipe == 'S'){
        x--;
    }
    if(naipe == 'L'){
        x++;
    }

    let indiceValor = 9 * Math.log(12 - x) / Math.log(12);

    let p2 = acumulador(1) - acumulador(0);
    if(p2 < 0){
        p2 = 0;
    }

    let pont = 200 * indiceValor + 50 * Math.pow(p2, 2);

    return Math.round(pont);
}

function jogada(n1){
    cartaJogada = cartas[n1];
    let nb = gera_int_exlusive(4);

    move_carta_bot(cartasEl[nb]);
    trava_cartas();

    let res = jogadorVencedor(cartas[n1].naipe, cartas[n1].valor, cartas[nb].naipe, cartas[nb].valor);
    if(res){
        displayResultado.innerHTML = 'Você ganhou essa rodada';
    } else {
        displayResultado.innerHTML = 'Você perdeu essa rodada';
    }
    
    setTimeout(() => {
        cartasEl[n1].classList.remove('mov-card-bot');
        cartasEl[nb].classList.remove('mov-card-bot');
        $('#container-res').removeClass('invisivel');
    }, 1000);

    pontuacaoJogador+=calculaPontuacao(res, cartas[n1].valor, cartas[n1].naipe, cartas[nb].valor);
    document.querySelector('#pontuacao-jogador').innerHTML = pontuacaoJogador + ' pts';

    setTimeout(() => {
        $('#container-res').addClass('invisivel');
        jogar_init();
    }, 2000);
}

function move_carta(e){
    e.currentTarget.classList.add('mov-card-bot');

    jogada(e.currentTarget.dataset.value);
}

function libera_cartas(){
    for(let carta of cartasJogadorEl) {
        carta.addEventListener('click', move_carta);
    }
}

function trava_cartas(){
    for(let carta of cartasJogadorEl){
        carta.removeEventListener('click', move_carta);
    }
}

function jogar_init(){
    da_carta();
    libera_cartas();

}
jogar_init();

function pause() {
    $('#pause-container').removeClass('invisivel');
}
