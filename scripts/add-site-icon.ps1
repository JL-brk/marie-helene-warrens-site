$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

Get-ChildItem -LiteralPath $root -Recurse -Filter '*.html' -File |
  Where-Object { $_.FullName -notmatch '[\\/]source-v3[\\/]' } |
  ForEach-Object {
    $html = Get-Content -LiteralPath $_.FullName -Raw -Encoding UTF8
    if ($html -match 'site-icon\.svg') { return }
    $prefix = if ($_.DirectoryName -eq $root) { '' } else { '../' }
    $icon = '<link rel="icon" href="' + $prefix + 'assets/images/site-icon.svg" type="image/svg+xml">'
    $html = [regex]::Replace($html, '(<meta name="theme-color"[^>]*>)', '$1' + $icon, 1)
    Set-Content -LiteralPath $_.FullName -Value $html -Encoding UTF8 -NoNewline
  }
