// CSV形式の家計簿データを集計し、最後の支出行の2行後に合計,合計支出を書き込む。
// 家計簿データは品名,価格からなる。

var fs = require("fs")
fs.readFile("./家計簿.csv", "utf8",
    function(error, data)
    {
        let output = "";
        let rowNum = 0;
        let totalUsed = 0;
        const columns = data.split("\n");
        for(let c = 0; c < columns.length; c++)
        {
            const rows = columns[c].split(",");
            if(rows.length > 0 && rows[0] != "")
            {
                //品名、支出はそのまま出力
                for(let r = 0; r < rows.length; r++)
                {
                    output += rows[r];
                    if(r < rows.length - 1)
                    {
                        output += ",";
                    }
                }
                //合計金額の加算
                if(rows.length > 1 && c > 0)
                {
                    totalUsed += Number(rows[1]);
                }
                output += "\n";
                rowNum = rows.length;
            }
        }
        //空行
        for(let r = 0; r < rowNum - 1; r++)
        {
            output += ",";
        }
        output += "\r\n";

        //合計
        output += "合計,";
        output += totalUsed;
        output += ","
        for(let r = 2; r < rowNum - 1; r++)
        {
            output += ",";
        }
        output += "\r\n";
        fs.writeFileSync("./家計簿_合計記入済み.csv", output);
    }
);
