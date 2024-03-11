function populateEndLetters() {//作為下拉式選單的內容
    var startLetter = document.getElementById("startLetter").value;
    var endLetterSelect = document.getElementById("endLetter");

    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var startIndex = alphabet.indexOf(startLetter);
    var endIndex = alphabet.indexOf(endLetterSelect.value);
    endLetterSelect.innerHTML = "<option value='' disabled selected></option>";  
    for (var i = startIndex; i < alphabet.length; i++) {
        var letter = alphabet.charAt(i);
        var option = document.createElement("option");
        option.value = letter;
        option.innerText = letter;
        endLetterSelect.appendChild(option);
    }
    if(endIndex < startIndex) {
        endLetterSelect.selectedIndex = 1;
    }
    else
    {
        endLetterSelect.selectedIndex = endIndex - startIndex +1;
    }
}

function pickWords(method='pickAndOutputWords') {//用抽的
    var startLetter = document.getElementById("startLetter").value.trim().toUpperCase();
    var endLetter = document.getElementById("endLetter").value.trim().toUpperCase();
    var numToPick = parseInt(document.getElementById("numToPick").value);
    var outputDiv = document.getElementById("outputDiv");
    var sheet = document.getElementById("sheetName").value;
  // 取得 class 為 shuffle 的 checkbox 元素
    var shuffle = document.querySelector(".shuffle").checked;
    console.log(shuffle);
   //console.log(choice);
    //console.log(numToPick);
    if (startLetter !== '' && endLetter !== '' && numToPick >0) {
        outputDiv.innerHTML = "<h2>請等等...</h2><ul>";

        pickAndOutputWords(startLetter, endLetter, numToPick,sheet,shuffle,method)
        .then(words => {
            displayWords(words);
        })
        .catch(error => {
            console.error('Error:', error);
            outputDiv.innerHTML = " ERROR: " + error+ "<br>請聯繫作者";
        });
    } else {
        outputDiv.innerHTML = "<h2>你好像漏了些甚麼沒有填喔</h2><ul>";
    }
}

function pickAllWords() {
    var startLetter = document.getElementById("startLetter").value.trim().toUpperCase();
    var endLetter = document.getElementById("endLetter").value.trim().toUpperCase();
    var outputDiv = document.getElementById("outputDiv");
    var sheet = document.getElementById("sheetName").value.trim();
    if (startLetter !== '' && endLetter !== '') {
        outputDiv.innerHTML = "<h2>請等等...</h2><ul>";
        pickall(startLetter, endLetter,sheet)
        .then(words => {
            displayWords(words);
        })
        .catch(error => {
            console.error('Error:', error);
            outputDiv.innerHTML = " ERROR: " + error + "<br>請聯繫作者";
        });
    } else {
        outputDiv.innerHTML = "<h2>你好像漏了些甚麼沒有填喔</h2><ul>";
    }
}

var api_url = 'https://script.google.com/macros/s/AKfycbxN6TKYrCfvVvxDVhM3V61TH62vj0BAUW9l05XYzWCyjYNeYDIea2MBLQhetqpePAK9/exec';

