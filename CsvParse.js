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
    let currentIndex = 0;
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
    currentIndex = ParseRow(dst, csv, currentIndex);
    while (CheckNextChar(csv, currentIndex, '\r'))
    {
        currentIndex = ParseNewLine(csv, currentIndex);
        currentIndex = ParseRow(dst, csv, currentIndex);
    }
    if (CheckNextChar(csv, currentIndex, '\r'))
    {
        currentIndex = ParseNewLine(csv, currentIndex);
    }
    return currentIndex;
}

/// <summary>
/// 行のパーズ
/// </summary>
function ParseRow(dst, csv, currentIndex)
{
    let columns = [];

    let result = ParseColumn(dst, csv, currentIndex);
    currentIndex = result[0];
    columns.push(result[1]);
    while (CheckNextChar(csv, currentIndex, ','))
    {
        currentIndex++;
        result = ParseColumn(dst, csv, currentIndex);
        currentIndex = result[0];
        columns.push(result[1]);
    }

    if(columns.length > 0)
    {
        dst.push(columns);
    }
    return currentIndex;
}

/// <summary>
/// 任意の文字列のパーズ
/// </summary>
/// <return>
/// 配列、0:進めた後のindex 1:文字列
/// </return>
function ParseColumn(dst, csv, currentIndex)
{
    if(CheckNextChar(csv, currentIndex, '"'))
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
    if (CheckNextChar(csv, currentIndex, '\r'))
    {
        currentIndex++;
    }
    if (CheckNextChar(csv, currentIndex, '\n'))
    {
        currentIndex++;
    }
    return currentIndex;
}

/// <summary>
/// トークンのパーズ
/// </summary>
/// <return>
/// 配列、0:進めた後のindex 1:文字列
/// </return>
function ParseToken(dst, csv, currentIndex)
{
    let adv = 0;
    for (adv = 0; adv + currentIndex < csv.length; adv++)
    {
        if (CheckNextChar(csv, currentIndex + adv, ',') ||
            CheckNextChar(csv, currentIndex + adv, '\r'))
        {
            break;
        }
    }
    currentIndex += adv;

    return [currentIndex, csv.substring(currentIndex - adv, currentIndex)];
}

/// <summary>
/// 行のパーズ
/// </summary>
/// <return>
/// 配列、0:進めた後のindex 1:文字列
/// </return>
function ParseAnyString(dst, csv, currentIndex)
{
    if (CheckNextChar(csv, currentIndex, '"'))
    {
        currentIndex++;
    }
    let adv = 0;
    for(adv = 0; adv + currentIndex < csv.length; adv++)
    {
        if(CheckNextChar(csv, currentIndex + adv, '"'))
        {
            if(CheckNextChar(csv, currentIndex + adv + 1, '"'))
            {
                adv += 1;
            }
            else
            {
                break;
            }
        }
    }
    currentIndex += adv + 1;

    return [currentIndex, csv.substring(currentIndex - adv - 1, currentIndex - 1)];
}

/// <summary>
/// 次の文字が終端でなく、nextであるか
/// </summary>
function CheckNextChar(csv, currentIndex, next)
{
    if(typeof currentIndex != "number")
    {
        console.log("Warning: currentIndexPrim is not a number.");
        console.trace();
    }
    return csv.length > currentIndex && csv[currentIndex] == next;
}
