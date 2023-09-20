"use strict"

//! 以下の構文木に基づきパース
//! Csv = 行 {改行 行}* [改行]
//! 行 = カラム {, カラム}*
//! カラム = (トークン) | (" 任意の文字列 ")
//! トークン = ,"\r\nを除いた文字列

/// <summary>
/// CSVを解析し、二次元配列形式で出力
/// </summary>
/// <param name="text">
/// テキスト形式のCSV
/// </param>
exports.Parse = function(text)
{
    let dst = [];
    let currentIndex = [0];
    ParseCSV(dst, text, currentIndex);
    return dst;
}

/// <summary>
/// Csvのパーズ本体
/// </summary>
/// <param name="currentIndex">
/// 現在の解析位置、呼び出し先の関数内で変更されるので要素数1の配列で渡す
/// </param>
function ParseCSV(dst, csv, currentIndex)
{
    ParseRow(dst, csv, currentIndex);
    while (CheckNextChar(csv, currentIndex[0], '\r'))
    {
        ParseNewLine(csv, currentIndex);
        ParseRow(dst, csv, currentIndex);
    }
    if (CheckNextChar(csv, currentIndex[0], '\r'))
    {
        ParseNewLine(csv, currentIndex);
    }
}

/// <summary>
/// 行のパーズ
/// </summary>
function ParseRow(dst, csv, currentIndex)
{
    let columns = [];

    columns.push(ParseColumn(dst, csv, currentIndex));
    while (CheckNextChar(csv, currentIndex[0], ','))
    {
        currentIndex[0]++;
        columns.push(ParseColumn(dst, csv, currentIndex));
    }

    if(columns.length > 0)
    {
        dst.push(columns);
    }
}

/// <summary>
/// 任意の文字列のパーズ
/// </summary>
function ParseColumn(dst, csv, currentIndex)
{
    if(CheckNextChar(csv, currentIndex[0], '"'))
    {
        return ParseAnyString(dst, csv, currentIndex);
    }
    else
    {
        return ParseToken(dst, csv, currentIndex);
    }
}

/// <summary>
/// 改行のパーズ
/// </summary>
function ParseNewLine(csv, currentIndex)
{
    if (CheckNextChar(csv, currentIndex[0], '\r'))
    {
        currentIndex[0]++;
    }
    if (CheckNextChar(csv, currentIndex[0], '\n'))
    {
        currentIndex[0]++;
    }
}

/// <summary>
/// トークンのパーズ
/// </summary>
function ParseToken(dst, csv, currentIndex)
{
    let adv = 0;
    for (adv = 0; adv + currentIndex[0] < csv.length; adv++)
    {
        if (CheckNextChar(csv, currentIndex[0] + adv, ',') ||
            CheckNextChar(csv, currentIndex[0] + adv, '\r'))
        {
            break;
        }
    }
    currentIndex[0] += adv;

    return csv.substring(currentIndex[0] - adv, currentIndex[0]);
}

/// <summary>
/// 行のパーズ
/// </summary>
function ParseAnyString(dst, csv, currentIndex)
{
    if (CheckNextChar(csv, currentIndex[0], '"'))
    {
        currentIndex[0]++;
    }
    let adv = 0;
    for(adv = 0; adv + currentIndex[0] < csv.length; adv++)
    {
        if(CheckNextChar(csv, currentIndex[0] + adv, '"'))
        {
            if(CheckNextChar(csv, currentIndex[0] + adv + 1, '"'))
            {
                adv += 1;
            }
            else
            {
                break;
            }
        }
    }
    currentIndex[0] += adv + 1;

    return csv.substring(currentIndex[0] - adv - 1, currentIndex[0] - 1);
}

/// <summary>
/// 次の文字が終端でなく、nextであるか
/// </summary>
/// <param name="currentIndexPrim">
/// 現在の解析位置、数値型
/// </param>
function CheckNextChar(csv, currentIndexPrim, next)
{
    if(typeof currentIndexPrim != "number")
    {
        console.log("Warning: currentIndexPrim is not a number.");
        console.trace();
    }
    return csv.length > currentIndexPrim && csv[currentIndexPrim] == next;
}
