$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzY1MzA5NDQwLCJleHAiOjE3NjUzOTU4NDB9.YYJ04YM4Fy4qINZSr-hIieaWsdpwssFIAGiI9gYls30"
$filePath = "test-data\modelos-ejemplo.csv"
$url = "http://localhost:3000/api/import/claudio"

# Leer archivo
$fileContent = Get-Content -Path $filePath -Raw -Encoding UTF8
$fileName = Split-Path $filePath -Leaf

# Crear boundary
$boundary = [System.Guid]::NewGuid().ToString()

# Construir body multipart
$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
    "Content-Type: text/csv",
    "",
    $fileContent,
    "--$boundary--"
)

$body = $bodyLines -join "`r`n"

# Hacer request
try {
    $response = Invoke-RestMethod -Uri $url -Method POST `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body $body `
        -Headers @{Authorization = "Bearer $token"}
    
    Write-Host "Importacion exitosa!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error en importacion:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    }
}
