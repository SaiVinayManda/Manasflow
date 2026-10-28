$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskQuarantine = Join-Path $taskRoot 'quarantine/9hdigital'
New-Item -ItemType Directory -Force -Path (Join-Path $taskQuarantine 'app-before'), (Join-Path $taskQuarantine 'tooling') | Out-Null
foreach ($taskFile in @('src/app/page.tsx', 'src/app/layout.tsx', 'src/app/globals.css')) {
  Copy-Item -LiteralPath (Join-Path $taskRoot $taskFile) -Destination (Join-Path $taskQuarantine ('app-before/' + [IO.Path]::GetFileName($taskFile)))
}
$taskMoves = @(
  @('src/components/sites/9hdigital', 'quarantine/9hdigital/components'),
  @('public/sites/9hdigital', 'quarantine/9hdigital/assets'),
  @('docs/research/9hdigital', 'quarantine/9hdigital/research'),
  @('src/app/favicon.ico', 'quarantine/9hdigital/template-favicon.ico'),
  @('temp/9h-tools', 'temp/browser-tools')
)
foreach ($taskMove in $taskMoves) {
  $taskSource = [IO.Path]::GetFullPath((Join-Path $taskRoot $taskMove[0]))
  $taskDestination = [IO.Path]::GetFullPath((Join-Path $taskRoot $taskMove[1]))
  if (!$taskSource.StartsWith($taskRoot + [IO.Path]::DirectorySeparatorChar) -or !$taskDestination.StartsWith($taskRoot + [IO.Path]::DirectorySeparatorChar)) { throw 'Path outside workspace' }
  if (Test-Path -LiteralPath $taskSource) {
    if (Test-Path -LiteralPath $taskDestination) { throw "Destination exists: $taskDestination" }
    Move-Item -LiteralPath $taskSource -Destination $taskDestination
  }
}
foreach ($taskName in @('download-9h.cjs', 'inspect-9h.cjs', 'inspect-9h-states.cjs', 'prepare-9h-data.cjs', 'verify-9h.cjs', 'final-9h-qa.cjs')) {
  $taskSource = Join-Path $taskRoot ('scripts/' + $taskName)
  if (Test-Path -LiteralPath $taskSource) { Move-Item -LiteralPath $taskSource -Destination (Join-Path $taskQuarantine ('tooling/' + $taskName)) }
}
Write-Output 'Original source, client material, assets, and clone tooling quarantined outside served paths.'
