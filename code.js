// data z excelu cviceni_01
var CZ_FREQUENCIES = {
    a: 0.09589269, b: 0.01776120, c: 0.02999077, d: 0.03774841, e: 0.10904081,
    f: 0.00175060, g: 0.00219812, h: 0.02497482, i: 0.06686138, j: 0.02305759,
    k: 0.03528082, l: 0.05720782, m: 0.03605450, n: 0.05917244, o: 0.08029999,
    p: 0.03114961, q: 0.00005933, r: 0.04396827, s: 0.05585970, t: 0.05385289,
    u: 0.03579031, v: 0.03952464, w: 0.00054266, x: 0.00035910, y: 0.02857512,
    z: 0.03302643
};

var abeceda = "abcdefghijklmnopqrstuvwxyz";

// tlacitko
window.addEventListener("DOMContentLoaded", function() {
    var tlacitko = document.getElementById("runBtn");
    tlacitko.addEventListener("click", runFrequencyAnalysis);
});

//posun 025
function solveStreamShift(textProudu) {
    var delka = textProudu.length;

    // pismenaka
    var pocty = [];
    for (var i = 0; i < 26; i++) {
        pocty.push(0);
    }

    // opakovani pismen
    for (var i = 0; i < delka; i++) {
        var pismeno = textProudu[i];
        var index = abeceda.indexOf(pismeno);
        if (index != -1) {
            pocty[index] = pocty[index] + 1;
        }
    }

    var nejlepsiPosun = 0;
    var nejmensiChi = 999999999; // nejake hodne velke cislo na zacatek


    for (var posun = 0; posun < 26; posun++) {
        var chi2 = 0;

        for (var c = 0; c < 26; c++) {
            var znak = abeceda[c];
            var ocekavano = delka * CZ_FREQUENCIES[znak];

            var posunutyIndex = c + posun;
            if (posunutyIndex >= 26) {
                posunutyIndex = posunutyIndex - 26; // kdyz pretece abeceda
            }

            var namereno = pocty[posunutyIndex];


            var rozdil = namereno - ocekavano;
            var vypocet = (rozdil * rozdil) / ocekavano;
            chi2 = chi2 + vypocet;
        }


        if (chi2 < nejmensiChi) {
            nejmensiChi = chi2;
            nejlepsiPosun = posun;
        }
    }

    var vyslednePismeno = abeceda[nejlepsiPosun];

    return {
        shift: nejlepsiPosun,
        char: vyslednePismeno
    };
}

function runFrequencyAnalysis() {
    var vstup = document.getElementById("cipherInput").value;
    var malePismena = vstup.toLowerCase();

    //papa mezery
    var cistyText = "";
    for (var i = 0; i < malePismena.length; i++) {
        var znak = malePismena[i];
        if (abeceda.indexOf(znak) != -1) {
            cistyText = cistyText + znak;
        }
    }

    if (cistyText.length < 3) {
        alert("Zadejte prosím šifrový text obsahující alespoň 3 písmena.");
        return;
    }

    //rozdeleni na 3 proudy
    var proud0 = "";
    var proud1 = "";
    var proud2 = "";

    for (var i = 0; i < cistyText.length; i++) {
        if (i % 3 == 0) {
            proud0 = proud0 + cistyText[i];
        } else if (i % 3 == 1) {
            proud1 = proud1 + cistyText[i];
        } else if (i % 3 == 2) {
            proud2 = proud2 + cistyText[i];
        }
    }

    var proudy = [proud0, proud1, proud2];
    var klic = "";

    // vyreseni vsech 3 proudu
    for (var s = 0; s < 3; s++) {
        var vysledek = solveStreamShift(proudy[s]);
        klic = klic + vysledek.char;

        // vypis do shhetu
        document.getElementById("s" + s + "-count").innerHTML = proudy[s].length;
        document.getElementById("s" + s + "-shift").innerHTML = "posun o " + vysledek.shift;
        document.getElementById("s" + s + "-char").innerHTML = vysledek.char.toUpperCase();
    }

    console.log("Nalezeny klic je: " + klic);
    document.getElementById("finalKey").innerHTML = klic.toUpperCase();

    // desifrovani
    var desifrovano = "";
    for (var i = 0; i < cistyText.length; i++) {
        var sifrovyZnak = cistyText[i];
        var indexSifry = abeceda.indexOf(sifrovyZnak);

        var znakKlice = klic[i % 3];
        var posunKlice = abeceda.indexOf(znakKlice);

        var novyIndex = indexSifry - posunKlice;
        if (novyIndex < 0) {
            novyIndex = novyIndex + 26; // aby to nebylo v minusu
        }

        desifrovano = desifrovano + abeceda[novyIndex];
    }

    // result
    document.getElementById("plainOutput").value = desifrovano;
    document.getElementById("resultsSection").style.display = "block";
}