// CSV形式の家計簿データを集計し、最後の支出行の2行後に合計,合計支出を書き込む。
// 家計簿データは品名,価格からなる。

var fs = require("fs")
fs.readFile("./家計簿.csv", "utf8",
    function(error, data)
    {
        console.log(data);
        fs.writeFileSync("./家計簿_合計記入済み.csv", data);
    }
);