function pickAndOutputWords(startLetter, endLetter, numToPick, sheet,shuffle,method) {
  return fetch(api_url + '?action='+method+'&startLetter=' + startLetter + '&endLetter=' + endLetter + '&numToPick=' + numToPick + '&sheet=' + sheet+'&shuffle='+shuffle, {
    method: "GET",
    mode: "cors", // 啟用跨域支持
  })
    .then(response => response.json())
    .then(data => {
      var resultArray = data.result;
      // console.log(resultArray);
      return resultArray;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function pickall(startLetter, endLetter,sheet) {
    return fetch(api_url + '?action=pickall&startLetter=' + startLetter + '&endLetter=' + endLetter+'&sheet='+sheet, {
      method: "GET",
      mode: "cors", // 啟用跨域支持 
    })
    .then(response => response.json())
    .then(data => {
    var resultArray = data.result;
    //console.log(resultArray);
    return resultArray;
    })
    .catch(error => {
    console.error('Error:', error);
    });
}

function displayWords(words = localStorage.getItem('words')) {
    console.log(localStorage.getItem('words'));
    // console.log("test");
    console.log(typeof(words));
    if(words)
    {
      if(typeof(words) === 'string')//有暫存
      {
        words=JSON.parse(words);
      }
      var outputDiv = document.getElementById("outputDiv");
      console.log(outputDiv);
      var content = "<h2>抽到的單字：</h2><p>點擊單字切換成音標 再點一次切換回單字</p><table>";
      for (var i = 0; i < words.length; i++) {
          content += "<tr><td class=\"ranking\"><p>"+(i+1)+".</p></td>";
          content += "<td><p class=\"pronouncing-switch\" data-value=\""+words[i][2].replace(/'/g, '&apos;')+"\">" + words[i][0] + "</p></td>";
          content += "<td><input type=\"button\" onclick=\"high_light(this) \" value=\"我不會\"></td>";
          content += "<td><input type=\"button\" onclick=\"showChinese(this,\'"+ words[i][1] + "\' ) \" value=\"顯示中文\"></td></tr>";
      }
      content += "</table>";
      content += "<input type=\"button\" id=\"copyBtn\" value=\"複製單字到剪貼簿\">";
      content += "<input type=\"button\" onclick=\"toggleRowVisibility(this)\" value=\"只出現不會的字\"></input>";
      outputDiv.innerHTML = content;
      switch_col_one();
      document.getElementById('copyBtn').addEventListener('click', function() {
          // 在這裡使用 this
          create_alphabat_content();
          this.value = "已複製完成!";
      });
      localStorage.setItem('words',JSON.stringify(words))
    
    }
    else
    {
      console.log("no temp!");
    }
}
function high_light(button) {

  var row = button.parentNode.parentNode;
  var cells = row.getElementsByTagName('td');
  var currentColor = window.getComputedStyle(cells[1]).color; 
  if(currentColor == 'rgb(255, 0, 255)') {
    // 取消高亮
    for(var i = 0; i < cells.length; i++) {
      cells[i].style.color = '#00FF00';
    }
    button.value = "我不會";
  } else {  
    // 设置高亮
    button.value = "我會了";
    for(var i = 0; i < cells.length; i++) {
      cells[i].style.color = '#FF00FF';
    }
  }


}

// Usage:
// <button onclick="high_light(this)">Highlight Row</button>
function showChinese(button,ch) {
    if(ch[0]=='〔')
    {
        if(button.value=="顯示音標")
        {
            button.value =ch;
        }    
        else
        {
            button.value ="顯示音標";
        }
      }
    else
    {
      if(button.value=="顯示中文")
      {
          button.value =ch;
      }    
      else
      {
          button.value ="顯示中文";
      }
    }
  }
  
document.addEventListener("DOMContentLoaded", function () {
    // 在这里放置你的 JavaScript 代码
    // 例如，添加事件监听器等
    document.getElementById("startLetter").addEventListener("change", populateEndLetters);
    document.getElementById("startLetter").dispatchEvent(new Event("change"));
});
// window.onload = displayWords();


// 高亮颜色
var highlightColor = '#FF00FF';

// 高亮行变量
var highlightRow=false;  
function toggleRowVisibility(button) {
  
  // 获取表格所有行
  //var table = document.getElementsByTagName('table');
  var rows = document.getElementsByTagName('tr');
  // 检查是否有隐藏行
  var hasHiddenRows = false;
  var rowStyle
  for(var i = 0; i < rows.length; i++) {
    if(rows[i].style.display == 'none') {
      hasHiddenRows = true;
      break;
    }
  }

  // 切换高亮行显示状态
  if(hasHiddenRows) {//復原
    highlightRow = false;
    button.value = "只出現不會的字";
    // 遍历行
      for(i = 0; i < rows.length; i++) {
    
        // 获取行的样式
        rowStyle = window.getComputedStyle(rows[i]).display;

        if(rowStyle == 'none')//隱藏
        {
          rows[i].style.display = '';//復原
        } 
      }
  } 
  else {//隱藏
    hasHiddenRows = true;
    button.value = "顯示所有單字";
    // 遍历行
      for(i = 0; i < rows.length; i++) {
        ele=rows[i].getElementsByTagName('td');
        // 获取行的样式
        rowStyle = window.getComputedStyle(ele[1]).color;
        
        //console.log(rowStyle);
        
        
        if(rowStyle == 'rgb(255, 0, 255)')//已變色
        {
          //rows[i].style.display = '';//不用理他
          ele[3].click();
        } 
        else {
          rows[i].style.display = 'none'; 
        }
      }
  }
}

function switch_col_one(){
  // 取得所有具有 pronouncing-switch 類別的元素
  const pronouncingElements = document.querySelectorAll('.pronouncing-switch');
  // 取得 body 元素的字體
  const bodyFont = window.getComputedStyle(document.body).getPropertyValue("font-family");

  // 為每個元素添加點擊事件監聽器
  pronouncingElements.forEach(element => {
      element.count=0;  
      element.addEventListener('click', function() {
          // 獲取當前元素的內容和 value 屬性
          this.count++;
          const currentContent = this.textContent;
          const valueAttribute = this.getAttribute('data-value');
          //console.log(valueAttribute);
          // 根據 value 屬性的第一個字元執行不同的操作
          if (this.count%2==1){
              // 如果第一個字元是 '〔'，則修改字體並讓內容和 value 互換
              this.textContent = valueAttribute;
              this.setAttribute("data-value",currentContent); // 更新內容
              this.style.fontFamily ='PHONETIC'; // 修改字體
          } else {
              // 如果第一個字元不是 '〔'，則還原字體並讓內容和 value 互換
              this.style.fontFamily = bodyFont; // 還原字體            
              this.textContent = valueAttribute;
              this.setAttribute("data-value",currentContent); // 更新內容 
          }
    });
  });
}

// function col_one_unite(){
//   // 取得所有具有 pronouncing-switch 類別的元素
//   const pronouncingElements = document.querySelectorAll('.pronouncing-switch');
//   // 取得 body 元素的字體
//   const bodyFont = window.getComputedStyle(document.body).getPropertyValue("font-family");

//   // 為每個元素添加點擊事件監聽器
//   pronouncingElements.forEach(element => {
//       const currentContent = this.textContent;
//       const valueAttribute = this.getAttribute('data-value');
//       //console.log(valueAttribute);
//       // 根據 value 屬性的第一個字元執行不同的操作
//       if (currentContent.startwith('〔')){
//           // 如果第一個字元是 '〔'，則修改字體並讓內容和 value 互換
//           this.textContent = valueAttribute;
//           this.setAttribute("data-value",currentContent); // 更新內容
//           this.style.fontFamily ='PHONETIC'; // 修改字體
//       } else {
//           // 如果第一個字元不是 '〔'，則還原字體並讓內容和 value 互換
//           this.style.fontFamily = bodyFont; // 還原字體            
//           this.textContent = valueAttribute;
//           this.setAttribute("data-value",currentContent); // 更新內容 
//       }
//   });
// }

function col_one_unite(){
  // 取得所有具有 pronouncing-switch 類別的元素
  const pronouncingElements = document.querySelectorAll('.pronouncing-switch');
  // 取得 body 元素的字體
  const bodyFont = window.getComputedStyle(document.body).getPropertyValue("font-family");

  // 為每個元素添加點擊事件監聽器
  pronouncingElements.forEach(element => {
      const currentContent = element.textContent;
      const valueAttribute = element.getAttribute('data-value');

      // 根據 value 屬性的第一個字元執行不同的操作
      if (currentContent.startsWith('〔')) {
          // 如果第一個字元是 '〔'，則修改字體並讓內容和 value 互換
          element.textContent = valueAttribute;
          element.setAttribute("data-value", currentContent); // 更新內容
          element.style.fontFamily = 'PHONETIC'; // 修改字體
      } 
  });
}


function copyToClipboard(content) {
    // 建立一個 textarea 元素
  const textarea = document.createElement('textarea');
  
  // 將內容設置為要複製的內容
  textarea.value = content;

  // 將 textarea 加入 DOM 中
  document.body.appendChild(textarea);

  // 選擇 textarea 中的內容
  textarea.select();

  try {
    // 嘗試複製內容到剪貼簿
    const success = document.execCommand('copy');

    if (!success) {
      console.error('無法複製到剪貼簿');
    }
  } catch (err) {
    console.error('複製到剪貼簿時發生錯誤', err);
  } finally {
    // 移除 textarea
    document.body.removeChild(textarea);
  }
}


function create_alphabat_content()
  {
  col_one_unite();
    // 獲取指定的div元素
  const targetDiv = document.getElementById('outputDiv'); // 請將'yourDivId'替換為實際的div元素ID
  
  // 獲取該div中的所有表格
  const tables = targetDiv.getElementsByTagName('table');

  // 如果有多個表格，選擇你想要處理的表格（例如，這裡選擇第一個表格）
  const targetTable = tables[0];

  // 獲取該表格中所有行
  const rows = targetTable.getElementsByTagName('tr');

  // 創建一個空字符串，用於保存結果
  let resultString = '';

  // 迭代處理每一行，將第一列的textContent添加到結果字符串中
  for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td'); // 如果是th而不是td，請適當更改
      if (cells.length > 0) {
          resultString += cells[1].textContent.trim() + '\n'; // 添加到結果字符串中，可以根據需要添加分隔符號
      }
  }
  //this.innerHTML = "已複製完成!";
  //console.log(this)
  // 現在resultString包含所有第一列的textContent
  copyToClipboard(resultString);

}

