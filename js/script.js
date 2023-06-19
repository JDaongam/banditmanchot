const compteEl = document.getElementById("compte");
let compte = compteEl.innerText;
const ajoutBouton = document.getElementById("btnsomme");
const somme = document.getElementById("somme");
const pari = document.getElementById("pari");
const gameBouton = document.getElementById("game");
const divGame = document.getElementById("divgame");
const ajlignesEl = document.querySelectorAll(".ajlignes");
const ajsomEl = document.querySelectorAll(".ajsomBtn");
const ajpariEl = document.querySelectorAll(".ajpariBtn");
let lignesEntre = 3;

function reloadCompte() {
  const storageCompte = localStorage.getItem("score");
  if (!storageCompte) {
    return (compteEl.innerText = 0);
  }
  return (compteEl.innerText = storageCompte);
}
reloadCompte();

function lancementBtnDisplay() {
  if (compteEl.innerText < pari.value * lignesEntre) {
    gameBouton.style.display = "none";
    document.getElementById("txtgame").style.display = "initial";
  } else {
    gameBouton.style.display = "initial";
    document.getElementById("txtgame").style.display = "none";
  }
}

lancementBtnDisplay();

ajoutBouton.addEventListener("click", ajoutSomme);
function ajoutSomme() {
  const sommeEntre = parseInt(somme.value);
  const balance = parseInt(compteEl.innerText);

  compteEl.innerText = balance + sommeEntre;
  storage(compteEl.innerText);
  lancementBtnDisplay();
  return compteEl.innerText;
}

function suppEnfLignes() {
  ajlignesEl.forEach((ajligne) => {
    ajligne.classList.remove("enf");
  });
}

ajlignesEl.forEach((ajligne) => {
  ajligne.addEventListener("click", (e) => {
    suppEnfLignes();
    e.target.classList.add("enf");
    e.target.parentNode.classList.add("enf"); 
    lignesEntre = e.target.innerText;
    lancementBtnDisplay();
    return lignesEntre;
  });
});

ajsomEl.forEach((ajsom) => {
  ajsom.addEventListener("click", (e) => {
    ajsom = e.target.innerText;
    const balance = parseInt(compteEl.innerText);
    compteEl.innerText = balance + parseInt(ajsom);
    storage(compteEl.innerText);
    lancementBtnDisplay();
    return compteEl.innerText;
  });
});

function suppEnfPari() {
  ajpariEl.forEach((ajpari) => {
    ajpari.classList.remove("enf");
  });
}

ajpariEl.forEach((ajpari) => {
  ajpari.addEventListener("click", (e) => {
    suppEnfPari();
    e.target.classList.add("enf");
    e.target.parentNode.classList.add("enf");
    ajpari = e.target.innerText;
    const pariEntre = parseInt(ajpari);
    pari.value = pariEntre;
    lancementBtnDisplay();
  });
});

function ajoutPari() {
  const pariEntre = parseInt(pari.value);
  lancementBtnDisplay();
  return pariEntre;
}

const nomQuant = {
  K: 2,
  I: 5,
  H: 7,
  Y: 10,
};

const nomValeur = {
  K: 30,
  I: 16,
  H: 10,
  Y: 4,
};

const nomAdresse = {
  K: `<img src="./assets/1.png" id="emote">`,
  I: `<img src="./assets/2.png" id="emote">`,
  H: `<img src="./assets/3.png" id="emote">`,
  Y: `<img src="./assets/4.png" id="emote">`,
};

const LignesAlgo = 3;
const ColAlgo = 3;

const roll = () => {
  const vigns = [];
  for (const [vign, quant] of Object.entries(nomQuant)) {
    for (let i = 0; i < quant; i++) {
      vigns.push(vign);
    }
  }

  const roulo = [];
  for (let i = 0; i < ColAlgo; i++) {
    const rouloSymbols = [...vigns];
    roulo.push([]);
    for (let j = 0; j < LignesAlgo; j++) {
      const math = Math.floor(Math.random() * rouloSymbols.length);
      const selectedSymbol = rouloSymbols[math];
      roulo[i].push(selectedSymbol);
      rouloSymbols.splice(math, 1);
    }
  }
  return roulo;
};

const arrayToArray = (roulo) => {
  const lignesTabl = [];
  for (let loop1 = 0; loop1 < LignesAlgo; loop1++) {    //kih, kik, hkh
    lignesTabl.push([]);
    for (let loop2 = 0; loop2 < ColAlgo; loop2++) {      //kkh    iik    hkh
      lignesTabl[loop1].push(roulo[loop2][loop1]);       //r[0][0]}
    }                                                    //r[1][0]
  }                                                      //r[2][0]
  return lignesTabl;
};

const rouletteEl = document.getElementById("roulette");

const placement = (lignesTabl) => {
  let place = "";
  for (let ligne = 0; ligne < LignesAlgo; ligne++) {
    place += `<div class="lignes" id="lig">`;
    const vigns = lignesTabl[ligne]; 
    for (const lettre of vigns) {
      for (const [vign, address] of Object.entries(nomAdresse)) {
        if (lettre == vign) {
          place += `<div class="vigns" id="vigns">${address}</div>`;
        }
      }
    }
    place += `</div>`;
  }
  rouletteEl.innerHTML = place;
};


function addZoom() {
  compteEl.classList.add("zoom");
}
function supprZoom() {
  compteEl.classList.remove("zoom");
}

const gains = (lignesTabl, pari, lignes) => {
  let varGains = 0;

  for (let ligne = 0; ligne < lignes; ligne++) {
    const vigns = lignesTabl[ligne];
    let jackpot = true;
    for (const vign of vigns) {
      if (vign != vigns[0]) {
        jackpot = false;
        break;
      }
    }
    const allLignes = document.querySelectorAll(".lignes");
    if (jackpot) {
      allLignes[ligne].classList.add("zoom");
      addZoom();
      varGains += pari * nomValeur[vigns[0]];
    }
  }
  return varGains;
};

function storage(monCompte) {
  localStorage.setItem("score", monCompte);
}

const lancement = () => {
  supprZoom();
  somme.value = 0;
  let montantRestant = ajoutSomme();
  const pari = ajoutPari();
  compteEl.innerText = montantRestant - pari * lignesEntre;
  const roulo = roll();
  const lignesTabl = arrayToArray(roulo);
  placement(lignesTabl);
  const varGains = gains(lignesTabl, pari, lignesEntre);
  const monCompte = parseInt(compteEl.innerText) + varGains;
  compteEl.innerText = monCompte;
  storage(monCompte);
  lancementBtnDisplay();
};

gameBouton.addEventListener("click", lancement);
