cd D:\Desktop4\resturant_site
python scan_secrets.py | Where-Object { 
    $_ -notmatch "\.next" -and 
    $_ -notmatch "node_modules" -and 
    $_ -notmatch "venv" -and 
    $_ -notmatch "__pycache__" 
}
