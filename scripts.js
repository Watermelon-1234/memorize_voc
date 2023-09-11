function populateEndLetters() {//作為下拉式選單的內容
    var startLetter = document.getElementById("startLetter").value;
    var endLetterSelect = document.getElementById("endLetter");
    endLetterSelect.innerHTML = "<option value='' disabled selected></option>";

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var startIndex = alphabet.indexOf(startLetter);
    for (var i = startIndex; i < alphabet.length; i++) {
        var letter = alphabet.charAt(i);
        var option = document.createElement("option");
        option.value = letter;
        option.innerText = letter;
        endLetterSelect.appendChild(option);
    }
}

function pickWords() {
    var startLetter = document.getElementById("startLetter").value.trim().toUpperCase();
    var endLetter = document.getElementById("endLetter").value.trim().toUpperCase();
    var numToPick = parseInt(document.getElementById("numToPick").value);
    var outputDiv = document.getElementById("outputDiv");

    if (startLetter !== '' && endLetter !== '' && numToPick !== '') {
        outputDiv.innerHTML = "<h2>請等等...</h2><ul>";

        pickAndOutputWords(startLetter, endLetter, numToPick)
        .then(words => {
            displayWords(words);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        outputDiv.innerHTML = "<h2>你好像漏了些甚麼沒有填喔</h2><ul>";
    }
}

function pickAllWords() {
    var startLetter = document.getElementById("startLetter").value.trim().toUpperCase();
    var endLetter = document.getElementById("endLetter").value.trim().toUpperCase();
    var outputDiv = document.getElementById("outputDiv");

    if (startLetter !== '' && endLetter !== '') {
        outputDiv.innerHTML = "<h2>請等等...</h2><ul>";
        pickall(startLetter, endLetter)
        .then(words => {
            displayWords(words);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        outputDiv.innerHTML = "<h2>你好像漏了些甚麼沒有填喔</h2><ul>";
    }
}

var api_url = 'https://script.google.com/macros/s/AKfycbxN6TKYrCfvVvxDVhM3V61TH62vj0BAUW9l05XYzWCyjYNeYDIea2MBLQhetqpePAK9/exec';

function pickAndOutputWords(startLetter, endLetter, numToPick) {
    return fetch(api_url + '?action=pickAndOutputWords&startLetter=' + startLetter + '&endLetter=' + endLetter + '&numToPick=' + numToPick)
        .then(response => response.json())
        .then(data => {
        var resultArray = data.result;
        return resultArray;
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function pickall(startLetter, endLetter) {
    return fetch(api_url + '?action=pickall&startLetter=' + startLetter + '&endLetter=' + endLetter)
        .then(response => response.json())
        .then(data => {
        var resultArray = data.result;
        return resultArray;
        })
        .catch(error => {
        console.error('Error:', error);
        });
}

function displayWords(words) {
    var outputDiv = document.getElementById("outputDiv");
    outputDiv.innerHTML = "<h2>抽到的單字：</h2><ul>";
    words.forEach(function (word) {
        outputDiv.innerHTML += "<li>" + word + "</li>";
    });
    outputDiv.innerHTML += "</ul>";
}


document.addEventListener("DOMContentLoaded", function () {
    // 在这里放置你的 JavaScript 代码
    // 例如，添加事件监听器等
    document.getElementById("startLetter").addEventListener("change", populateEndLetters);
    document.getElementById("startLetter").dispatchEvent(new Event("change"));
});
