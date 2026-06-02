$body = @{
    userQuery = "Why is air quality so bad in Meerut during winter?"
    regionId  = 1
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/chat" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

$json = $response.Content | ConvertFrom-Json

Write-Host "=== SOURCE ===" -ForegroundColor Cyan
Write-Host $json.source

Write-Host "`n=== ANSWER ===" -ForegroundColor Green
Write-Host $json.structured.answer

Write-Host "`n=== CAUSES ===" -ForegroundColor Yellow
foreach ($c in $json.structured.causes) {
    Write-Host "  [$($c.type)] $($c.description)"
}

Write-Host "`n=== PREDICTION ===" -ForegroundColor Magenta
Write-Host $json.structured.prediction

Write-Host "`n=== SOLUTIONS ===" -ForegroundColor Cyan
foreach ($s in $json.structured.solutions) {
    Write-Host "  [$($s.level)] $($s.action)"
}
