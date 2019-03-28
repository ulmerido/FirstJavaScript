//@ts-check

let table = document.getElementById("myTable");
const size = 10;

let html = ""; 

for(let i = 0; i < size; i++) {
    html += "<tr>";

    for(let j = 0; j < size; j++) {

        // id is a STRING (like '02'), representing the curreny i,j cell
       // html += `<td><a id=\'${i}${j}\'>${board[i][j]}</a></td>`;

        // adding image does NOT work well on board over 4x4 (like 6x6):
        //html += `<td><a id=\'${i}${j}\'><img src=${board[i][j]}-80.png display=${board[i][j] === ' ' ?  'none': 'block'}></a></td>`;
        html += "<td><div id=\'${i}${j}\'></div></td>";

    } // for adding each <td><a id=0> </a></td>
    
    html += "</tr>";
} // for i, each <tr> block

//return html;

table.insertAdjacentHTML("afterbegin", html);



var h = document.getElementById("myH2");
h.insertAdjacentHTML("afterbegin", "<span style='color:red'>My span</span>");

