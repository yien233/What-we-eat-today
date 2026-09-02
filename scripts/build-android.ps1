param(
    [Parameter(Mandatory = $true)][string]$JavaHome,
    [Parameter(Mandatory = $true)][string]$SdkRoot
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$androidProject = Join-Path $projectRoot 'versions\android-apk'
$signingDir = Join-Path $projectRoot '.android-signing'
$java = Join-Path $JavaHome 'bin\java.exe'
$keytool = Join-Path $JavaHome 'bin\keytool.exe'
if (-not (Test-Path -LiteralPath $java)) { throw 'JDK not found' }
$env:JAVA_HOME = (Resolve-Path -LiteralPath $JavaHome).Path
$env:ANDROID_HOME = (Resolve-Path -LiteralPath $SdkRoot).Path
$cacheDir = Join-Path $projectRoot '.android-tools\gradle-cache'
$sdkProperty = 'sdk.dir=' + $env:ANDROID_HOME.Replace('\', '/').Replace(':', '\:')
[IO.File]::WriteAllText((Join-Path $androidProject 'local.properties'), $sdkProperty, [Text.UTF8Encoding]::new($false))

# This private key and its password must never be committed or uploaded.
New-Item -ItemType Directory -Force $signingDir | Out-Null
$keyFile = Join-Path $signingDir 'release.jks'
$propertiesFile = Join-Path $signingDir 'signing.properties'
if ((Test-Path $keyFile) -xor (Test-Path $propertiesFile)) {
    throw 'Signing files are incomplete. Restore the existing key and properties; do not create a replacement key.'
}
if (-not (Test-Path $keyFile)) {
    if (Get-ChildItem -LiteralPath (Join-Path $projectRoot 'release-packages') -Filter '*.apk') {
        throw 'A published APK already exists. Restore its original private signing directory before creating an update.'
    }
    $randomBytes = New-Object byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Fill($randomBytes)
    $password = [Convert]::ToHexString($randomBytes)
    $env:WHAT_TO_EAT_SIGNING_PASSWORD = $password
    try {
        & $keytool -genkeypair -keystore $keyFile -storetype PKCS12 -alias what-we-eat-today -keyalg RSA -keysize 3072 -validity 36500 -dname 'CN=What We Eat Today, OU=Android, O=yien233' -storepass:env WHAT_TO_EAT_SIGNING_PASSWORD -keypass:env WHAT_TO_EAT_SIGNING_PASSWORD
        if ($LASTEXITCODE -ne 0) { throw 'Signing key generation failed' }
        $properties = "storeFile=../../.android-signing/release.jks`nstorePassword=$password`nkeyAlias=what-we-eat-today`nkeyPassword=$password`n"
        [IO.File]::WriteAllText($propertiesFile, $properties, [Text.Encoding]::ASCII)
    } finally {
        Remove-Item Env:\WHAT_TO_EAT_SIGNING_PASSWORD -ErrorAction SilentlyContinue
        $password = $null
    }
}

Push-Location $androidProject
try {
    & .\gradlew.bat --no-daemon --gradle-user-home $cacheDir assembleRelease lintRelease
    if ($LASTEXITCODE -ne 0) { throw 'Android build or lint failed' }
} finally { Pop-Location }

$apk = Join-Path $androidProject 'app\build\outputs\apk\release\app-release.apk'
$apksigner = Join-Path $SdkRoot 'build-tools\35.0.0\lib\apksigner.jar'
& $java -jar $apksigner verify --verbose --print-certs $apk
if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed' }

$releases = Join-Path $projectRoot 'release-packages'
$metadata = Get-Content -LiteralPath (Join-Path $androidProject 'app\build\outputs\apk\release\output-metadata.json') -Raw | ConvertFrom-Json
$versionName = $metadata.elements[0].versionName
if ($versionName -notmatch '^[0-9][0-9A-Za-z.\-]*$') { throw 'Unexpected APK version name' }
$publishedApk = Join-Path $releases ('吃点啥-安卓离线版-v' + $versionName + '.apk')
Copy-Item -LiteralPath $apk -Destination $publishedApk -Force
$guide = Join-Path $androidProject 'INSTALL.md'
Compress-Archive -LiteralPath $publishedApk,$guide -DestinationPath (Join-Path $releases '吃点啥-安卓端本地版.zip') -Force
$hashLine = (Get-FileHash -LiteralPath $publishedApk -Algorithm SHA256).Hash.ToLowerInvariant() + '  ' + [IO.Path]::GetFileName($publishedApk)
[IO.File]::WriteAllText(($publishedApk + '.sha256'), $hashLine + "`n", [Text.UTF8Encoding]::new($false))
Write-Output 'Signed APK and Android download ZIP are ready in release-packages.'
