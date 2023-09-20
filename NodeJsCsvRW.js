// CSV形式の家計簿データを集計し、最後の支出行の2行後に合計,合計支出を書き込む。
// 家計簿データは品名,価格からなる。

"use strict"

var csvParse = require("./CsvParse.js");
var fs = require("fs")
fs.readFile("./家計簿.csv", "utf8",
    function(error, data)
    {
        if(error)
        {
            console.log("家計簿.csvの読み取りエラー");
            console.log(error);
            return;
        }

        let output = "";
        let columnNum = 0;
        let totalUsed = 0;
        const csv = csvParse.Parse(data);
        let isError = false;

        for(let r = 0; r < csv.length; r++)
        {
            const columns = csv[r];
            if(columns.length > 0 && columns[0] != "")
            {
                //品名、支出はそのまま出力
                for(let c = 0 ; c < columns.length; c++)
                {
                    if(columns[c].includes(","))
                    {
                        output += "\"" + columns[c] + "\"";
                    }
                    else
                    {
                        output += columns[c];
                    }
                    if(c < columns.length - 1)
                    {
                        output += ",";
                    }
                }
                output += "\n";

                //合計金額の加算
                if(columns.length > 1 && columns[1] != "" && r > 0)
                {
                    totalUsed += Number(columns[1]);
                }
                else if(columns.length <= 1 || columns[1] == "")
                {
                    console.log("行" + (r + 1) + ": 支出列が記載されていません");
                    isError = true;
                    break;
                }
                columnNum = columns.length;
            }
        }
        //空行
        output += EmptyRow(columnNum);

        //合計
        output += TotalUsedRow(totalUsed, columnNum);

        if(!isError)
        {
            fs.writeFile("./家計簿_合計記入済み.csv", output,
                function(error)
                {
                    if(error)
                    {
                        console.log("家計簿_合計記入済み.csvの書き込みエラー");
                        console.log(error);
                    }
                }
            );
        }
    }
);

/// <summary>
/// 空行の書き込み
/// </summary>
/// <param name="columnNum">
/// 列数
/// </param>
function EmptyRow(columnNum)
{
    let output = "";
    for(let c = 0; c < columnNum - 1; c++)
    {
        output += ",";
    }
    output += "\r\n";
    return output;
}

/// <summary>
/// 合計支出の行の書き込み
/// </summary>
/// <param name="totalUsed">
/// 合計支出、数値
/// </param>
/// <param name="columnNum">
/// 合計支出、数値
/// </param>
function TotalUsedRow(totalUsed, columnNum)
{
    let output = "";
    output += "合計,";
    output += totalUsed;
    output += ","
    for(let c = 2; c < columnNum - 1; c++)
    {
        output += ",";
    }
    output += "\r\n";
    return output;
}
