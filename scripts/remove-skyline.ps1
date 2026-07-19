$ErrorActionPreference = 'Stop'

$siteRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$pages = Get-ChildItem -LiteralPath $siteRoot -Recurse -Filter '*.html' -File |
  Where-Object { $_.FullName -notmatch '[\\/]source-v3[\\/]' }

foreach ($page in $pages) {
  $html = Get-Content -LiteralPath $page.FullName -Raw -Encoding UTF8
  $html = [regex]::Replace($html, '<link\s+rel="icon"[^>]*(?:antwerp-skyline\.svg|skyline\.png)[^>]*>', '', 'IgnoreCase')
  $html = [regex]::Replace($html, '<img\s+class="brand-mark"[^>]*(?:antwerp-skyline\.svg|skyline\.png)[^>]*>', '', 'IgnoreCase')
  $html = [regex]::Replace($html, '<div\s+class="skyline"[^>]*>\s*<img[^>]*(?:antwerp-skyline\.svg|skyline\.png)[^>]*>\s*</div>', '', 'IgnoreCase')
  $html = [regex]::Replace($html, '<div\s+class="footer-skyline"[^>]*>\s*<img[^>]*(?:antwerp-skyline\.svg|skyline\.png)[^>]*>\s*</div>', '', 'IgnoreCase')
  Set-Content -LiteralPath $page.FullName -Value $html -Encoding UTF8 -NoNewline
}
