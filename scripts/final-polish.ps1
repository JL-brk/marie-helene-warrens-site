$ErrorActionPreference = 'Stop'

$pages = @('index.html', 'rondleidingen.html', 'over.html', 'faq.html', 'contact.html')

foreach ($page in $pages) {
  $path = Join-Path $PSScriptRoot "..\$page"
  $html = Get-Content -LiteralPath $path -Raw -Encoding UTF8
  $html = $html.Replace('<h4>', '<h3>').Replace('</h4>', '</h3>')
  $html = $html.Replace(' aria-label="Nederlands"', '')
  $html = $html.Replace(' aria-label="Français"', '')
  $html = $html.Replace(' aria-label="English"', '')
  $html = $html.Replace('assets/styles.css?v=4', 'assets/styles.min.css?v=5')
  $html = $html.Replace('assets/main.js?v=4', 'assets/main.min.js?v=5')

  if ($html -notmatch 'manrope-latin\.woff2') {
    $html = $html.Replace(
      '<link rel="icon" href="assets/images/antwerp-skyline.svg" type="image/svg+xml">',
      '<link rel="icon" href="assets/images/antwerp-skyline.svg" type="image/svg+xml"><link rel="preload" href="assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="assets/fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>'
    )
  }

  if ($page -eq 'index.html') {
    $html = $html.Replace('assets/images/hero-optimized.webp', 'assets/images/hero-lcp.webp')
    $html = $html.Replace('width="1134" height="1512" fetchpriority="high"', 'width="960" height="1280" fetchpriority="high" decoding="async"')
    if ($html -notmatch 'rel="preload" as="image"') {
      $html = $html.Replace(
        '<link rel="icon" href="assets/images/antwerp-skyline.svg" type="image/svg+xml">',
        '<link rel="icon" href="assets/images/antwerp-skyline.svg" type="image/svg+xml"><link rel="preload" as="image" href="assets/images/hero-lcp.webp" fetchpriority="high">'
      )
    }
  }

  Set-Content -LiteralPath $path -Value $html -Encoding UTF8 -NoNewline
}
