$word = New-Object -ComObject Word.Application
$word.Visible = $false

$sourceFolder = "E:\スターズ\問題作成中\速読英単語\wordファイル"
$targetFolder = Join-Path $sourceFolder "pdfファイル"

if (-Not (Test-Path $targetFolder)) {
    New-Item -ItemType Directory -Path $targetFolder | Out-Null
}

Get-ChildItem -Path $sourceFolder -Filter *.docx | ForEach-Object {
    $docPath = $_.FullName
    $pdfName = "$($_.BaseName).pdf"
    $pdfPath = Join-Path $targetFolder $pdfName

    Write-Output "変換中: $docPath → $pdfPath"

    $document = $word.Documents.Open($docPath, [ref] $false, [ref] $true)
    $document.SaveAs([ref] $pdfPath, [ref] 17)
    $document.Close()
}

$word.Quit()

Write-Output "すべてのファイルを変換しました。"
